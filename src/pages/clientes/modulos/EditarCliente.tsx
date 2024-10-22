import { useEffect, useState } from 'react';
import { LinearProgress, Paper, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { VTextField, VForm, useVForm } from '../../../components/forms';
import { FerramentasDeDetalhe } from '../../../components';
import { LayoutComponentePagina } from '../../../layouts';
import { ClientesService } from '../../../api/services/ClientesService';


interface IFormData {
  id?: number;
  nome: string;
  telefone?: string | null | undefined;
  email?: string | null | undefined;
  cpf?: string | null | undefined;
  //empresa: number;
  // usuario: string;
  ativo?: number;

}

const formValidationSchema = yup.object().shape({
  nome: yup.string().required().min(3),
  telefone: yup.string()
    .transform(value => value === '' ? null : value)
    .min(12, 'Telefone com formato incorreto')
    .nullable(),
  email: yup.string()
    .transform(value => value === '' ? null : value)
    .email()
    .nullable(),
  cpf: yup.string()
    .transform(value => value === '' ? null : value)
    .matches(/^\d{11}$/, 'CPF inválido')
    .nullable(),
});

interface Props {
  id: number | string;
}

export const EditarCliente = ({ id = 'cadastrar' }: Props) => {
  const { save,  ...methods } = useVForm<IFormData>({
    resolver: yupResolver(formValidationSchema)
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    ClientesService.getById(Number(id))
      .then((result) => {
        setIsLoading(false);

        if (result instanceof Error) {
          alert(result.message);
          navigate('/clientes');
        } else {

          methods.setValue('nome', result.nome);
          methods.setValue('telefone', result.telefone ?? '');
          methods.setValue('email', result.email ?? '');
          methods.setValue('cpf', result.cpf ?? '');
        }
      });
  }, [id]);

  const handleSave = (dados: IFormData) => {
    setIsLoading(true);
    ClientesService
      .updateById(Number(id), dados)
      .then((result) => {
        setIsLoading(false);

        if (result instanceof Error) {
          alert(result.message);
        } else {
          if (1===2) {
            navigate('/clientes');
          } else if (isSaveAndNew()) {
            // Lógica para novo registro
            navigate('/clientes/cadastrar');
          }
        }
      });
  };

  const handleDelete = (id: number) => {
    if (confirm('Realmente deseja apagar?')) {
      ClientesService.deleteById(id)
        .then(result => {
          if (result instanceof Error) {
            alert(result.message);
          } else {
            alert('Registro apagado com sucesso!');
            navigate('/clientes');
          }
        });
    }
  };


  return (
    <LayoutComponentePagina
      barraDeFerramentas={
        <FerramentasDeDetalhe
          textoBotaoNovo='Cadastrar'
      //    mostrarBotaoSalvarEFechar
          mostrarBotaoNovo={id !== 'cadastrar'}
          mostrarBotaoApagar={id !== 'cadastrar'}

          aoClicarEmSalvar={() => save(handleSave)}
      //    aoClicarEmSalvarEFechar={() => saveAndClose(handleSave)}
          aoClicarEmVoltar={() => navigate('/clientes')}
          aoClicarEmApagar={() => handleDelete(Number(id))}
          aoClicarEmNovo={() => navigate('/clientes/cadastrar')}
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
            {isLoading &&
              <Grid item>
                <LinearProgress variant='indeterminate' />
              </Grid>}

            <Grid item>
              <Typography variant='h6'>
                {id === 'cadastrar' ? 'Cadastrar' : 'Editar'}
              </Typography>
            </Grid>

            {/* Campos do formulário */}
            <Grid container item direction='row'>
              <Grid item xs={12} sm={10} md={8} lg={6} xl={5}>
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
                <VTextField
                  disabled={isLoading}
                  fullWidth
                  label='E-mail'
                  name='email'
                />
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </VForm>

    </LayoutComponentePagina>
  );
};
