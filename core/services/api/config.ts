import axios, { AxiosRequestHeaders } from 'axios';
import getEnvVars from '../../../config';
import { storage } from '@/shared/utils/storage';

const { apiUrl } = getEnvVars();

export const api = axios.create({
  baseURL: apiUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configurar el interceptor inmediatamente
api.interceptors.request.use(
  async (config) => {
    if (!config.headers) {
      config.headers = {} as AxiosRequestHeaders;
    }

    // Solo agregar tokens si no es una ruta de autenticación
    if (!config.url?.includes('/auth/')) {
      const { token, sessionToken } = await storage.auth.getTokens();
      if (token && sessionToken) {
        config.headers.Authorization = `Bearer ${sessionToken}`;
        config.headers['Refresh-Token'] = token;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);