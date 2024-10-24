import { useEffect, useMemo, useState } from 'react';
import { Icon, IconButton, LinearProgress, Pagination, TableBody, TableCell, TableFooter, TableRow } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FerramentasDaListagem } from '../../../components';
import { LayoutComponentePagina } from '../../../layouts';
import { Environment } from '../../../api/axios-config/environment';
import { ProdutosService, IServicoConsulta } from '../../../api/services/ProdutosService';
import { useDebounce } from '../../../shared/UseDebounce';
import { VTable } from '../../../components/grids/VTable';

export const ListaServicos: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();

  const { debounce } = useDebounce();

  const [rows, setRows] = useState<IServicoConsulta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);


  const filter = useMemo(() => {
    return searchParams.get('filter') || '';
  }, [searchParams]);

  const page = useMemo(() => {
    return Number(searchParams.get('page') || '1');
  }, [searchParams]);


  useEffect(() => {
    setIsLoading(true)
    debounce(() => {
      ProdutosService.getAllServices(page, filter)
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
  }, [filter, page]);


  return (
    <LayoutComponentePagina
      barraDeFerramentas={
        <FerramentasDaListagem
          mostrarInputBusca
          textoDaBusca={filter}
          textoBotaoNovo='Cadastrar'
          aoClicarEmNovo={() => navigate('/produtos/cadastrar')}
          aoMudarTextoDeBusca={(texto) => setSearchParams({ filter: texto }, { replace: true })}

        />
      }
    >
      <VTable titles={['Ações', 'Categoria', 'Nome', 'Valor']}>
     
          <TableBody >

            {rows.map((item, index) =>
              <TableRow key={index}>
                <TableCell>
                  <IconButton size="small" onClick={() => navigate(`/produtos/detalhe/${item.id}`)}>
                    <Icon>edit</Icon>
                  </IconButton>
                </TableCell>
                <TableCell>{item.nome_categoria}</TableCell>
                <TableCell>{item.nome}</TableCell>
     
                <TableCell>{item.valor}</TableCell>
          
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
