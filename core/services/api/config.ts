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

// Interceptor para enviar tokens
api.interceptors.request.use(
  async (config) => {
    if (!config.headers) {
      config.headers = {} as AxiosRequestHeaders;
    }

    // Solo agregar tokens si no es ruta de auth
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

// Interceptor para guardar tokens automáticamente
api.interceptors.response.use(
  async (response) => {
    try {
      // Si la respuesta contiene tokens, guardarlos
      if (response.data.data.tokens.jwtRefresh && response.data.data.tokens.jwtSession) {
        console.log('🔄 Interceptor: Guardando tokens de respuesta');
        await storage.auth.setTokens(
          response.data.data.tokens.jwtRefresh,
          response.data.data.tokens.jwtSession
        );
      }
    } catch (error) {
      console.error('❌ Error al guardar tokens en interceptor:', error);
    }
    return response;
  },
  (error) => Promise.reject(error)
);