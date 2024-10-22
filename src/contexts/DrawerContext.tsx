import { createContext, useCallback, useContext, useState } from 'react';

interface IDrawerOption {
  icon: string;
  path: string;
  label: string;
}

interface IDrawerCategory {
  icon: string;            // Adiciona o ícone da categoria
  options: IDrawerOption[]; // Lista de opções dentro da categoria
}

interface IDrawerContextData {
  isDrawerOpen: boolean;
  toggleDrawerOpen: () => void;
  drawerOptions: { [category: string]: IDrawerCategory }; // Atualiza a estrutura
  setDrawerOptions: (newDrawerOptions: { [category: string]: IDrawerCategory }) => void;
}

const DrawerContext = createContext({} as IDrawerContextData);

export const useDrawerContext = () => {
  return useContext(DrawerContext);
};

interface IDrawerProviderProps {
  children: React.ReactNode;
}
export const DrawerProvider: React.FC<IDrawerProviderProps> = ({ children }) => {
  const [drawerOptions, setDrawerOptions] = useState<{ [category: string]: IDrawerCategory }>({});
 
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawerOpen = useCallback(() => {
    setIsDrawerOpen(oldDrawerOpen => !oldDrawerOpen);
  }, []);

    const handleSetDrawerOptions = useCallback((newDrawerOptions: { [category: string]: IDrawerCategory }) => {
 
    setDrawerOptions(newDrawerOptions);
  }, []);

  return (
    <DrawerContext.Provider value={{ isDrawerOpen, drawerOptions, toggleDrawerOpen, setDrawerOptions: handleSetDrawerOptions }}>
      {children}
    </DrawerContext.Provider>
  );
};
