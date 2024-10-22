import { Environment } from '../axios-config/environment';
import { Api } from '../axios-config';

export interface IPagamento {
  id: number;
  id_cliente?: number | null | undefined;
  id_fornecedor?: number | null | undefined;
  id_vendas: number;
  valor: number;
  metodo: string;
  parcelas: number;
  data: string;
  empresa: number;
  usuario: string;
}

export interface IPagamentoInsert {
 
 
  id_vendas: string;
  valor: number;
  metodo: string;
  parcelas: number;
 
}

type TPagamentosComTotalCount = {
  data: IPagamento[];
  totalCount: number;
}

const getAll = async (
  id_vendas?: number,
  page = 1, 
  filter = '', 
  data?: string, 
  data_fim?: string, 
 
): Promise<TPagamentosComTotalCount | Error> => {
  try {
    let urlRelativa = `/pagamentos?page=${page}&limit=${Environment.LIMITE_DE_LINHAS}&filter=${filter}`;

    if (data) {
      urlRelativa += `&data=${data}`;
    }
    if (data_fim) {
      urlRelativa += `&data_fim=${data_fim}`;
    }
    if (id_vendas) {
      urlRelativa += `&id_vendas=${id_vendas}`;
    }

    const { data: responseData, headers } = await Api.get(urlRelativa);

    if (responseData) {
      return {
        data: responseData,
        totalCount: Number(headers['x-total-count'] || Environment.LIMITE_DE_LINHAS),
      };
    }

    return new Error('Erro ao listar os registros.');
  } catch (error) {
    return new Error('Erro ao listar os registros.');
   ;
  }
};

const getById = async (id: number): Promise<IPagamento | Error> => {
  try {
    const { data } = await Api.get(`/pagamentos/${id}`);

    if (data) {
      return data;
    }

    return new Error('Erro ao consultar o registro.');
  } catch (error) {
   
    return new Error('Erro ao consultar o registro.');
   ;
  }
};

const create = async (dados: Omit<IPagamento, 'id' | 'data' | 'empresa' | 'usuario'>): Promise<number | Error> => {
  try {
    const { data } = await Api.post<IPagamento>('/pagamentos', dados);

    if (data) {
      return data.id;
    }

    return new Error('Erro ao criar o registro.');
  } catch (error) {
    return new Error('Erro ao criar o registro.');
   
  }
};

const updateById = async (id: number, dados: Omit<IPagamento, 'id' | 'empresa'>): Promise<void | Error> => {
  try {
    await Api.put(`/pagamentos/${id}`, dados);
  } catch (error) {
 return new Error('Erro');
   ;
  }
};

const deleteById = async (id: number): Promise<void | Error> => {
  try {
    await Api.delete(`/pagamentos/${id}`);
  } catch (error) {
 return new Error('Erro');
   ;
  }
};

export const PagamentosService = {
  getAll,
  create,
  getById,
  updateById,
  deleteById,
};
