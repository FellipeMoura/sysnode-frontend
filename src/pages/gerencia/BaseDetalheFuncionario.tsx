import { useParams } from 'react-router-dom';
import { DetalheFuncionario } from './modulos/DetalheFuncionario';
import { TabsNavigator } from '../../components'; // Importando o TabsNavigator

export const BaseDetalheFuncionario: React.FC = () => {
  const { id = 0 } = useParams<'id'>();

  const steps = [
    { label: 'Editar Colaborador', content: <DetalheFuncionario id={Number(id)} /> },
  ];

  return (
    <TabsNavigator steps={steps} />
  );
};
