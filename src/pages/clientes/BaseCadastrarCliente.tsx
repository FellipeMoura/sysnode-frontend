import { TabsNavigator } from '../../components'; // Importando o TabsNavigator
import { CadastrarCliente } from './modulos/CadastrarCliente';

export const BaseCadastrarCliente: React.FC = () => {

  const steps = [
    { label: 'Cadastrar Cliente', content: <CadastrarCliente /> },
  ];

  return (
    <TabsNavigator steps={steps} />
  );
};
