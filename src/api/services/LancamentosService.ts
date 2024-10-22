import { Environment } from '../axios-config/environment';
import { Api } from '../axios-config';
import autoLogout from './autoLogout';

export interface ILancamento {
  id: number;
  id_produto: number;
  tipo: string;
  valor_base?: number | null | undefined;
  valor: number;
  qnt: number;

}

export interface ILancamentoConsulta extends ILancamento {
  nome_agente: string;
  nome_produto: string;
  tipo_produto: string;
}


type TLancamentosComTotalCount = {
  data: ILancamentoConsulta[];
  totalCount: number;
}

export interface IVenda {
  id: number;
  id_cliente?: number | null ;
  id_fornecedor?: number | null ;
  id_funcionario?: number | null ;
  data: string;
  pagamento: number;
  empresa: number;
}

export interface IVendaConsulta extends IVenda {
  nome_agente: string;
  nome_funcionario: string | null | undefined;
  telefone: string | null | undefined;
  valor_base_itens: number;
  valor_itens: number;
  qnt_itens: number;
 
}

export interface IVendaPaginado {
  data: IVendaConsulta[]; // Atualizado para refletir a estrutura de venda com itens
  totalCount: number;
}

const getAll = async (type = '', id: number, page = 1, filter = ''): Promise<TLancamentosComTotalCount | Error> => {
  try {
    const urlRelativa = `/lancamentos?type=${type}&id=${id}&page=${page}&limit=${Environment.LIMITE_DE_LINHAS}&filter=${filter}`;

    const { data, headers } = await Api.get(urlRelativa);

    if (data) {
      
      return {
        data,
        totalCount: Number(headers['x-total-count'] || Environment.LIMITE_DE_LINHAS),
      };
    }

    return new Error('Erro ao listar os registros.');
  } catch (error) {
    console.error(error);
   return autoLogout(error)
  }
};

const getById = async (id: number): Promise<ILancamento | Error> => {
  try {
    const { data } = await Api.get(`/lancamentos/${id}`);

    if (data) {
      return data;
    }

    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    console.error(error);
    return autoLogout(error)
  }
};




const create = async (dados: Omit<ILancamento, 'id' | 'usuario' | 'empresa'>): Promise<number | Error> => {

  try {
    const { data } = await Api.post<ILancamento>('/lancamentos', dados);

    if (data) {
      
      return data.id;
    }

    return new Error('Erro ao criar o registro.');
  } catch (error) {
    console.error(error);
   return autoLogout(error)
  }
};

const deleteById = async (tabela: string, id: number): Promise<void | Error> => {
  try {
    await Api.delete(`/${tabela}/${id}`);
  } catch (error) {
    console.error(error);
   return autoLogout(error)
  }
};

const getAllVendas = async ( page = 1, filter = ''): Promise<IVendaPaginado | Error> => {
  try {
    const urlRelativa = `/vendas?page=${page}&limit=${Environment.LIMITE_DE_LINHAS}&filter=${filter}`;

    const { data, headers } = await Api.get(urlRelativa);

    if (data) {
      
      return {
        data,
        totalCount: Number(headers['x-total-count'] || Environment.LIMITE_DE_LINHAS),
      };
    }

    return new Error('Erro ao listar os registros.');
  } catch (error) {
    console.error(error);
   return autoLogout(error)
  }
};


const getVendaById = async (id: number): Promise<IVendaConsulta | Error> => {
  try {
    const { data } = await Api.get(`/vendas/${id}`);

    if (data) {
      return data;
    }

    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    console.error(error);
    return autoLogout(error)
  }
};

const createVenda = async (dados: Omit<IVenda, 'id' | 'pagamento' | 'empresa'>): Promise<number | Error> => {

  try {
    const { data } = await Api.post<IVenda>('/vendas', dados);

    if (data) {
      
      return data.id;
    }

    return new Error('Erro ao criar o registro.');
  } catch (error) {
    console.error(error);
   return autoLogout(error)
  }
};


export const LancamentosService = {
  getAll,
  getAllVendas,
  getVendaById,
  createVenda,
  create,
  getById,
  deleteById,
};
