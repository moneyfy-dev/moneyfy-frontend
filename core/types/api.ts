export interface ApiError {
  message: string;
  status?: number;
  data?: any;
}

export interface ApiResponse<T = any> {
  message: string;
  status: number;
  data?: T;
}

export interface ErrorMessageMap {
  [key: string]: {
    [statusCode: number]: string;
  };
}

export const DEFAULT_ERROR_MESSAGES: ErrorMessageMap = {
  '/auth/register': {
    410: 'El usuario ya existe en el sistema',
    423: 'El código de referido es incorrecto',
    424: 'Error al registrar usuario',
    428: 'Los datos proporcionados no son válidos'
  },
  '/auth/confirm/registration': {
    410: 'El código ha expirado o no es correcto',
    424: 'Error al confirmar el registro'
  },
  // ... resto de los mensajes de error
};