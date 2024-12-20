import { AxiosError } from 'axios';
import { api } from './config';
import type { ApiError } from '@/core/types';

export const setupErrorInterceptor = () => {
  api.interceptors.response.use(
    response => response,
    (error: AxiosError) => {
      console.error('API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
      });

      const customError: ApiError = {
        message: error.message || 'Error de conexión',
        status: error.response?.status,
        data: error.response?.data,
      };

      return Promise.reject(customError);
    }
  );
};

export const setupTokenInterceptor = (
  getTokens: () => Promise<{ token: string | null; sessionToken: string | null }>
) => {
  api.interceptors.request.use(
    async (config) => {
      const { token, sessionToken } = await getTokens();
      
      if (token && sessionToken && config.headers) {
        config.headers['Authorization'] = `Bearer ${sessionToken}`;
        config.headers['Refresh-Token'] = token;
      }
      
      return config;
    },
    (error) => Promise.reject(error)
  );
};
