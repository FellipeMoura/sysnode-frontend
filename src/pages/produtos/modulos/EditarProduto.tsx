import { useEffect, useState } from 'react';
import { LinearProgress, Paper, MenuItem } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import { VTextField, VForm, useVForm, VSelect, VCash } from '../../../components/forms';
import { FerramentasDeDetalhe } from '../../../components';
import { LayoutComponentePagina } from '../../../layouts';
import { ProdutosService } from '../../../api/services/ProdutosService';
import { AutoCompleteCategory } from '../../../components/forms/AutoCompleteCategory';
import { yupResolver } from '@hookform/resolvers/yup';
import { VSwitch } from '../../../components/forms/VSwitch';



interface IFormData {
  tipo: string;
  categoria?: number | null | undefined;
  nome: string;
  valor: number;
  ativo: number;
}

const formValidationSchema = yup.object().shape({
  categoria: yup.number().nullable().optional(),
  nome: yup.string().min(3, 'O nome deve ter pelo menos 3 caracteres').required('O nome é obrigatório'),
  tipo: yup.string().required('O tipo é obrigatório'),
  valor: yup.number().required('O valor é obrigatório'),
  ativo: yup.number().required(),
});

interface Props {
  id: number;
}

export const EditarProduto = ({ id }: Props) => {
  const { save,  ...methods } = useVForm<IFormData>({
    resolver: yupResolver(formValidationSchema)
  });
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [tipo, setTipo] = useState<string>(''); // Gerencia o estado do tipo
  useEffect(() => {

    setIsLoading(true);

    ProdutosService.getById(Number(id))
      .then((result) => {
        setIsLoading(false);

        if (result instanceof Error) {
          alert(result.message);
          navigate('/produtos');
        } else {
          setTipo(result.tipo);
          methods.setValue('nome', result.nome);
          methods.setValue('tipo', result.tipo ?? '');
          methods.setValue('categoria', result.categoria ?? null);
          methods.setValue('valor', result.valor ?? '');
          methods.setValue('ativo', result.ativo ?? 0);
        }
      });
  }, [id]);

  const handleSave = (dados: IFormData) => {

    setIsLoading(true);
    ProdutosService
      .updateById(Number(id), dados)
      .then((result) => {
        setIsLoading(false);

        if (result instanceof Error) {
          alert(result.message);
        } else {
          if (1===2) {
            navigate('/produtos');
          }
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
       //   mostrarBotaoSalvarEFechar
          mostrarBotaoNovo
          mostrarBotaoApagar

          aoClicarEmSalvar={() => save(handleSave)}
       //   aoClicarEmSalvarEFechar={() => saveAndClose(handleSave)}
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

          <Grid container direction='column' padding={2} spacing={2}>

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
                  defaultValue={tipo}
                  disabled
                  control={methods.control} 
                >
                  <MenuItem value="produto">Produto</MenuItem>
                  <MenuItem value="servico">Serviço</MenuItem>
                </VSelect>

              </Grid>
              <Grid item xs={5}>
                <AutoCompleteCategory
                  isExternalLoading={isLoading}
                  tipo={tipo} // Passa o tipo atualizado para o AutoComplete
                />
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


            <Grid container item gap={2} direction='row'>
              <Grid item xs={10} sm={8} md={6} lg={4} xl={3}>
                <VCash
                  disabled={isLoading}
                  fullWidth
                  label='Valor'
                  name='valor'
                />
              </Grid>
            </Grid>


            <Grid item direction='row'>
                
            <VSwitch
                  disabled={isLoading}
                  label='Ativo'
                  name='ativo'
                />
            </Grid>

          </Grid>

        </Paper>

      </VForm>

    </LayoutComponentePagina>
  );
};