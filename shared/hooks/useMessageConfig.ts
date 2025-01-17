import { useEffect } from 'react';
import { useMessage } from '@/core/context';
import { SUCCESS_MESSAGES } from '@/core/config/messages';

export const useMessageConfig = (endpoints: string[]) => {
  const { configureEndpoint } = useMessage();

  useEffect(() => {
    console.log('🔄 Configurando endpoints:', endpoints);
    
    endpoints.forEach(endpoint => {
      // Normalizar el endpoint
      const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
      const config = SUCCESS_MESSAGES[normalizedEndpoint];
      
      console.log('⚙️ Configurando endpoint:', {
        original: endpoint,
        normalized: normalizedEndpoint,
        config
      });

      if (config) {
        configureEndpoint(normalizedEndpoint, config);
      } else {
        // Configuración por defecto si no existe
        configureEndpoint(normalizedEndpoint, {
          showSuccessMessage: false
        });
      }
    });
  }, [configureEndpoint, ...endpoints]);  // Volver a agregar endpoints como dependencia
}; 