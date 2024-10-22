import { BrowserRouter } from 'react-router-dom'


import { AppThemeProvider, AuthProvider, DrawerProvider } from './contexts';
import { Login, MenuLateral } from './components';
import { AppRoutes } from './routes';
import './components/forms/TraducoesYup';
import { SnackbarProvider } from './contexts/SnackBarProvider';

export const App = () => {


  return (
    <AuthProvider>
      <AppThemeProvider>
        <Login>
          <DrawerProvider>
            <BrowserRouter>
              <SnackbarProvider>
                <MenuLateral>
                  <AppRoutes />
                </MenuLateral>
              </SnackbarProvider>
            </BrowserRouter>
          </DrawerProvider>
        </Login>
      </AppThemeProvider>
    </AuthProvider>

  )
}


