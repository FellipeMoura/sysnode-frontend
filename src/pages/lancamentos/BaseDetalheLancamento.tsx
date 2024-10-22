import { DetalheLancamento } from './modulos/DetalheLancamento';
import { DetalhePagamento } from './modulos/DetalhePagamento';
import { TabsNavigator } from '../../components'; // Importando o StepNavigator
import { useParams } from 'react-router-dom';

export const BaseDetalheLancamento: React.FC = () => {
const { id } = useParams();

  const steps = [
    { label: 'Lançamento', content: <DetalheLancamento id={Number(id)} /> },
    { label: 'Pagamento', content: <DetalhePagamento id={Number(id)} /> },
  ];

  return (
    <TabsNavigator steps={steps} />
  );
};

