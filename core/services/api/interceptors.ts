import { AxiosError } from 'axios';
import { api } from './config';
import type { ApiError } from '@/core/types';
import { storage } from '@/shared/utils/storage';
import { authService } from '@/core/services';

export const setupErrorInterceptor = () => {
  api.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
      console.error('API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
      });

      // Manejar error de token expirado (417)
      if (error.response?.status === 417) {
        try {
          // Intentar verificar sesión
          const { isValid } = await authService.verifySession();
          
          if (isValid && error.config) {
            // Si la sesión es válida, reintentar la petición original
            return api(error.config);
          } else {
            // Si la sesión no es válida, limpiar datos
            await storage.auth.clearAuth();
            await storage.user.clearUser();
          }
        } catch (verifyError) {
          // Si falla la verificación, limpiar datos
          await storage.auth.clearAuth();
          await storage.user.clearUser();
        }
      }

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
