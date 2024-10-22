import axios from 'axios';
import { responseInterceptor, errorInterceptor } from './interceptors';
import { Environment } from './environment';

const Api = axios.create({
  baseURL: Environment.URL_BASE
});

// Interceptor de requisição para incluir o token no cabeçalho
Api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('APP_ACCESS_TOKEN');

    if (accessToken) {
      config.headers.Authorization = `Bearer ${JSON.parse(accessToken)}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptores de resposta e erro
Api.interceptors.response.use(
  (response) => responseInterceptor(response),
  (error) => errorInterceptor(error),
);

export { Api };
