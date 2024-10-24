import { TabsNavigator } from '../../components'; // Importando o TabsNavigator
import { ListaClientes } from './modulos/ListaClientes';

export const BaseListaCliente: React.FC = () => {

  const steps = [
    { label: 'Listagem de clientes', content: <ListaClientes /> },
  ];

  return (
    <TabsNavigator steps={steps} />
  );
};
