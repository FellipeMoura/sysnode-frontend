import { useEffect, useState } from 'react';
import { LinearProgress, Paper, MenuItem } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useNavigate, useParams } from 'react-router-dom';
import * as yup from 'yup';

import { VTextField, VForm, useVForm, VSelect, VCash } from '../../../components/forms';
import { FerramentasDeDetalhe } from '../../../components';
import { LayoutComponentePagina } from '../../../layouts';
import { ProdutosService } from '../../../api/services/ProdutosService';
import { AutoCompleteCategory } from '../../../components/forms/AutoCompleteCategory';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from '../../../contexts/SnackBarProvider';

interface IFormData {
    tipo: string;
    categoria?: number | null | undefined;
    nome: string;
    valor: number;
}

const formValidationSchema = yup.object().shape({
    tipo: yup.string().required(),
    categoria: yup.number().nullable().optional(),
    nome: yup.string().min(3, 'O nome deve ter pelo menos 3 caracteres').required('O nome é obrigatório'),
    valor: yup.number().required('O valor é obrigatório'),
});

export const CadastrarProduto: React.FC = () => {
    const { showSnackbarMessage } = useSnackbar();
    const { save, ...methods } = useVForm<IFormData>({
        resolver: yupResolver(formValidationSchema)
    }); const { id = 'cadastrar' } = useParams<'id'>();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [tipo, setTipo] = useState<string>(''); // Gerencia o estado do tipo


    useEffect(() => {
        methods.setValue('nome', '');
        methods.setValue('tipo', '');
        methods.setValue('categoria', null);
        methods.setValue('valor', 0);
    }, [id]);

    const handleSave = (dados: IFormData) => {

        setIsLoading(true);
        ProdutosService.create(dados).then((result) => {
            setIsLoading(false);

            if (result instanceof Error) {
                alert(result.message);
            } else {
                showSnackbarMessage('Produto cadastrado com sucesso!');
                navigate(`/produtos/detalhe/${result}`);

            }
        });

    };

    return (
        <LayoutComponentePagina
            barraDeFerramentas={
                <FerramentasDeDetalhe
                    mostrarBotaoNovo={false}
                    mostrarBotaoApagar={false}
                    //      mostrarBotaoSalvarEFechar
                    aoClicarEmSalvar={() => save(handleSave)}
                    //     aoClicarEmSalvarEFechar={() => saveAndClose(handleSave)}
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
                        {isLoading && (
                            <Grid item>
                                <LinearProgress variant='indeterminate' />
                            </Grid>
                        )}

                        <Grid container item direction='row' spacing={2}>
                            <Grid item xs={4} sm={3} md={3} lg={2} xl={1.5}>
                                <VSelect
                                    fullWidth
                                    label='Tipo'
                                    name="tipo"

                                    control={methods.control}
                                    onChange={(e) => setTipo(e.target.value)}
                                >
                                    <MenuItem value="produto">Produto</MenuItem>
                                    <MenuItem value="servico">Serviço</MenuItem>
                                </VSelect>
                            </Grid>

                            <Grid item xs={8} sm={7} md={5} lg={4} xl={3.5}>
                                <AutoCompleteCategory
                                    isExternalLoading={isLoading}
                                    tipo={tipo} // Passa o tipo atualizado para o AutoComplete
                                />
                            </Grid>
                        </Grid>

                        <Grid container item direction='row'>
                            <Grid item xs={12} sm={10} md={8} lg={6} xl={5}>
                                <VTextField fullWidth label='Nome' name='nome' />
                            </Grid>
                        </Grid>

                        <Grid container item gap={2} direction='row'>
                            <Grid item xs={5} sm={3} md={3} lg={2} xl={1.5}>
                                <VCash
                                    disabled={isLoading}
                                    fullWidth
                                    label='Valor'
                                    name='valor'
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
            </VForm>
        </LayoutComponentePagina>
    );
};
