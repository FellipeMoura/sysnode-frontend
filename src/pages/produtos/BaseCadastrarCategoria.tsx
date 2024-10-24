import { CadastrarCategoria } from './modulos/CadastrarCategoria';
import { TabsNavigator } from '../../components'; // Importando o TabsNavigator

export const BaseCadastrarCategoria: React.FC = () => {

  const steps = [
    { label: 'Cadastrar Categoria', content: <CadastrarCategoria /> },
  ];

  return (
    <TabsNavigator steps={steps} />
  );
};
