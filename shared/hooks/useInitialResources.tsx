import { useState, useEffect } from 'react';

export const useInitialResources = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadInitialResources() {
      try {
        // Simular carga de datos
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        await Promise.all([
          // Aquí tus cargas reales
          new Promise(resolve => setTimeout(resolve, 2000)), // Simulación
        ]);
        
      } catch (e) {
        setError(e as Error);
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialResources();
  }, []);

  return { isLoading, error };
};