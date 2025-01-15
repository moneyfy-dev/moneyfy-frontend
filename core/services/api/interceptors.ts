import { AxiosError, AxiosRequestHeaders, AxiosResponse } from 'axios';
import { api } from './config';
import { ApiError } from '@/core/types';
import { storage } from '@/shared/utils/storage';
import { MessageConfig } from '@/core/context/message';

interface ApiErrorResponse {
  message: string;
  status: number;
  data?: any;
}

let messageHandler: {
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
  getEndpointConfig: (endpoint: string) => MessageConfig | undefined;
} | null = null;

export const setMessageHandler = (handler: typeof messageHandler) => {
  console.log('🔄 Configurando message handler en interceptor');
  messageHandler = handler;
};

const getEndpointFromUrl = (url: string | undefined) => {
  if (!url) return '';
  const urlObj = new URL(url);
  const path = urlObj.pathname;
  console.log('🔍 URL procesada:', { original: url, processed: path });
  return path;
};

export const setupErrorInterceptor = () => {
  api.interceptors.response.use(
    (response: AxiosResponse) => {
      console.log('✅ Response Success:', {
        url: response.config.url,
        status: response.status,
        hasData: !!response.data
      });

      if (messageHandler) {
        const endpoint = getEndpointFromUrl(response.config.url);
        console.log('🎯 Endpoint detectado:', endpoint);
        const config = messageHandler.getEndpointConfig(endpoint);
        console.log('⚙️ Configuración encontrada:', config);
        
        if (config?.showSuccessMessage) {
          const successMessage = config.customSuccessMessage || response.data?.message || 'Operación exitosa';
          console.log('📢 Mostrando mensaje de éxito:', successMessage);
          messageHandler.showSuccess(successMessage);
        }
      }

      return response;
    },
    async (error: AxiosError) => {
      console.error('❌ API Error:', {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data
      });

      // Manejar error de token expirado (417)
      if (error.response?.status === 417) {
        try {
          const { token, sessionToken } = await storage.auth.getTokens();
          const response = await api.post('/auth/verify-session', {}, {
            headers: {
              'Authorization': `Bearer ${sessionToken}`,
              'Refresh-Token': token
            }
          });
          
          if (response.data.tokens) {
            await storage.auth.setTokens(
              response.data.tokens.jwtRefresh,
              response.data.tokens.jwtSession
            );
            
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

      if (messageHandler) {
        const endpoint = getEndpointFromUrl(error.config?.url);
        const errorMessage = (error.response?.data as ApiErrorResponse)?.message || error.message || 'Error de conexión';
        console.log('📢 Mostrando mensaje de error:', errorMessage);
        messageHandler.showError(errorMessage);
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
