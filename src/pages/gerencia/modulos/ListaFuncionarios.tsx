import { useEffect, useMemo, useState } from 'react';
import { Icon, IconButton, LinearProgress, Pagination, TableBody, TableCell, TableFooter, TableRow } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { FuncionariosService, IFuncionarioConsulta } from '../../../api/services/FuncionariosService';
import { Environment } from '../../../api/axios-config/environment';
import { useSnackbar } from '../../../contexts/SnackBarProvider';
import { FerramentasDaListagem } from '../../../components';
import { LayoutComponentePagina } from '../../../layouts';
import { useDebounce } from '../../../shared/UseDebounce';
import { VTable } from '../../../components/grids/VTable';


export const ListaFuncionarios: React.FC = () => {
  const { showSnackbarMessage } = useSnackbar();

  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();

  const { debounce } = useDebounce();

  const [rows, setRows] = useState<IFuncionarioConsulta[]>([]);
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
      FuncionariosService.getAll(page, filter)
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

  const handleDelete = (id: number) => {
    if (confirm('Realmente deseja apagar?')) {
      FuncionariosService.deleteById(id)
        .then(result => {
          if (result instanceof Error) {
            alert(result.message);
          } else {
            setRows(oldRows => [
              ...oldRows.filter(oldRow => oldRow.id !== id),
            ]);
            showSnackbarMessage('Registro apagado com sucesso!');
          }
        });
    }
  };

  return (
    <LayoutComponentePagina
      barraDeFerramentas={
        <FerramentasDaListagem
          mostrarInputBusca
          textoDaBusca={filter}
          textoBotaoNovo='Cadastrar'
          aoClicarEmNovo={() => navigate('/colaboradores/detalhe/cadastrar')}
          aoMudarTextoDeBusca={(texto) => setSearchParams({ filter: texto }, { replace: true })}

        />
      }
    >

      <VTable titles={['Ações', 'Nome', 'Grupo', 'Telefone']}>
   
          <TableBody >

            {rows.map((item, index) =>
              <TableRow key={index}>
                <TableCell>
                <IconButton size="small" onClick={() => handleDelete(item.id)}>
                    <Icon>delete</Icon>
                  </IconButton>
                  <IconButton size="small" onClick={() => navigate(`/colaboradores/detalhe/${item.id}`)}>
                    <Icon>edit</Icon>
                  </IconButton>
                </TableCell>
                <TableCell>{item.nome}</TableCell>
                <TableCell>{item.nome_grupo}</TableCell>
                <TableCell>{item.telefone}</TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={4}>
                  <LinearProgress variant='indeterminate' />
                </TableCell>
              </TableRow>
            )}
            {(totalCount > 0 && totalCount > Environment.LIMITE_DE_LINHAS) && (
              <TableRow>
                <TableCell colSpan={4}>
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
