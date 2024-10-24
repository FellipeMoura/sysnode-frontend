import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { AuthService } from '../api/services/AuthService';


interface IAuthContextData {
  logout: () => void;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<string | void>;
}

const AuthContext = createContext({} as IAuthContextData);

const LOCAL_STORAGE_KEY__ACCESS_TOKEN = 'APP_ACCESS_TOKEN';

interface IAuthProviderProps {
  children: React.ReactNode;
}
export const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string>();

  useEffect(() => {
    const accessToken = localStorage.getItem(LOCAL_STORAGE_KEY__ACCESS_TOKEN);

    if (accessToken) {
      setAccessToken(JSON.parse(accessToken));
    } else {
      setAccessToken(undefined);
    }
  }, []);


  const handleLogin = useCallback(async (email: string, password: string) => {
    const result = await AuthService.auth(email, password);
  
    // Verificando se houve erro
    if ('error' in result) {
      return result.error; // Retorna a mensagem de erro
    }
  
    // Se não houver erro, salvar os dados no localStorage
    localStorage.setItem(LOCAL_STORAGE_KEY__ACCESS_TOKEN, JSON.stringify(result.accessToken));
    localStorage.setItem('empresa', JSON.stringify(result.empresa));
    localStorage.setItem('tema', JSON.stringify(result.tema));
    localStorage.setItem('login', JSON.stringify(result.login));
    localStorage.setItem('grupo', JSON.stringify(result.grupo));
  
    setAccessToken(result.accessToken);
  }, []);
  

  const handleLogout = useCallback(() => {
    localStorage.removeItem(LOCAL_STORAGE_KEY__ACCESS_TOKEN);
    setAccessToken(undefined);
  }, []);

  const isAuthenticated = useMemo(() => !!accessToken, [accessToken]);


  return (
    <AuthContext.Provider value={{ isAuthenticated, login: handleLogin, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
