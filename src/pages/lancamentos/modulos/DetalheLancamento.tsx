import { useCallback, useEffect, useState } from 'react';
import {
  LinearProgress, Paper, Grid, TableBody, TableRow, TableCell, IconButton, Icon, TableFooter, Button,
  Typography,
  Snackbar,
  Theme,
  useMediaQuery,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { VForm, useVForm, VCash, VNumericFormat } from '../../../components/forms';
import { ILancamentoConsulta, IVendaConsulta, LancamentosService } from '../../../api/services/LancamentosService';
import { FerramentasDeDetalhe } from '../../../components';
import { LayoutComponentePagina } from '../../../layouts';
import { VTable } from '../../../components/grids/VTable';
import moment from 'moment';
import { toCash } from '../../../shared/functions';
import { AutoCompleteProduto } from '../../../components/forms/AutoCompleteProduto';

interface IFormData {
  id_vendas: number;
  id_produto: number;
  qnt: number;
  valor: number;
  valor_base?: number | null | undefined;
  tipo: string;
}

const formValidationSchema = yup.object().shape({
  id_produto: yup.number().min(1, 'Nenhum produto ou serviço selecionado').required(),
  qnt: yup.number().min(1, 'A quantidade deve ser maior que zero').required(),
  valor_base: yup.number().nullable().optional(),
  valor: yup.number().required(),
});

interface Props {
  id: number;
}


export const DetalheLancamento = ({ id }: Props) => {
  const { save, ...methods } = useVForm<Omit<IFormData, 'id_vendas' | 'tipo'>>({
    resolver: yupResolver(formValidationSchema),
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [venda, setVenda] = useState<IVendaConsulta>();
  const [lancamentos, setLancamentos] = useState<ILancamentoConsulta[]>([]);
  const [showSnackbar, setShowSnackbar] = useState<string | null>(null);
  const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  
  const fetchVendaELancamentos = useCallback(async () => {
    setIsLoading(true);
    try {
      const [vendaResponse, lancamentosResponse] = await Promise.all([
        LancamentosService.getVendaById(Number(id)),
        LancamentosService.getAll('id_vendas', id),
      ]);

      if (vendaResponse instanceof Error) {
        throw new Error('Erro ao carregar a venda.');
      }

      if (lancamentosResponse instanceof Error) {
        throw new Error('Erro ao carregar os lançamentos.');
      }

      // Atualiza os estados somente se não houver erros
      setVenda(vendaResponse);
      setLancamentos(lancamentosResponse.data);
    } catch (error) {
      setShowSnackbar('Erro ao carregar dados.');
      navigate('/lancamentos');
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchVendaELancamentos();
    methods.setValue('id_produto', 0);
    methods.setValue('qnt', 1);
    methods.setValue('valor_base', 0);
    methods.setValue('valor', 0);
  }, []);


  const handleSave = useCallback(async (dados: IFormData) => {
    setIsLoading(true);
    try {
      await LancamentosService.create(dados);
      fetchVendaELancamentos(); // Recarrega a lista
      methods.reset();
    } catch (error) {
      setShowSnackbar('Erro ao salvar.');
    } finally {
      setIsLoading(false);
    }
  }, [fetchVendaELancamentos, methods]);

  const handleDelete = useCallback(async (id: number) => {
    if (window.confirm('Realmente deseja apagar?')) {
      try {
        await LancamentosService.deleteById('lancamentos', id);
        setShowSnackbar('Registro apagado com sucesso!');
        fetchVendaELancamentos();
      } catch (error) {
        setShowSnackbar('Erro ao apagar.');
      }
    }
  }, [fetchVendaELancamentos]);

  const onSubmit = useCallback((dados: Omit<IFormData, 'id_vendas' | 'tipo'>) => {
    const dadosCompletos = {
      ...dados,
      tipo: venda?.id_cliente ? 'receita' : 'despesa',
      id_vendas: Number(id),
    };
    handleSave(dadosCompletos);
  }, [handleSave, id, venda]);
  const isProdutoSelecionado = methods.watch('id_produto'); // Verifica se o id_produto foi selecionado

  const handleDeleteVenda = useCallback(async (id: number) => {
    if (window.confirm('Realmente deseja apagar?')) {
      try {
        await LancamentosService.deleteById('vendas', id);
        setShowSnackbar('Registro apagado com sucesso!');
        navigate('/lancamentos');
      } catch (error) {
        setShowSnackbar('Erro ao apagar.');
      }
    }
  }, [fetchVendaELancamentos]);
  return (
    <LayoutComponentePagina
      barraDeFerramentas={
        <FerramentasDeDetalhe
          textoBotaoNovo='Cadastrar'
          mostrarBotaoNovo
          mostrarBotaoApagar
          aoClicarEmSalvar={() => save(onSubmit)}
          aoClicarEmVoltar={() => navigate('/lancamentos')}
          aoClicarEmApagar={() => handleDeleteVenda(Number(id))}
          aoClicarEmNovo={() => navigate('/lancamentos/novo')}
        />
      }
    >
      {showSnackbar && (
        <Snackbar
          open={!!showSnackbar}
          autoHideDuration={6000}
          onClose={() => setShowSnackbar(null)}
          message={showSnackbar}
        />
      )}
      <DetalheLancamentoHeader venda={venda} />
      <VForm methods={methods} onSubmit={onSubmit}>
        <Paper
          variant='outlined'
          sx={{
            margin: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Grid container direction='column' padding={2} spacing={2}>
            {isLoading && (
              <Grid item>
                <LinearProgress variant='indeterminate' />
              </Grid>
            )}

            <Grid container item direction="column" spacing={2}>
              <Grid item>
                <VTable overflow={'hidden'} titles={smDown ?
                  ['', 'Produto', 'Qnt', 'Valor']
                  :
                  ['', 'Produto', 'Itens', 'Valor', 'Valor Base', 'Tipo']}
                >
                  <TableBody>
                    {lancamentos.map((lancamento, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <IconButton size="small" onClick={() => handleDelete(lancamento.id)}>
                            <Icon>delete</Icon>
                          </IconButton>
                        </TableCell>
                        <TableCell>{lancamento.nome_produto}</TableCell>
                        <TableCell>{lancamento.qnt}</TableCell>
                        <TableCell>{lancamento.valor}</TableCell>
                        {!smDown && <>
                          <TableCell>{lancamento.valor_base}</TableCell>
                          <TableCell>{lancamento.tipo_produto}</TableCell>
                        </>}
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={6}>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={9}>
                            <AutoCompleteProduto isExternalLoading={isLoading} />
                          </Grid>
                          {!!isProdutoSelecionado && (
                            <>
                              <Grid item xs={3} sm={2}>
                                <VNumericFormat
                                  disabled={isLoading}
                                  fullWidth
                                  label='Qnt'
                                  name='qnt'
                                />
                              </Grid>
                              <Grid item xs={4} sm={4}>
                                <VCash
                                  disabled={isLoading}
                                  fullWidth
                                  label='Valor'
                                  name='valor'
                                />
                              </Grid>
                              <Grid item xs={4} sm={4}>
                                <VCash
                                  disabled
                                  fullWidth
                                  label='Valor Base'
                                  name='valor_base'
                                />
                              </Grid>
                              <Grid item >
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={() => save(onSubmit)}
                                  disabled={isLoading}
                                >
                                  Inserir
                                </Button>
                              </Grid>
                            </>
                          )}
                        </Grid>
                      </TableCell>
                    </TableRow>
                    {isLoading && (
                      <TableRow>
                        <TableCell colSpan={6}>
                          <LinearProgress variant="indeterminate" />
                        </TableCell>
                      </TableRow>
                    )}
                  </TableFooter>
                </VTable>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </VForm>
    </LayoutComponentePagina>
  );
};

export const DetalheLancamentoHeader = ({ venda }: IVendaConsulta | any) => {
  const formattedDate = moment(venda?.data).format('DD/MM/YYYY');

  return (
    !!venda &&
    <Paper
      variant='outlined'
      sx={{
        p: 2,
        m: 1,
      }}
    >
      <Grid container spacing={1}>
        <Grid item xs={4.5} md={4}>
          <Typography variant='subtitle1'>
            {venda.id_cliente ? 'Venda' : 'Compra'}
          </Typography>
          <Typography variant='body2' color='textSecondary'>
            Data: {formattedDate}
          </Typography>
        </Grid>
        <Grid item xs={7} md={4}>
          <Typography variant='subtitle1'>
            {venda.id_cliente ? 'Cliente' : 'Fornecedor'}
          </Typography>
          <Typography variant='body2' color='textSecondary'>
            {venda.nome_agente}
          </Typography>
        </Grid>
        {!!venda.nome_funcionario &&
          <Grid item xs={4.5} md={4}>
            <Typography variant='subtitle1'>Atendente</Typography>
            <Typography variant='body2' color='textSecondary'>
              {venda.nome_funcionario}
            </Typography>
          </Grid>
        }
        <Grid item xs={7} md={4}>
          <Typography variant='subtitle1'>Quantidade de Itens</Typography>
          <Typography variant='body2' color='textSecondary'>
            {venda.qnt_itens}
          </Typography>
        </Grid>
        <Grid item xs={4.5} md={4}>
          <Typography variant='subtitle1'>Valor Total</Typography>
          <Typography variant='body2' color='textSecondary'>
            {toCash(venda.valor_itens)}
          </Typography>
        </Grid>

        <Grid item xs={4.5} md={4}>
          <Typography variant='subtitle1'>Valor Base</Typography>
          <Typography variant='body2' color='textSecondary'>
            {toCash(venda.valor_base_itens)}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};