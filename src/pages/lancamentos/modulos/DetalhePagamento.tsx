import { useCallback, useEffect, useState } from 'react';
import { LinearProgress, Paper, Grid, TableBody, TableRow, TableCell, IconButton, Icon, TableFooter, Button, Typography, Theme, useMediaQuery} from '@mui/material';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import { AutoCompleteMetodoPagamento } from '../../../components/forms/AutoCompleteMetodoPagamento';
import { IVendaConsulta, LancamentosService } from '../../../api/services/LancamentosService';
import { IPagamento, PagamentosService } from '../../../api/services/PagamentosService';
import { VForm, useVForm, VCash, VNumericFormat } from '../../../components/forms';
import { useSnackbar } from '../../../contexts/SnackBarProvider';
import { FerramentasDeDetalhe } from '../../../components';
import { LayoutComponentePagina } from '../../../layouts';
import { VTable } from '../../../components/grids/VTable';
import { options_metodo } from '../../../shared/template';
import { toCash } from '../../../shared/functions';

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

});

interface Props {
  id: number;
}

export const DetalhePagamento = ({ id }: Props) => {
  const { showSnackbarMessage } = useSnackbar();
  const { save, ...methods } = useVForm<Omit<IFormData, 'id_vendas' | 'id_cliente' | 'id_fornecedor'>>({
    resolver: yupResolver(formValidationSchema),
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [pagamentos, setPagamentos] = useState<IPagamento[]>([]);
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
      showSnackbarMessage('Erro ao carregar dados.');
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
      showSnackbarMessage('Erro ao carregar dados.');
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
    console.log("Salvando dados: ", dados); // Debug
    setIsLoading(true);
    try {
      await PagamentosService.create(dados);
      fetchPagamentos(); // Recarrega a lista
      fetchVenda();
      methods.reset();
    } catch (error) {
      console.error("Erro ao salvar: ", error);
      showSnackbarMessage('Erro ao salvar.');
    } finally {
      setIsLoading(false);
    }
  }, [fetchPagamentos, methods]);


  const handleDelete = useCallback(async (id: number) => {
    if (window.confirm('Realmente deseja apagar?')) {
      try {
        await PagamentosService.deleteById(id);
        showSnackbarMessage('Registro apagado com sucesso!');
        fetchPagamentos();
        fetchVenda();
      } catch (error) {
        showSnackbarMessage('Erro ao apagar.');
      }
    }
  }, [fetchPagamentos]);

  const onSubmit = useCallback((dados: Omit<IFormData, 'id_vendas' | 'id_cliente' | 'id_fornecedor'>) => {

    const dadosAtualizados = {
      ...dados,
      id_vendas: id,
      valor: Number(dados.valor),
      id_cliente: venda?.id_cliente || null,
      id_fornecedor: venda?.id_fornecedor || null,
    };
    handleSave(dadosAtualizados);
  }, [handleSave, id, venda]);

  return (
    <LayoutComponentePagina
      barraDeFerramentas={
        <FerramentasDeDetalhe
          mostrarBotaoNovo={false}
          mostrarBotaoApagar={false}
          mostrarBotaoSalvar={false}
          aoClicarEmVoltar={() => navigate('/lancamentos')}
        />

      }
    >
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
          <Grid container sx={{flexDirection:'column'}} padding={2} spacing={2}>
            {isLoading && (
              <Grid item>
                <LinearProgress variant='indeterminate' />
              </Grid>
            )}

            <Grid container item direction="column" spacing={2}>
              <Grid item>
                <VTable overflow={'hidden'} titles={smDown ?
                  ['', 'Método', 'Valor', 'Parcelas']
                  :
                  ['', 'Método de Pagamento', 'Valor', 'Parcelas']}
                >
                  <TableBody>
                    {pagamentos.map((pagamento, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <IconButton size="small" onClick={() => handleDelete(pagamento.id)}>
                            <Icon>delete</Icon>
                          </IconButton>
                        </TableCell>
                        <TableCell>{options_metodo.find((element) => element.id === pagamento.metodo)?.label}</TableCell>
                        <TableCell>{toCash(pagamento.valor)}</TableCell>
                        <TableCell>{pagamento.parcelas}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    {!venda?.pago &&
                      <>
                        <TableRow>
                          <TableCell colSpan={4}>
                            <Grid container spacing={2} alignItems="center">
                              <Grid item xs={6} sm={4}>
                                <AutoCompleteMetodoPagamento isExternalLoading={isLoading} />
                              </Grid>

                              <>
                                <Grid item xs={5} sm={3}>
                                  <VCash
                                    disabled={isLoading}
                                    fullWidth
                                    label='Valor'
                                    name='valor'
                                  />
                                </Grid>

                                <Grid item xs={4} sm={2}>
                                  <VNumericFormat
                                    disabled={isLoading || !(options_metodo.find((element) => element.id === methods.getValues('metodo'))?.isParcelas)}
                                    fullWidth
                                    min={1}
                                    max={20}
                                    isParcelas={!(options_metodo.find((element) => element.id === methods.getValues('metodo'))?.isParcelas)}
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

                            </Grid>
                          </TableCell>
                        </TableRow>

                      </>}
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
          <Typography variant='subtitle1'>Valor Total</Typography>
          <Typography variant='body2' color='textSecondary'>
            {toCash(venda.valor_itens)}
          </Typography>
        </Grid>
        {!!venda.pago ?
          <Grid item xs={4.5} md={4}>
            <Typography variant='subtitle1'>Valor Pendente</Typography>
            <Typography variant='body2' color='green'>Pago</Typography>

          </Grid>
          :

          <Grid item xs={4.5} md={4}>
            <Typography variant='subtitle1'>Valor Pendente</Typography>
            <Typography variant='body2' color='textSecondary'>
              {toCash(venda.valor_itens - (venda.valor_pago || 0))}
            </Typography>
          </Grid>

        }
         
      </Grid>
    </Paper>
  );
};
