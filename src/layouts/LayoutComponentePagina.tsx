import { ReactNode } from 'react';
import { Container, Theme, Typography, useMediaQuery } from '@mui/material';
import { Box } from '@mui/system';

interface ILayoutBaseDePaginaProps {
  titulo?: string;
  children: ReactNode;
  barraDeFerramentas?: ReactNode;
}

export const LayoutComponentePagina: React.FC<ILayoutBaseDePaginaProps> = ({ children, titulo, barraDeFerramentas }) => {
  const smDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const mdDown = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  //const theme = useTheme();

  return (
    <Container 
    disableGutters
    sx={{
      width: "100%",
       // Ajuste a altura com base na altura total disponível
      overflow: "hidden",
     
    }}
   >
      {!!titulo && (
        <Box padding={1} display="flex" alignItems="center" gap={1}>
          <Typography
            overflow="hidden"
            whiteSpace="nowrap"
            textOverflow="ellipsis"
            variant={smDown ? 'h6' : mdDown ? 'h5' : 'h5'}
          >
            {titulo}
          </Typography>
        </Box>
      )}

      {barraDeFerramentas && (
        <Box>
          {barraDeFerramentas}
        </Box>
      )}

      <Container
    disableGutters
        sx={{
          maxHeight: "calc(100vh - 110px)", // Ajuste a altura com base na altura total disponível
          overflow: "auto"
        }}

      >
        {children}
      </Container>
    </Container>
  );
};
