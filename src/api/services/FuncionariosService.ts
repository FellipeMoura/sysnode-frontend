import { Environment } from '../axios-config/environment';
import { Api } from '../axios-config';
import autoLogout from './autoLogout';

export interface IFuncionario {
  id: number;
  nome: string;
  telefone?: string | null | undefined;
  cpf?: string | null | undefined;
  grupo?: number | null | undefined;
  login?: string | null | undefined;
  ativo?: number;
}

export interface IFuncionarioConsulta extends IFuncionario{
  nome_grupo: string | null;
}

type TClientesComTotalCount = {
  data: IFuncionarioConsulta[];
  totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<TClientesComTotalCount | Error> => {
  try {
    const urlRelativa = `/funcionarios?page=${page}&limit=${Environment.LIMITE_DE_LINHAS}&filter=${filter}`;

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

const getById = async (id: number): Promise<IFuncionario | Error> => {
  try {
    const { data } = await Api.get(`/funcionarios/${id}`);

    if (data) {
      return data;
    }

    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    console.error(error);
    return autoLogout(error)
  }
};

const create = async (dados: Omit<IFuncionario, 'id'>): Promise<number | Error> => {

  try {
    const { data } = await Api.post<IFuncionario>('/funcionarios', dados);

    if (data) {
      
      return data.id;
    }

    return new Error('Erro ao criar o registro.');
  } catch (error) {
    console.error(error);
   return autoLogout(error)
  }
};

const updateById = async (id: number, dados: Omit<IFuncionario, 'id' | 'empresa' >): Promise<void | Error> => {
  try {
    await Api.put(`/funcionarios/${id}`, dados);
  } catch (error) {
    console.error(error);
   return autoLogout(error)
  }
};

const deleteById = async (id: number): Promise<void | Error> => {
  try {
    await Api.delete(`/funcionarios/${id}`);
  } catch (error) {
    console.error(error);
   return autoLogout(error)
  }
};


export const FuncionariosService = {
  getAll,
  create,
  getById,
  updateById,
  deleteById,
};
