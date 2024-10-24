import { Box, Button, Icon, Paper, TextField, Typography, useTheme } from '@mui/material';

import { Environment } from '../../api/axios-config/environment';


interface IFerramentasDaListagemProps {
  children?: React.ReactNode;
  textoDaBusca?: string;
  mostrarInputBusca?: boolean;
  aoMudarTextoDeBusca?: (novoTexto: string) => void;
  textoBotaoNovo?: string;
  mostrarBotaoNovo?: boolean;
  mostrarBotaoVoltar?: boolean;
  aoClicarEmNovo?: () => void;
  aoClicarEmVoltar?: () => void;
}

export const FerramentasDaListagem: React.FC<IFerramentasDaListagemProps> = ({
  children,
  textoDaBusca = '',
  aoMudarTextoDeBusca,
  mostrarInputBusca = false,
  aoClicarEmNovo,
  aoClicarEmVoltar,
  textoBotaoNovo = 'Novo',
  mostrarBotaoNovo = true,
  mostrarBotaoVoltar = false,
}) => {
  const theme = useTheme();

  return (
    <Paper
      variant='outlined'
      sx={{
        gap: 1,
        marginX: 1,
        padding: 1,
        paddingX: 2,
        display: "flex",
        alignItems: "center",
        height: theme.spacing(5),
      }}
    >
      {mostrarInputBusca && (
        <TextField
          size="small"
          value={textoDaBusca}
          placeholder={Environment.INPUT_DE_BUSCA}
          onChange={(e) => aoMudarTextoDeBusca?.(e.target.value)}
        />
      )}
       
        {children}
      


      <Box flex={1} display="flex" justifyContent="end">
        {mostrarBotaoNovo && (
          <Button
            color='primary'
            disableElevation
            variant='contained'
            onClick={aoClicarEmNovo}
            endIcon={<Icon>add</Icon>}
          >{textoBotaoNovo}</Button>
        )}

       {mostrarBotaoVoltar && (
        <Button
          color='primary'
          disableElevation
          variant='outlined'
          onClick={aoClicarEmVoltar}
          startIcon={<Icon>arrow_back</Icon>}
        >
          <Typography variant='button' whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden">
            Voltar
          </Typography>
        </Button>
      )}

      </Box>
    </Paper>
  );
};
