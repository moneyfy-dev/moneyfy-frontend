import { api } from './config';
import { setupInterceptors, setMessageHandler } from './interceptors/index';

// Configurar interceptores inmediatamente
setupInterceptors();

export { api, setMessageHandler };
