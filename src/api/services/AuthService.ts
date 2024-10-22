import { Api } from '../axios-config';
import { Environment } from '../axios-config/environment';

interface IAuth {
  accessToken: string;
  empresa: number;
  grupo: number;
  login: string;
  tema: number;
}

interface IAuthError {
  error: string;
}

export const auth = async (login: string, senha: string): Promise<IAuth | IAuthError> => {
  try {
    const { data } = await Api.post('/auth', { login, senha });

    if (data) {
      return data;
    }

    return { error: 'Erro no login.' }; // Caso o retorno da API não seja válido
  } catch (error) {
    // Tratar o erro de forma mais específica, com fallback para "Erro no login."
    const errorMessage = (error as { message: string }).message || 'Erro no login.';
    return { error: errorMessage };
  }
};



interface IListagemUsuario {
  empresa: number;
  grupo: number;
  login: string;
  tema: number;
  nome: string;
}

export type TUsuariosComTotalCount = {
  data: IListagemUsuario[];
  totalCount: number;
}

const getAll = async (page = 1, filter = ''): Promise<TUsuariosComTotalCount> => {
  try {
      const urlRelativa = `/usuarios?page=${page}&limit=${Environment.LIMITE_DE_LINHAS}&nome=${filter}`;
      const { data, headers } = await Api.get(urlRelativa);

      return {
          data: data || [],
          totalCount: Number(headers['x-total-count']) || 0,
      };
  } catch (error) {
      console.error(error);
      return {
          data: [],
          totalCount: 0,
      }; // Retorne um objeto padrão em caso de erro
  }
};

const getById = async (login: string): Promise<IListagemUsuario | Error> => {
  try {
    const { data } = await Api.get(`/usuarios/${login}`);

    if (data) {
      return data;
    }

    return new Error('Erro ao consultar o registro.');
  } catch (error) {
 return new Error('Erro');
    return new Error((error as { message: string }).message || 'Erro ao consultar o registro.');
  }
};


export const AuthService = {
  auth,
  getAll,
  getById,
};