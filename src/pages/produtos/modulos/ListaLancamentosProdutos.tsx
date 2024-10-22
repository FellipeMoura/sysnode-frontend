import { useEffect, useMemo, useState } from 'react';
import { LinearProgress, Typography, TableRow, TableCell, TableBody, IconButton, Icon, Pagination, TableFooter } from '@mui/material';

import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDebounce } from '../../../shared/UseDebounce';
import { ILancamentoConsulta, LancamentosService } from '../../../api/services/LancamentosService';
import { Environment } from '../../../api/axios-config/environment';
import { VTable } from '../../../components/grids/VTable';
import { LayoutComponentePagina } from '../../../layouts';
import { FerramentasDaListagem } from '../../../components';

interface LancamentosProps {
  type: string;
  id: number;
}

export const ListaLancamentos = (props: LancamentosProps) => {

  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();

  const { debounce } = useDebounce();

  const [rows, setRows] = useState<ILancamentoConsulta[]>([]);
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
      LancamentosService.getAll(props.type, props.id, page, filter)
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
      LancamentosService.deleteById(id)
        .then(result => {
          if (result instanceof Error) {
            alert(result.message);
          } else {
            setRows(oldRows => [
              ...oldRows.filter(oldRow => oldRow.id !== id),
            ]);
            alert('Registro apagado com sucesso!');
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
          mostrarBotaoNovo={false}
          mostrarBotaoVoltar={true}
          aoClicarEmNovo={() => navigate('/produtos/cadastrar')}
          aoClicarEmVoltar={() => navigate('/produtos')}
          aoMudarTextoDeBusca={(texto) => setSearchParams({ filter: texto }, { replace: true })}

        />
      }
    >
      {rows.length > 0 ?
        <VTable titles={['Ações', 'Data', 'Tipo', 'Quantidade', 'Valor', 'Agente']}>
          <TableBody >

            {rows.map((item, index) =>
              <TableRow key={index}>
                <TableCell>
                  <IconButton size="small" onClick={() => navigate(`/lancamentos/detalhe/${item.id}`)}>
                    <Icon>assignment</Icon>
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(item.id)}>
                    <Icon>delete</Icon>
                  </IconButton>
                </TableCell>
                <TableCell>{item.data}</TableCell>
                <TableCell>{item.tipo}</TableCell>
                <TableCell>{item.qnt}</TableCell>
                <TableCell>{item.valor}</TableCell>
                <TableCell>{item.nome_agente}</TableCell>
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
        :
        <Typography p={6} variant='h6'>
          Nenhum lançamento para este produto.
        </Typography>
      }
    </LayoutComponentePagina>
  )
}