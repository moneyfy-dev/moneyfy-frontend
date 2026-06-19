import { AxiosError, AxiosResponse } from 'axios';
import { api } from '../config';
import { MessageConfig } from '@/core/config/messages';
import { DEFAULT_ERROR_MESSAGES } from '@/core/config/messages';

interface ApiErrorResponse {
  message: string;
  status: number;
  data?: any;
}

const logInterceptorError = (...args: unknown[]) => {
  if (__DEV__) {
    console.error(...args);
  }
};

const shouldSkipGlobalMessage = (config: any) => {
  return Boolean(config?.skipGlobalErrorMessage || config?.skipGlobalSuccessMessage);
};

let messageHandler: {
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
  getEndpointConfig: (endpoint: string) => MessageConfig | undefined;
} | null = null;

export const setMessageHandler = (handler: typeof messageHandler) => {
  messageHandler = handler;
};

const getEndpointFromUrl = (url: string | undefined) => {
  if (!url) return '';

  try {
    const baseUrl = api.defaults.baseURL || '';
    const cleanUrl = url.replace(baseUrl, '');
    const path = cleanUrl.split('?')[0].replace(/\/[0-9a-fA-F]+$/, '');
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    return normalizedPath;
  } catch (error) {
    logInterceptorError('Error processing request URL:', error);
    return '';
  }
};

const getErrorMessage = (endpoint: string, status: number, defaultMessage: string): string => {
  const endpointErrors = DEFAULT_ERROR_MESSAGES[endpoint];
  if (endpointErrors && endpointErrors[status]) {
    return endpointErrors[status];
  }
  return defaultMessage;
};

export const setupMessageInterceptor = () => {
  api.interceptors.response.use(
    (response: AxiosResponse) => {
      try {
        if (messageHandler && !shouldSkipGlobalMessage(response.config)) {
          const endpoint = getEndpointFromUrl(response.config.url);
          const config = messageHandler.getEndpointConfig(endpoint);

          if (config?.showSuccessMessage) {
            const successMessage = config.customSuccessMessage || response.data?.message || 'Operacion exitosa';
            messageHandler.showSuccess(successMessage);
          }
        }
        return response;
      } catch (error) {
        logInterceptorError('Error in message interceptor:', error);
        return response;
      }
    },
    async (error: AxiosError) => {
      if (messageHandler && !shouldSkipGlobalMessage(error.config)) {
        const endpoint = getEndpointFromUrl(error.config?.url);
        const status = error.response?.status || 500;
        const defaultMessage =
          (error.response?.data as ApiErrorResponse)?.message || error.message || 'Error de conexion';

        const errorMessage = getErrorMessage(endpoint, status, defaultMessage);

        messageHandler.showError(errorMessage);
      }
      return Promise.reject(error);
    }
  );
};
