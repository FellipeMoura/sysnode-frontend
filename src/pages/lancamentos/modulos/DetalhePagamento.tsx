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
import { IPagamento, PagamentosService } from '../../../api/services/PagamentosService';
import { FerramentasDeDetalhe } from '../../../components';
import { LayoutComponentePagina } from '../../../layouts';
import { VTable } from '../../../components/grids/VTable';
import moment from 'moment';
import { toCash } from '../../../shared/functions';
import { AutoCompleteMetodoPagamento } from '../../../components/forms/AutoCompleteMetodoPagamento';
import { IVendaConsulta, LancamentosService } from '../../../api/services/LancamentosService';

interface IFormData {
  id_cliente?: number | null | undefined;
  id_fornecedor?: number | null | undefined;
  id_vendas: number;
  metodo: string;
  valor: number;
  parcelas: number;
}

const formValidationSchema = yup.object().shape({
  metodo: yup.string().min(1, 'Nenhum método de pagamento selecionado').required(),
  valor: yup.number().min(0.01, 'O valor deve ser maior que zero').required(),
  parcelas: yup.number().required("Defina a quatidade de parcelas"),
  id_cliente: yup.number().nullable().optional(),
  id_fornecedor: yup.number().nullable().optional(),
  id_vendas: yup.number().required(),
});

interface Props {
  id: number;
}

export const DetalhePagamento = ({ id }: Props) => {
  const { save, ...methods } = useVForm<IFormData>({
    resolver: yupResolver(formValidationSchema),
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [pagamentos, setPagamentos] = useState<IPagamento[]>([]);
  const [showSnackbar, setShowSnackbar] = useState<string | null>(null);
  const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const [venda, setVenda] = useState<IVendaConsulta>();

  const fetchPagamentos = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await PagamentosService.getAll(id);

      if (response instanceof Error) {
        throw new Error('Erro ao carregar os pagamentos.');
      }

      setPagamentos(response.data);
    } catch (error) {
      setShowSnackbar('Erro ao carregar dados.');
      navigate('/pagamentos');
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate]);

  const fetchVenda = useCallback(async () => {
    setIsLoading(true);
    try {
      const [vendaResponse] = await Promise.all([
        LancamentosService.getVendaById(Number(id)),
     
      ]);

      if (vendaResponse instanceof Error) {
        throw new Error('Erro ao carregar a venda.');
      }

     

      // Atualiza os estados somente se não houver erros
      setVenda(vendaResponse);
      
    } catch (error) {
      setShowSnackbar('Erro ao carregar dados.');
      navigate('/lancamentos');
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchVenda();
    fetchPagamentos();
    methods.setValue('metodo', 'pix');
    methods.setValue('valor', 0);
    methods.setValue('parcelas', 1);
  }, []);

  const handleSave = useCallback(async (dados: IFormData) => {
    setIsLoading(true);
    try {
      await PagamentosService.create(dados);
      fetchPagamentos(); // Recarrega a lista
      methods.reset();
    } catch (error) {
      setShowSnackbar('Erro ao salvar.');
    } finally {
      setIsLoading(false);
    }
  }, [fetchPagamentos, methods]);

  const handleDelete = useCallback(async (id: number) => {
    if (window.confirm('Realmente deseja apagar?')) {
      try {
        await PagamentosService.deleteById(id);
        setShowSnackbar('Registro apagado com sucesso!');
        fetchPagamentos();
      } catch (error) {
        setShowSnackbar('Erro ao apagar.');
      }
    }
  }, [fetchPagamentos]);

  const onSubmit = useCallback((dados: IFormData) => {
    const dadosAtualizados = {
      ...dados,
      id_vendas: id,
      id_cliente: venda?.id_cliente || null,
      id_fornecedor: venda?.id_fornecedor || null,
    };
  
    handleSave(dadosAtualizados);
  }, [handleSave, id, venda]);


  const isMetodoPagamentoSelecionado = methods.watch('metodo');

  const metodos = [
    { id: 'pix', label: 'Pix' },
    { id: 'debito', label: 'Débito' },
    { id: 'credito', label: 'Crédito' },
    { id: 'dinheiro', label: 'Dinheiro' },
    { id: 'boleto', label: 'Boleto' },
  ]
  return (
    <LayoutComponentePagina
      barraDeFerramentas={
        <FerramentasDeDetalhe
          textoBotaoNovo='Cadastrar'
          mostrarBotaoNovo
          mostrarBotaoApagar
          aoClicarEmSalvar={() => save(onSubmit)}
          aoClicarEmVoltar={() => navigate('/pagamentos')}
          aoClicarEmNovo={() => navigate('/pagamentos/novo')}
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
      <DetalhePagamentoHeader venda={venda} />
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
                  ['', 'Método', 'Valor', 'Data']
                  :
                  ['', 'Método de Pagamento', 'Valor', 'Data']}
                >
                  <TableBody>
                    {pagamentos.map((pagamento, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <IconButton size="small" onClick={() => handleDelete(pagamento.id)}>
                            <Icon>delete</Icon>
                          </IconButton>
                        </TableCell>
                        <TableCell>{metodos.find((element)=> element.id === pagamento.metodo)?.label}</TableCell>
                        <TableCell>{toCash(pagamento.valor)}</TableCell>
                        <TableCell>{pagamento.parcelas}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={4}>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={9}>
                            <AutoCompleteMetodoPagamento isExternalLoading={isLoading} />
                          </Grid>
                          {!!isMetodoPagamentoSelecionado && (
                            <>
                              <Grid item xs={3} sm={4}>
                                <VCash
                                  disabled={isLoading}
                                  fullWidth
                                  label='Valor'
                                  name='valor'
                                />
                              </Grid>

                              <Grid item xs={3} sm={4}>
                                <VNumericFormat
                                  disabled={isLoading}
                                  fullWidth
                                  min={1}
                                  max={20}
                                  label='Parcelas'
                                  name='parcelas'
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
                        <TableCell colSpan={4}>
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

export const DetalhePagamentoHeader = ({ venda }: IVendaConsulta | any) => {
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
