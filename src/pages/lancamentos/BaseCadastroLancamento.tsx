import { CadastrarVenda } from './modulos/CadastrarVenda';
import { TabsNavigator } from '../../components'; // Importando o StepNavigator

export const BaseCadastroLancamento: React.FC = () => {


  const steps = [
    { label: 'Venda', content: <CadastrarVenda tipo="venda" /> },
    { label: 'Compra', content: <CadastrarVenda tipo="compra" /> },
  ];

  return (
    <TabsNavigator steps={steps} />
  );
};

