import { TabsNavigator } from '../../components'; // Importando o TabsNavigator
import { ListaFuncionarios } from './modulos/ListaFuncionarios';

export const BaseListaFuncionarios: React.FC = () => {

  const steps = [
    { label: 'Listagem de Colaboradores', content: <ListaFuncionarios /> },
  ];

  return (
    <TabsNavigator steps={steps} />
  );
};
