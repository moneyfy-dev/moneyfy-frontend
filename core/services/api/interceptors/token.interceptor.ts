import { AxiosRequestHeaders, AxiosResponse } from 'axios';
import { api } from '../config';
import { storage } from '@/shared/utils/storage';

export const setupTokenInterceptor = () => {
  // Request interceptor
  api.interceptors.request.use(
    async (config) => {
      console.log('🔄 Hola');
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

  // Response interceptor para guardar tokens
  api.interceptors.response.use(
    async (response: AxiosResponse) => {
      try {
        if (response.data?.data?.tokens?.jwtRefresh && response.data?.data?.tokens?.jwtSession) {
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
}; 