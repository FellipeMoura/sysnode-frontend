import { useEffect, useState } from 'react';
import {  LinearProgress, Paper, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { VForm, useVForm, VDateInput } from '../../../components/forms';
import { AutoCompleteCliente } from '../../../components/forms/AutoCompleteCliente';
import { AutoCompleteFornecedor } from '../../../components/forms/AutoCompleteFornecedor';
import { AutoCompleteFuncionario } from '../../../components/forms/AutoCompleteFuncionario';
import moment from 'moment';
import { LancamentosService } from '../../../api/services/LancamentosService';
import { LayoutComponentePagina } from '../../../layouts';
import { FerramentasDeDetalhe } from '../../../components';

interface IFormData {
  id_funcionario?: number | null;
  data: string;
  id_fornecedor?: number | null;
  id_cliente?: number | null;
}


const formValidationSchema = yup.object().shape({
  id_cliente: yup.number().nullable(),
  id_fornecedor: yup.number().nullable(),
  id_funcionario: yup.number().nullable(),
  data: yup.string().required(),
})

interface Props {
  tipo: 'venda' | 'compra';
}

export const CadastrarVenda = ({ tipo }: Props) => {
  const { save,  ...methods } = useVForm<IFormData>({
    resolver: yupResolver(formValidationSchema),
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    methods.setValue('id_cliente', null)
    methods.setValue('id_funcionario', null)
    methods.setValue('id_fornecedor', null);
    methods.setValue('data', moment().format('YYYY-MM-DD'));

  }, [tipo]);


  const handleSave = (dados: IFormData) => {

    if (methods.getValues('id_cliente') === null && methods.getValues('id_fornecedor') === null) {
      alert('Selecione um cliente ou fornecedor');
    } else {

      setIsLoading(true);
      LancamentosService.createVenda(dados)
        .then((result) => {
          setIsLoading(false);
          if (result instanceof Error) {
            alert(result.message);
          } else {
            if (1===2) {
              navigate('/lancamentos');
            } else {
              navigate(`/lancamentos/detalhe/${result}`);
            }
          }

        });
    };
  }


  return (
    <LayoutComponentePagina
      barraDeFerramentas={
        <FerramentasDeDetalhe
          textoBotaoNovo='Cadastrar'
          mostrarBotaoApagar={false}
          mostrarBotaoNovo={false}
          //    mostrarBotaoSalvarEFechar


          aoClicarEmSalvar={() => save(handleSave)}
          //    aoClicarEmSalvarEFechar={() => saveAndClose(handleSave)}
          aoClicarEmVoltar={() => navigate('/lancamentos')}
          // aoClicarEmApagar={() => }
        />

      }
    >

      <VForm methods={methods} onSubmit={handleSave}>
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
            {isLoading && <Grid item><LinearProgress variant='indeterminate' /></Grid>}
            <Grid container item direction='row' spacing={2}>
              <Grid item xs={10} sm={7} md={5} lg={4} xl={3}>
                <Grid item>
                  <VDateInput label='Data' name='data' />
                </Grid>
              </Grid>
            </Grid>

            <Grid container item direction='row'>
              <Grid item xs={12} sm={10} md={7} lg={6} xl={5}>
                {tipo === 'venda' ? <AutoCompleteCliente isExternalLoading={isLoading} /> : <AutoCompleteFornecedor isExternalLoading={isLoading} />}
              </Grid>
            </Grid>

            <Grid container item direction='row' spacing={2}>
              <Grid item xs={10} sm={7} md={5} lg={4} xl={3}>
                <AutoCompleteFuncionario isExternalLoading={isLoading} />
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </VForm>


    </LayoutComponentePagina>
  );
};
