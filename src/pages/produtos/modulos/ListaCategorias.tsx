import { useEffect, useMemo, useState } from 'react';
import { Grid, Icon, IconButton, LinearProgress, MenuItem, Pagination, TableBody, TableCell, TableFooter, TableRow, TextField } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FerramentasDaListagem } from '../../../components';
import { LayoutComponentePagina } from '../../../layouts';
import { Environment } from '../../../api/axios-config/environment';
import { ProdutosService, ICategoriasConsulta } from '../../../api/services/ProdutosService';
import { useDebounce } from '../../../shared/UseDebounce';
import { VTable } from '../../../components/grids/VTable';

export const ListaCategorias: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();

  const { debounce } = useDebounce();

  const [rows, setRows] = useState<ICategoriasConsulta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);


  const filter = useMemo(() => {
    return searchParams.get('filter') || '';
  }, [searchParams]);

  const tipo = useMemo(() => {
    return searchParams.get('tipo') || '';
  }, [searchParams]);

  const page = useMemo(() => {
    return Number(searchParams.get('page') || '1');
  }, [searchParams]);


  useEffect(() => {
    setIsLoading(true)
    debounce(() => {
      ProdutosService.getAllCategories(tipo, page, filter)
        .then((resp) => {
          setIsLoading(false)

          if (resp instanceof Error) {
            alert(resp.message)
          } else {

            setRows(resp.data)
            setTotalCount(resp.totalCount)
          }
        })
    })
  }, [tipo, filter, page]);


  return (
    <LayoutComponentePagina
      barraDeFerramentas={
        <FerramentasDaListagem
          mostrarInputBusca
          textoDaBusca={filter}
          textoBotaoNovo='Cadastrar'
          aoClicarEmNovo={() => navigate('/categorias/cadastrar')}
          aoMudarTextoDeBusca={(texto) => setSearchParams({ filter: texto }, { replace: true })}

        >
          <Grid container direction='row' spacing={2}>
            <Grid item xs={9.5} sm={5} md={3} lg={2.5} xl={2.5}>
              <TextField
                size='small'
                label="Tipo"
                fullWidth
                select
                value={tipo}
                onChange={(e) => setSearchParams({ tipo: e.target.value }, { replace: true })}
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="produto">Produto</MenuItem>
                <MenuItem value="servico">Serviço</MenuItem>
              </TextField>
            </Grid>
          </Grid>

        </FerramentasDaListagem>
      }
    >
      <VTable titles={['Ações', 'Tipo', 'Nome', 'Cadastrados']}>

        <TableBody >

          {rows.map((item, index) =>
            <TableRow key={index}>
              <TableCell>
                <IconButton size="small" onClick={() => navigate(`/categorias/detalhe/${item.id}`)}>
                  <Icon>edit</Icon>
                </IconButton>
              </TableCell>
              <TableCell>{item.tipo}</TableCell>
              <TableCell>{item.nome}</TableCell>
              <TableCell>{item.cadastrados}</TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={3}>
                <LinearProgress variant='indeterminate' />
              </TableCell>
            </TableRow>
          )}
          {(totalCount > 0 && totalCount > Environment.LIMITE_DE_LINHAS) && (
            <TableRow>
              <TableCell colSpan={3}>
                <Pagination
                  page={page}
                  count={Math.ceil(totalCount / Environment.LIMITE_DE_LINHAS)}
                  onChange={(_, newPage) => setSearchParams({ filter, page: newPage.toString() }, { replace: true })}
                />
              </TableCell>
            </TableRow>
          )}
        </TableFooter>
      </VTable>
    </LayoutComponentePagina>
  );
};
