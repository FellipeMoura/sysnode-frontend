import { TabsNavigator } from '../../components'; // Importando o TabsNavigator
import { ListaLancamentos } from './modulos/ListaLancamentos';


export const BaseListaLancamentos: React.FC = () => {

  const steps = [
    { label: 'Lista de lançamentos', content: <ListaLancamentos/> },
  ];

  return (
    <TabsNavigator steps={steps} />
  );
};
