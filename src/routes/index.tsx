import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { useDrawerContext } from '../contexts';
import {
  Dashboard,
  BaseListaCliente,
  BaseDetalheCliente,
  BaseListaProdutos,
  BaseDetalheProduto,
  BaseCadastrarCliente,
  BaseCadastrarProduto,
  BaseListaFuncionarios,
  BaseCadastrarFuncionario,
  BaseDetalheFuncionario,
  BaseDetalheCategoria,
  BaseCadastrarCategoria,
  BaseListaLancamentos,
  BaseDetalheLancamento,
  BaseCadastroLancamento,
} from '../pages';

export const AppRoutes = () => {
  const { setDrawerOptions } = useDrawerContext();

  useEffect(() => {

    setDrawerOptions({
      ['Clientes']: {
        icon: 'person',
        options: [
          {
            icon: 'search',
            path: '/clientes',
            label: 'Pesquisar',
          },
        ],
      },
      ['Produtos/Serviços']: {
        icon: 'store',
        options: [
          {
            icon: 'search',
            path: '/produtos',
            label: 'Pesquisar',
          },
        ],
      },
      ['Lançamentos']: {
        icon: 'shopping_cart',
        options: [
          {
            icon: 'search',
            path: '/lancamentos',
            label: 'Pesquisar',
          },
        ],
      },
      ['Gerência']: {
        icon: 'work',
        options: [
          {
            icon: 'engineering',
            path: '/colaboradores',
            label: 'Colaboradores',
          },
        ],
      },
    });
  }, []);



  return (
    <Routes>
      <Route path="/pagina-inicial" element={<Dashboard />} />
      <Route path="/clientes" element={<BaseListaCliente />} />
      <Route path="/clientes/cadastrar" element={<BaseCadastrarCliente />} />
      <Route path="/clientes/detalhe/:id" element={<BaseDetalheCliente />} />

      <Route path="/produtos" element={<BaseListaProdutos />} />
      <Route path="/produtos/cadastrar" element={<BaseCadastrarProduto />} />
      <Route path="/produtos/detalhe/:id" element={<BaseDetalheProduto />} />

      <Route path="/categorias/cadastrar" element={<BaseCadastrarCategoria />} />
      <Route path="/categorias/detalhe/:id" element={<BaseDetalheCategoria />} />

      <Route path="/lancamentos" element={<BaseListaLancamentos />} />
      <Route path="/lancamentos/novo" element={<BaseCadastroLancamento />} />
      <Route path="/lancamentos/detalhe/:id" element={<BaseDetalheLancamento />} />

      <Route path="/lancamentos/detalhe/:id" element={<BaseDetalheLancamento />} />

      <Route path="/colaboradores" element={<BaseListaFuncionarios />} />
      <Route path="/colaboradores/detalhe/cadastrar" element={<BaseCadastrarFuncionario />} />
      <Route path="/colaboradores/detalhe/:id" element={<BaseDetalheFuncionario />} />

      <Route path="*" element={<Navigate to="/pagina-inicial" />} />
    </Routes>
  );
};
