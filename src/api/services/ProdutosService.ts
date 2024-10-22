import { Environment } from '../axios-config/environment';
import { Api } from '../axios-config';

export interface IProduto {
  id: number;
  tipo: string;
  categoria?: number | null | undefined;
  nome: string;
  valor: number;
  empresa: number;
  ativo?: number | null | undefined;  
}

export interface IProdutoConsulta extends Omit<IProduto, 'categoria'> {
  nome_categoria: string;
  custo: number;
  total_saida: number;
  saldo: number;  
} 

type TProdutosComTotalCount = {
  data: IProdutoConsulta[];
  totalCount: number;
}

export interface IServicoConsulta extends Omit<IProduto, 'categoria'> {
  nome_categoria: string; 
} 

type TServicosComTotalCount = {
  data: IServicoConsulta[];
  totalCount: number;
}

export interface ICategorias {
  id: number;
  tipo: string;
  nome: string;
  empresa: number;
}

export interface ICategoriasConsulta extends ICategorias {
  cadastrados: number;
}

type TCategoriasComTotalCount = {
  data: ICategoriasConsulta[];
  totalCount: number;
}
const getAll = async (page = 1, filter = ''): Promise<TProdutosComTotalCount | Error> => {
  try {
    const urlRelativa = `/produtos?page=${page}&limit=${Environment.LIMITE_DE_LINHAS}&filter=${filter}`;

    const { data, headers } = await Api.get(urlRelativa);

    if (data) {
      
      return {
        data,
        totalCount: Number(headers['x-total-count'] || Environment.LIMITE_DE_LINHAS),
      };
    }

    return new Error('Erro ao listar os registros.');
   } catch (error) {
    return new Error('Erro ao criar o registro.');
  }
};

const getAllServices = async (page = 1, filter = ''): Promise<TServicosComTotalCount | Error> => {
  try {
    const urlRelativa = `/servicos?page=${page}&limit=${Environment.LIMITE_DE_LINHAS}&filter=${filter}`;

    const { data, headers } = await Api.get(urlRelativa);

    if (data) {
      
      return {
        data,
        totalCount: Number(headers['x-total-count'] || Environment.LIMITE_DE_LINHAS),
      };
    }

    return new Error('Erro ao listar os registros.');
   } catch (error) {
    return new Error('Erro ao criar o registro.');
  }
};
const getById = async (id: number): Promise<IProduto | Error> => {
  try {
    const { data } = await Api.get(`/produtos/${id}`);

    if (data) {
      return data;
    }

    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    return new Error('Erro ao consultar o registro.');
   
  }
};

const create = async (dados: Omit<IProduto, 'id' | 'empresa'>): Promise<number | Error> => {

  try {
    const { data } = await Api.post<IProduto>('/produtos', dados);

    if (data) {
      
      return data.id;
    }

    return new Error('Erro ao criar o registro.');
   } catch (error) {
    return new Error('Erro ao criar o registro.');
  }
};
const updateById = async (id: number, dados: Omit<IProduto, 'id' | 'empresa' | 'tipo'>): Promise<void | Error> => {
  try {
    await Api.put(`/produtos/${id}`, dados);
   } catch (error) {
    return new Error('Erro ao criar o registro.');
  }
};
const deleteById = async (id: number): Promise<void | Error> => {
  try {
    await Api.delete(`/produtos/${id}`);
   } catch (error) {
    return new Error('Erro ao criar o registro.');
  }
};



const getAllCategories = async (tipo = '', page = 1, filter = ''): Promise<TCategoriasComTotalCount | Error> => {
  try {
    const urlRelativa = `/categorias?tipo=${tipo}&page=${page}&limit=${Environment.LIMITE_DE_LINHAS}&filter=${filter}`;

    const { data, headers } = await Api.get(urlRelativa);

    if (data) {
      
      return {
        data,
        totalCount: Number(headers['x-total-count'] || Environment.LIMITE_DE_LINHAS),
      };
    }

    return new Error('Erro ao listar os registros.');
   } catch (error) {
    return new Error('Erro ao criar o registro.');
  }
};
const createCategory = async (dados: Omit<ICategorias, 'id' | 'empresa'>): Promise<number | Error> => {

  try {
    const { data } = await Api.post<ICategorias>('/categorias', dados);

    if (data) {
      
      return data.id;
    }

    return new Error('Erro ao criar o registro.');
   } catch (error) {
    return new Error('Erro ao criar o registro.');
  }
};

const getCategoryById = async (id: number): Promise<ICategorias | Error> => {
  try {
    const { data } = await Api.get(`/categorias/${id}`);

    if (data) {
      return data;
    }

    return new Error('Erro ao consultar o registro.');
  } catch (error) {

    return new Error('Erro ao consultar o registro.');
   
  }
};

const updateCategoryById = async (id: number, dados: Omit<ICategorias, 'id' | 'tipo' | 'empresa' | 'tipo'>): Promise<void | Error> => {
  try {
    await Api.put(`/categorias/${id}`, dados);
   } catch (error) {
    return new Error('Erro ao criar o registro.');
  }
};

const deleteCategoryById = async (id: number): Promise<void | Error> => {
  try {
    await Api.delete(`/categorias/${id}`);
   } catch (error) {
    return new Error('Erro ao criar o registro.');
  }
};

export const ProdutosService = {
  getAll,
  getAllServices,
  getAllCategories,
  create,
  createCategory,
  getById,
  getCategoryById,
  updateById,
  updateCategoryById,
  deleteById,
  deleteCategoryById,
};
