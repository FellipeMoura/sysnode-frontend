import React, { useEffect, useMemo, useState } from 'react';
import { LinearProgress, TableRow, TableCell, TableBody, IconButton, Icon, Pagination, TableFooter, Collapse, Box, Table, TableHead } from '@mui/material';

import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDebounce } from '../../../shared/UseDebounce';
import { ILancamentoConsulta, IVendaConsulta, LancamentosService } from '../../../api/services/LancamentosService';
import { Environment } from '../../../api/axios-config/environment';
import { LayoutComponentePagina } from '../../../layouts';
import { FerramentasDaListagem } from '../../../components';
import { VTable } from '../../../components/grids/VTable';
import { toCash, toDate } from '../../../shared/functions';

export const ListaLancamentos = () => {

  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();

  const { debounce } = useDebounce();

  const [rows, setRows] = useState<IVendaConsulta[]>([]);
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
      LancamentosService.getAllVendas(page, filter)
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

  /*const handleDelete = (id: number) => {
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
  };*/


  return (

    <LayoutComponentePagina
      barraDeFerramentas={
        <FerramentasDaListagem
          mostrarInputBusca
          textoDaBusca={filter}

          aoClicarEmNovo={() => navigate('/lancamentos/novo')}
          aoMudarTextoDeBusca={(texto) => setSearchParams({ filter: texto }, { replace: true })}

        />
      }
    >
      <VTable titles={['', 'Data', 'Agente', 'Itens', 'Valor total']}>
        <TableBody >

          {rows.map((item) =>
            <Row key={item.id} row={item} />
          )}
        </TableBody>
        <TableFooter>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={6}>
                <LinearProgress variant='indeterminate' />
              </TableCell>
            </TableRow>
          )}
          {(totalCount > 0 && totalCount > Environment.LIMITE_DE_LINHAS) && (
            <TableRow>
              <TableCell colSpan={6}>
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


  )
}

interface IRowProps {
  row: IVendaConsulta;
}

export const Row: React.FC<IRowProps> = ({ row }) => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [subRows, setSubRows] = useState<ILancamentoConsulta[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {

    if (open && !subRows.length) {
      setIsLoading(true);

      LancamentosService.getAll('id_vendas', row.id, page)
        .then((resp) => {
          setIsLoading(false);

          if (resp instanceof Error) {
            alert(resp.message);
          } else {
            setSubRows(resp.data);
            setTotalCount(resp.totalCount);
          }
        });
    }
  }, [open]);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        {/* Coluna de ações */}
        <TableCell>

          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            <Icon>  {open ? 'keyboard_arrow_up' : 'keyboard_arrow_down'} </Icon>
          </IconButton>
          <IconButton size="small" onClick={() => navigate(`/lancamentos/detalhe/${row.id}`)}>
                    <Icon>edit</Icon>
                  </IconButton>
        </TableCell>
        {/*   <TableCell>

          <IconButton size="small" onClick={() => navigate(`/lancamentos/detalhe/${row.id}`)}>
            {row.pagamento ?
              <Icon> pending</Icon>
              :
              <Icon sx={{ color: '#0EA925' }}>price_check</Icon>
           
          </IconButton>

        </TableCell>*/ }
        <TableCell>{toDate(row.data)}</TableCell>

        <TableCell>{row.nome_agente}</TableCell>

        <TableCell>{row.qnt_itens}</TableCell>

        <TableCell>

          <Box display='flex' alignItems={'center'} sx={{ color: row.id_cliente ? '#0EA925' : '#6208EB' }}>
           <Box sx={{color: row.pago? '' : '#777'}}>{toCash(row.valor_itens)}</Box>
            
            {row.id_cliente ?
              <Icon > arrow_drop_up </Icon>
              :
              <Icon > arrow_drop_down </Icon>
            }
          </Box>

        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Item</TableCell>
                    <TableCell>Valor</TableCell>
                    <TableCell>qnt</TableCell>
                    <TableCell>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {subRows.map((subRow) => (
                    <TableRow key={subRow.id}>
                      <TableCell>{subRow.tipo_produto}</TableCell>
                      <TableCell>{subRow.nome_produto}</TableCell>
                      <TableCell>{toCash(subRow.valor)}</TableCell>
                      <TableCell>{subRow.qnt}</TableCell>
                      <TableCell>
                        {toCash(subRow.valor * subRow.qnt)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  {isLoading && (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <LinearProgress variant="indeterminate" />
                      </TableCell>
                    </TableRow>
                  )}
                  {(totalCount > 0 && totalCount > Environment.LIMITE_DE_LINHAS) && (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <Pagination
                          page={page}
                          count={Math.ceil(totalCount / Environment.LIMITE_DE_LINHAS)}
                          onChange={(_, newPage) => setPage(newPage)}
                        />
                      </TableCell>
                    </TableRow>
                  )}
                </TableFooter>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};
