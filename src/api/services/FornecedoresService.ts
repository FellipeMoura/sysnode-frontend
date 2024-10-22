import { Environment } from '../axios-config/environment';
import { Api } from '../axios-config';

export interface IFornecedor {
  id: number;
  nome: string;
  telefone?: string | null | undefined;
  telefone_2?: string | null | undefined;
  cnpj?: string | null | undefined;
  cep?: string | null | undefined;
  rua?: string | null | undefined;
  cidade?: string | null | undefined;
  estado?: string | null | undefined;
  email?: string | null | undefined;
  empresa: number;
  usuario: string;
  ativo?: number;
}

type TFornecedoresComTotalCount = {
  data: IFornecedor[];
  totalCount: number;
};

// Função para buscar todos os fornecedores com paginação e filtro
const getAll = async (page = 1, filter = ''): Promise<TFornecedoresComTotalCount | Error> => {
  try {
    const urlRelativa = `/fornecedores?page=${page}&limit=${Environment.LIMITE_DE_LINHAS}&filter=${filter}`;

    const { data, headers } = await Api.get(urlRelativa);

    if (data) {
      return {
        data,
        totalCount: Number(headers['x-total-count'] || Environment.LIMITE_DE_LINHAS),
      };
    }

    return new Error('Erro ao listar os registros.');
  } catch (error) {
    return new Error('Erro ao listar os registros.');
   ;
  }
};

// Função para buscar um fornecedor por ID
const getById = async (id: number): Promise<IFornecedor | Error> => {
  try {
    const { data } = await Api.get(`/fornecedores/${id}`);

    if (data) {
      return data;
    }

    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    return new Error('Erro ao consultar o registro.');
   ;
  }
};

// Função para criar um novo fornecedor
const create = async (dados: Omit<IFornecedor, 'id' | 'empresa' | 'usuario'>): Promise<number | Error> => {
  try {
    const { data } = await Api.post<IFornecedor>('/fornecedores', dados);

    if (data) {
      return data.id;
    }

    return new Error('Erro ao criar o registro.');
  } catch (error) {
    return new Error('Erro ao criar o registro.');
   ;
  }
};

// Função para atualizar um fornecedor por ID
const updateById = async (id: number, dados: Omit<IFornecedor, 'id' | 'empresa' | 'usuario'>): Promise<void | Error> => {
  try {
    await Api.put(`/fornecedores/${id}`, dados);
  } catch (error) {
 return new Error('Erro');
   ;
  }
};

// Função para deletar um fornecedor por ID
const deleteById = async (id: number): Promise<void | Error> => {
  try {
    await Api.delete(`/fornecedores/${id}`);
  } catch (error) {
 return new Error('Erro');
   ;
  }
};

// Exportação dos métodos para o serviço de fornecedores
export const FornecedoresService = {
  getAll,
  create,
  getById,
  updateById,
  deleteById,
};
