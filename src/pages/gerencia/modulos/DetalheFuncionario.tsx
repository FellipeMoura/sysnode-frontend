import { useEffect, useState } from 'react';
import { LinearProgress, MenuItem, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import { VTextField, VForm, useVForm, VSelect } from '../../../components/forms';
import { FerramentasDeDetalhe } from '../../../components';
import { LayoutComponentePagina } from '../../../layouts';
import { FuncionariosService } from '../../../api/services/FuncionariosService';
import { yupResolver } from '@hookform/resolvers/yup';
import { VSwitch } from '../../../components/forms/VSwitch';
import { options_grupo } from '../../../shared/template';
import { useSnackbar } from '../../../contexts/SnackBarProvider';


interface IFormData {
  id?: number;
  nome: string;
  telefone?: string | null | undefined;
  cpf?: string | null | undefined;
  grupo?: string | null | undefined;
  login?: string | null | undefined;
  ativo?: number;

}

const formValidationSchemaCreate = yup.object().shape({
  nome: yup.string().required().min(3),
  telefone: yup.string()
    .transform(value => value === '' ? null : value)
    .min(12, 'Telefone com formato incorreto')
    .nullable(),
  login: yup.string().max(20).nullable(),
  cpf: yup.string()
    .transform(value => value === '' ? null : value)
    .matches(/^\d{11}$/, 'CPF inválido')
    .nullable(),
  grupo: yup.string().nullable(),
});

const formValidationSchemaUpdate = yup.object().shape({
  nome: yup.string().required().min(3),
  telefone: yup.string()
    .transform(value => value === '' ? null : value)
    .min(12, 'Telefone com formato incorreto')
    .nullable(),
  login: yup.string().max(20).nullable(),
  cpf: yup.string()
    .transform(value => value === '' ? null : value)
    .matches(/^\d{11}$/, 'CPF inválido')
    .nullable(),
  grupo: yup.string().nullable(),
  ativo: yup.number().optional(),
});

interface Props {
  id: string | number;
}

export const DetalheFuncionario = ({ id }: Props) => {
  const { showSnackbarMessage } = useSnackbar();
  const { save, ...methods } = useVForm<IFormData>({
    resolver: yupResolver(id !== 'cadastrar' ? formValidationSchemaUpdate : formValidationSchemaCreate),
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id !== 'cadastrar') {
      setIsLoading(true);

      FuncionariosService.getById(Number(id))
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            alert(result.message);
            navigate('/colaboradores');
          } else {

            methods.setValue('nome', result.nome);
            methods.setValue('telefone', result.telefone ?? '');
            methods.setValue('login', result.login ?? '');
            methods.setValue('cpf', result.cpf ?? '');
            methods.setValue('grupo', result.grupo ?? '');
            methods.setValue('ativo', result.ativo);
          }
        });
    } else {

      methods.setValue('nome', '');
      methods.setValue('telefone', '');
      methods.setValue('login', '');
      methods.setValue('cpf', '');
      methods.setValue('grupo', '');
    }
  }, [id]);

  const handleSave = (dados: IFormData) => {
    if (id === 'cadastrar') {

      setIsLoading(true);
      FuncionariosService
        .create(dados)
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            alert(result.message);
          } else {
            showSnackbarMessage('Cadastro realizado com sucesso!');
            navigate(`/colaboradores/detalhe/${result}`);
          }
        });

    } else {

      setIsLoading(true);
      FuncionariosService
        .updateById(Number(id), dados)
        .then((result) => {
          setIsLoading(false);

          if (result instanceof Error) {
            alert(result.message);
          } else {
            showSnackbarMessage('Cadastro atualizado com sucesso!');
            navigate('/colaboradores');

          }
        });
    }

  }

  const handleDelete = (id: number) => {
    if (confirm('Realmente deseja apagar?')) {
      FuncionariosService.deleteById(id)
        .then(result => {
          if (result instanceof Error) {
            alert(result.message);
          } else {
            alert('Registro apagado com sucesso!');
            navigate('/colaboradores');
          }
        });
    }
  };


  return (
    <LayoutComponentePagina
      barraDeFerramentas={
        <FerramentasDeDetalhe
          textoBotaoNovo='Cadastrar'
          //   mostrarBotaoSalvarEFechar
          mostrarBotaoNovo={id !== 'cadastrar'}
          mostrarBotaoApagar={id !== 'cadastrar'}

          aoClicarEmSalvar={() => save(handleSave)}
          //  aoClicarEmSalvarEFechar={() => saveAndClose(handleSave)}
          aoClicarEmVoltar={() => navigate('/colaboradores')}
          aoClicarEmApagar={() => handleDelete(Number(id))}
          aoClicarEmNovo={() => navigate('/colaboradores/detalhe/cadastrar')}
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

          <Grid container sx={{flexDirection:'column'}} padding={2} spacing={2}>

            {isLoading &&
              <Grid item>
                <LinearProgress variant='indeterminate' />
              </Grid>}

            <Grid item>
              <Typography variant='h6'>
                {id === 'cadastrar' ? 'Cadastrar' : 'Editar'}
              </Typography>
            </Grid>

            <Grid container item direction='row'>
              <Grid item xs={12} sm={10} md={8} lg={6} xl={5} >
                <VTextField
                  disabled={isLoading}
                  fullWidth
                  label='Nome'
                  name='nome'
                />
              </Grid>
            </Grid>

            <Grid container item direction='row'>
              <Grid item xs={10} sm={8} md={6} lg={4} xl={3}>
                <VTextField
                  disabled={isLoading}
                  fullWidth
                  label='Telefone'
                  name='telefone'
                />
              </Grid>
            </Grid>

            <Grid container item direction='row'>
              <Grid item xs={10} sm={8} md={6} lg={4} xl={3}>
                <VTextField
                  disabled={isLoading}
                  fullWidth
                  label='CPF'
                  name='cpf'
                />
              </Grid>
            </Grid>

            <Grid container item direction='row'>
              <Grid item xs={10} sm={8} md={6} lg={4} xl={3}>
                <VSelect
                  disabled={isLoading}
                  fullWidth

                  label='Grupo'
                  name='grupo'
                  control={methods.control}
                >
                  {
                    options_grupo.map(option => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.label}
                      </MenuItem>
                    ))
                  }

                </VSelect>
              </Grid>
            </Grid>

            <Grid container item direction='row'>
              <Grid item xs={10} sm={8} md={6} lg={4} xl={3}>
                <VTextField
                  disabled={isLoading}
                  fullWidth
                  label='Login'
                  name='login'
                />
              </Grid>
            </Grid>
            {id !== 'cadastrar' &&
              <Grid item >

                <VSwitch
                  disabled={isLoading}
                  label='Ativo'
                  name='ativo'
                />

              </Grid>

            }
          </Grid>

        </Paper>

      </VForm>
    </LayoutComponentePagina>
  );
};
