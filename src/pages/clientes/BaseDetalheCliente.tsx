import { useParams } from 'react-router-dom';
//import { ListaLancamentos } from '../lancamentos/modulos/ListaVendas';
import { EditarCliente } from './modulos/EditarCliente';
import { TabsNavigator } from '../../components'; // Importando o TabsNavigator

export const BaseDetalheCliente: React.FC = () => {
  const { id = 0 } = useParams<'id'>();

  const steps = [
    { label: 'Editar Cliente', content: <EditarCliente id={Number(id)} /> },
   // { label: 'Lista de Lançamentos', content: <ListaLancamentos type='id_cliente' id={Number(id)} /> },
  ];

  return (
    <TabsNavigator steps={steps} />
  );
};
