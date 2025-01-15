import { useEffect } from 'react';
import { useMessage } from '@/core/context/message';
import { SUCCESS_MESSAGES } from '@/core/config/messages';

export const useMessageConfig = (endpoints: string[]) => {
  const { configureEndpoint } = useMessage();

  useEffect(() => {
    endpoints.forEach(endpoint => {
      const config = SUCCESS_MESSAGES[endpoint];
      if (config) {
        configureEndpoint(endpoint, config);
      } else {
        // Configuración por defecto si no existe
        configureEndpoint(endpoint, {
          showSuccessMessage: false
        });
      }
    });
  }, [configureEndpoint]);  // Quitar endpoints del array de dependencias
}; 