import { Environment } from '../axios-config/environment';
import { Api } from '../axios-config';
import autoLogout from './autoLogout';
export interface ICliente {
  id: number;
  nome: string;
  telefone?: string | null | undefined;
  email?: string | null | undefined;
  cpf?: string | null | undefined;
  empresa: number;
  usuario: string;
  ativo?: number;
}

type TClientesComTotalCount = {
  data: ICliente[];
  totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<TClientesComTotalCount | Error> => {
  try {
    const urlRelativa = `/clientes?page=${page}&limit=${Environment.LIMITE_DE_LINHAS}&filter=${filter}`;

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

const getById = async (id: number): Promise<ICliente | Error> => {
  try {
    const { data } = await Api.get(`/clientes/${id}`);

    if (data) {
      return data;
    }

    return new Error('Erro ao consultar o registro.');
  } catch (error) {
    console.error(error);
    return autoLogout(error)
  }
};

const create = async (dados: Omit<ICliente, 'id' | 'empresa' | 'usuario'>): Promise<number | Error> => {

  try {
    const { data } = await Api.post<ICliente>('/clientes', dados);

    if (data) {

      return data.id;
    }

    return new Error('Erro ao criar o registro.');
  } catch (error) {
    console.error(error);
    return autoLogout(error)
  }
};

const updateById = async (id: number, dados: Omit<ICliente, 'id' | 'empresa' | 'usuario'>): Promise<void | Error> => {
  try {
    await Api.put(`/clientes/${id}`, dados);
  } catch (error) {
    console.error(error);
    return autoLogout(error)
  }
};

const deleteById = async (id: number): Promise<void | Error> => {
  try {
    await Api.delete(`/clientes/${id}`);
  } catch (error) {
    console.error(error);
    return autoLogout(error)
  }
};


export const ClientesService = {
  getAll,
  create,
  getById,
  updateById,
  deleteById,
};
