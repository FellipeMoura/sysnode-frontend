import { ListaProdutos } from './modulos/ListaProdutos';
import { ListaServicos } from './modulos/ListaServicos';
import { TabsNavigator } from '../../components'; // Importando o TabsNavigator
import { ListaCategorias } from './modulos/ListaCategorias';

export const BaseListaProdutos: React.FC = () => {

  const steps = [
    { label: 'Produtos', content: <ListaProdutos /> },
    { label: 'Serviços', content: <ListaServicos /> },
    { label: 'Categorias', content: <ListaCategorias /> },
  ];

  return (
    <TabsNavigator steps={steps} />
  );
};
