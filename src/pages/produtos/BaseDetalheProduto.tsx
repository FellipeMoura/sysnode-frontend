import { useParams } from 'react-router-dom';
import { ListaLancamentos } from './modulos/ListaLancamentosProdutos';
import { EditarProduto } from './modulos/EditarProduto';
import { TabsNavigator } from '../../components'; // Importando o TabsNavigator

export const BaseDetalheProduto: React.FC = () => {
  const { id = 0 } = useParams<'id'>();

  const steps = [
    { label: 'Editar Produto', content: <EditarProduto id={Number(id)} /> },
    { label: 'Lista de Lançamentos', content: <ListaLancamentos type='id_produto' id={Number(id)} /> },
  ];

  return (
    <TabsNavigator steps={steps} />
  );
};
