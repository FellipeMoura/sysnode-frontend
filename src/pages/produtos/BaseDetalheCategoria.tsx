import { useParams } from 'react-router-dom';
import { ListaLancamentos } from './modulos/ListaLancamentosProdutos';
import { EditarCategoria } from './modulos/EditarCategoria';
import { TabsNavigator } from '../../components'; // Importando o TabsNavigator

export const BaseDetalheCategoria: React.FC = () => {
  const { id = 0 } = useParams<'id'>();

  const steps = [
    { label: 'Editar Categoria', content: <EditarCategoria id={Number(id)} /> },
    { label: 'Lançamentos', content: <ListaLancamentos type='id_produto' id={Number(id)} /> },
  ];

  return (
    <TabsNavigator steps={steps} />
  );
};
