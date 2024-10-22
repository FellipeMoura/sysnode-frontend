import { CadastrarProduto } from './modulos/CadastrarProduto';
import { TabsNavigator } from '../../components'; // Importando o TabsNavigator

export const BaseCadastrarProduto: React.FC = () => {

  const steps = [
    { label: 'Cadastrar Produto/Serviço', content: <CadastrarProduto /> },
  ];

  return (
    <TabsNavigator steps={steps} />
  );
};
