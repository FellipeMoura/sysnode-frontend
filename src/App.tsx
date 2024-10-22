import { BrowserRouter } from 'react-router-dom'


import { AppThemeProvider, AuthProvider, DrawerProvider } from './contexts';
import { Login, MenuLateral } from './components';
import { AppRoutes } from './routes';
import './components/forms/TraducoesYup';

export const App = () => {
  
  
  return (
    <AuthProvider>
      <AppThemeProvider>
        <Login>
          <DrawerProvider>
            <BrowserRouter>
              <MenuLateral>
                <AppRoutes />
              </MenuLateral>
            </BrowserRouter>
          </DrawerProvider>
        </Login>
      </AppThemeProvider>
    </AuthProvider>

  )
}


