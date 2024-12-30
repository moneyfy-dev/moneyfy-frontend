import { AxiosError, AxiosRequestHeaders } from 'axios';
import { api } from './config';
import type { ApiError } from '@/core/types';
import { storage } from '@/shared/utils/storage';
import { authService } from '../auth/index';

export const setupErrorInterceptor = () => {
  api.interceptors.response.use(
    response => {
      console.log('✅ Response Success:', {
        url: response.config.url,
        status: response.status,
        hasData: !!response.data
      });
      return response;
    },
    async (error: AxiosError) => {
      console.error('❌ API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.config?.headers
      });

      // Manejar error de token expirado (417)
      if (error.response?.status === 417) {
        console.log('🔄 Intentando recuperar sesión por error 417');
        try {
          // Usar un endpoint específico para verificar sesión
          const { token, sessionToken } = await storage.auth.getTokens();
          const response = await api.post('/auth/verify-session', {}, {
            headers: {
              'Authorization': `Bearer ${sessionToken}`,
              'Refresh-Token': token
            }
          });
          
          console.log('✅ Verificación de sesión exitosa:', response.data);
          
          if (response.data.tokens) {
            console.log('🔄 Actualizando tokens después de verificación');
            await storage.auth.setTokens(
              response.data.tokens.jwtRefresh,
              response.data.tokens.jwtSession
            );
            
            // Reintentar la petición original con los nuevos tokens
            if (error.config) {
              return api(error.config);
            }
          }
        } catch (verifyError) {
          console.error('❌ Error en verificación de sesión:', verifyError);
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
      
      // Asegurarnos de que config.headers sea del tipo correcto
      if (!config.headers) {
        config.headers = {} as AxiosRequestHeaders;
      }
      
      console.log('🔐 Request Interceptor:', {
        url: config.url,
        method: config.method,
        hasToken: !!token,
        hasSessionToken: !!sessionToken,
        currentHeaders: config.headers
      });
      
      if (token && sessionToken) {
        // Establecer headers de autenticación
        config.headers.Authorization = `Bearer ${sessionToken}`;
        config.headers['Refresh-Token'] = token;
        config.headers['Content-Type'] = 'application/json';
        
        console.log('📨 Headers configurados:', {
          url: config.url,
          Authorization: config.headers.Authorization,
          RefreshToken: config.headers['Refresh-Token'],
          ContentType: config.headers['Content-Type']
        });
      } else {
        console.warn('⚠️ No hay tokens disponibles para la solicitud:', {
          url: config.url,
          hasToken: !!token,
          hasSessionToken: !!sessionToken
        });
      }
      
      return config;
    },
    (error) => {
      console.error('❌ Error en interceptor de request:', error);
      return Promise.reject(error);
    }
  );
};
