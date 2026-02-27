import { AxiosRequestHeaders, AxiosResponse } from 'axios';
import { api } from '../config';
import { storage } from '@/shared/utils/storage';

export const setupTokenInterceptor = () => {
  // Request interceptor
  api.interceptors.request.use(
    async (config) => {
      if (!config.headers) {
        config.headers = {} as AxiosRequestHeaders;
      }

      console.warn('[API] request', {
        method: config.method,
        url: config.baseURL ? `${config.baseURL}${config.url || ''}` : config.url,
      });

      // Solo agregar tokens si no es ruta de auth
      if (!config.url?.includes('/auth/')) {
        const { token, sessionToken } = await storage.auth.getTokens();
        console.warn('[API] auth headers', {
          url: config.url,
          hasToken: !!token,
          hasSessionToken: !!sessionToken,
        });
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
          console.warn('[API] save tokens', {
            url: response.config?.url,
            status: response.status,
          });
          await storage.auth.setTokens(
            response.data.data.tokens.jwtRefresh,
            response.data.data.tokens.jwtSession
          );
        }
      } catch (error) {
      }
      return response;
    },
    (error) => Promise.reject(error)
  );
}; 
