import { useEffect, useState } from 'react';
import { LinearProgress, Paper, MenuItem } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { VTextField, VForm, useVForm, VSelect } from '../../../components/forms';
import { FerramentasDeDetalhe } from '../../../components';
import { LayoutComponentePagina } from '../../../layouts';
import { ProdutosService } from '../../../api/services/ProdutosService';
import { useSnackbar } from '../../../contexts/SnackBarProvider';



interface IFormData {
  nome: string;
}

const formValidationSchema = yup.object().shape({
  nome: yup.string().min(3, 'O nome deve ter pelo menos 3 caracteres').required('O nome é obrigatório'),
});

interface Props {
  id: number;
}

export const EditarCategoria = ({ id }: Props) => {
  const { showSnackbarMessage } = useSnackbar();
  const { save,  ...methods } = useVForm<IFormData>({
    resolver: yupResolver(formValidationSchema)
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {

    setIsLoading(true);

    ProdutosService.getCategoryById(Number(id))
      .then((result) => {
        setIsLoading(false);

        if (result instanceof Error) {
          alert(result.message);
          navigate('/categorias');
        } else {
          methods.setValue('nome', result.nome);
        }
      });
  }, [id]);

  const handleSave = (dados: IFormData) => {

    setIsLoading(true);
    ProdutosService
      .updateCategoryById(Number(id), dados)
      .then((result) => {
        setIsLoading(false);

        if (result instanceof Error) {
          alert(result.message);
        } else {
        showSnackbarMessage('Categoria atualizada com sucesso!');
         
        }
      });
  }

  const handleDelete = (id: number) => {
    if (confirm('Realmente deseja apagar?')) {
      ProdutosService.deleteById(id)
        .then(result => {
          if (result instanceof Error) {
            alert(result.message);
          } else {
            alert('Registro apagado com sucesso!');
            navigate('/produtos');
          }
        });
    }
  };


  return (
    <LayoutComponentePagina
      barraDeFerramentas={
        <FerramentasDeDetalhe
          textoBotaoNovo='Cadastrar'
         // mostrarBotaoSalvarEFechar
          mostrarBotaoNovo
          mostrarBotaoApagar

          aoClicarEmSalvar={() => save(handleSave)}
         // aoClicarEmSalvarEFechar={() => saveAndClose(handleSave)}
          aoClicarEmVoltar={() => navigate('/produtos')}
          aoClicarEmApagar={() => handleDelete(Number(id))}
          aoClicarEmNovo={() => navigate('/produtos/cadastrar')}
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

            <Grid container item direction='row' spacing={2}>
              <Grid item xs={4} sm={3} md={2} lg={2} xl={1.5}>

                <VSelect
                  fullWidth
                  label='Tipo'
                  name="tipo"
                  defaultValue="produto"
                  control={methods.control}
                  disabled
                >
                  <MenuItem value="produto">Produto</MenuItem>
                  <MenuItem value="servico">Serviço</MenuItem>
                </VSelect>

              </Grid>

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

          </Grid>

        </Paper>

      </VForm>

    </LayoutComponentePagina>
  );
};