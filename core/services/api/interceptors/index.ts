import { setupTokenInterceptor } from './token.interceptor';
import { setupMessageInterceptor, setMessageHandler } from './message.interceptor';

export const setupInterceptors = () => {
  // Configurar interceptores en orden específico
  setupTokenInterceptor();  // Primero tokens para asegurar autenticación
  setupMessageInterceptor(); // Luego mensajes para manejar respuestas
};

export { setMessageHandler }; 