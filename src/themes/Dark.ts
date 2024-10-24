import { createTheme } from '@mui/material';
import { lightBlue, cyan } from '@mui/material/colors';

export const DarkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: lightBlue[700],
      dark: lightBlue[800],
      light: lightBlue[500],
      contrastText: '#ffffff',
    },
    secondary: {
      main: cyan[500],
      dark: cyan[400],
      light: cyan[300],
      contrastText: '#ffffff',
    },
    background: {
      paper: '#112',
      default: '#0A1F44',
    },
  },
  typography: {
    allVariants: {
      color: 'white',
    }
  }
});
