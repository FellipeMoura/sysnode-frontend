import { useEffect, useState } from 'react';
import { LinearProgress, Paper, MenuItem } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { VTextField, VForm, useVForm, VSelect } from '../../../components/forms';
import { FerramentasDeDetalhe } from '../../../components';
import { LayoutComponentePagina } from '../../../layouts';
import { ProdutosService } from '../../../api/services/ProdutosService';
import { useSnackbar } from '../../../contexts/SnackBarProvider';

interface IFormData {
    tipo: string;
    nome: string;
}

const formValidationSchema = yup.object().shape({

    tipo: yup.string().required(),
    nome: yup.string().min(3, 'O nome deve ter pelo menos 3 caracteres').required('O nome é obrigatório'),
});

export const CadastrarCategoria: React.FC = () => {
    const { showSnackbarMessage } = useSnackbar();
    const { save, ...methods } = useVForm<IFormData>({
        resolver: yupResolver(formValidationSchema)
    });
    const { id = 'cadastrar' } = useParams<'id'>();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    //const [resp, setResp] = useState<IProduto>({} as IProduto);

    useEffect(() => {
        methods.setValue('nome', '');
        methods.setValue('tipo', '');
    }, [id]);

    const handleSave = (dados: IFormData) => {

        setIsLoading(true);
        ProdutosService
            .createCategory(dados)
            .then((result) => {
                setIsLoading(false);

                if (result instanceof Error) {
                    alert(result.message);
                } else {
                    showSnackbarMessage('Categoria cadastrada com sucesso!');
                    navigate(`/categorias/detalhe/${result}`);

                }
            });

    }

    return (
        <LayoutComponentePagina
            barraDeFerramentas={
                <FerramentasDeDetalhe
                    mostrarBotaoNovo={false}
                    mostrarBotaoApagar={false}
                    //   mostrarBotaoSalvarEFechar

                    aoClicarEmSalvar={() => save(handleSave)}
                    //   aoClicarEmSalvarEFechar={() => saveAndClose(handleSave)}
                    aoClicarEmVoltar={() => navigate('/produtos')}
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
                            <Grid item xs={4} sm={4.5} md={2.5} lg={2} xl={1.5}>

                                <VSelect
                                    fullWidth
                                    label='Tipo'
                                    name="tipo"
                                    control={methods.control}
                                >
                                    <MenuItem value="produto">Produto</MenuItem>
                                    <MenuItem value="servico">Serviço</MenuItem>
                                </VSelect>

                            </Grid>
                        </Grid>

                        <Grid container item direction='row'>
                            <Grid item xs={12} sm={10} md={8} lg={6} xl={5} >
                                <VTextField

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

