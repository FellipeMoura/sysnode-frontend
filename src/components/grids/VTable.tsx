import { useTheme, Paper, Table, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useState, useEffect } from 'react';

interface IVTableProps {
  titles: string[];
  overflow?: string;
  children: React.ReactNode;
  headerHeight?: number;
}

export const VTable = ({ titles, children, headerHeight = 20, overflow = 'auto' }: IVTableProps) => {
  const [tableHeight, setTableHeight] = useState(window.innerHeight / 7.7 - headerHeight);

  useEffect(() => {
    const handleResize = () => setTableHeight(window.innerHeight / 7.7 - headerHeight);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [headerHeight]);

  const theme = useTheme();

  return (
    <TableContainer
      component={Paper}
      variant="outlined"
      sx={{
        maxHeight: theme.spacing(tableHeight > 100 ? 100 : tableHeight),
        overflow: overflow,
        m: 1,
        width: 'auto',
        '&::-webkit-scrollbar': {
          width: '8px', // Define a barra de rolagem fina
          height: '8px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: theme.palette.grey[400],
          borderRadius: '10px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          backgroundColor: theme.palette.grey[600], // Muda a cor ao passar o mouse
        },
        '&:hover': {
          '&::-webkit-scrollbar': {
            width: '8pssx', // Expande a barra ao passar o mouse
          },
        },
      }}
    >
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            {titles.map((title, index) => (
              <TableCell key={index}>{title}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        {children}
      </Table>
    </TableContainer>
  );
};
