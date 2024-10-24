import { DetalheFuncionario } from './modulos/DetalheFuncionario';
import { TabsNavigator } from '../../components'; // Importando o TabsNavigator

export const BaseCadastrarFuncionario: React.FC = () => {     

  const steps = [
    { label: 'Cadastrar colaborador', content: <DetalheFuncionario id = 'cadastrar' /> },
  ];

  return (
    <TabsNavigator steps={steps} />
  );
};
