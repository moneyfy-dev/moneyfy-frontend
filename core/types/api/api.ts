import type { User } from '@/core/types';
import type { Vehicle } from '@/core/types';

// Estructura base para errores de API
export interface ApiError {
  message: string;
  status?: number;
  data?: any;
}

// Respuesta base de la API
export interface ApiResponse<T = any> {
  status: number;
  message: string;
  data: T;
}

// Estructura común de tokens
export interface TokenPair {
  jwtRefresh: string;
  jwtSession: string;
}

// Respuesta base que incluye tokens y usuario
export interface BaseAuthResponse extends ApiResponse {
  data: {
    tokens: TokenPair;
    user: User;
  };
}

// Respuesta específica para vehículos
export interface VehicleResponse extends BaseAuthResponse {
  data: {
    vehicles: Vehicle[];
    tokens: TokenPair;
    user: User;
  };
}

// Tipos para las peticiones
export interface LoginRequest {
  email: string;
  pwd: string;
}

export interface MessageState {
  isVisible: boolean;
  message: string;
  type: 'success' | 'error' | null;
}

export interface MessageConfig {
  showSuccessMessage: boolean;
  customSuccessMessage?: string;
  customErrorMessage?: string;
}

export type ErrorMessageMap = {
  [key: string]: {
    [statusCode: number]: string;
  };
};

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
  '/auth/log-in': {
    424: 'Error al iniciar sesión',
    226: 'Se requiere actualizar el dispositivo asociado'
  },
  '/auth/confirm/device/change': {
    410: 'El código ha expirado o no es correcto',
    424: 'Error al confirmar el cambio de dispositivo'
  },
  '/auth/restore/password': {
    424: 'Error al enviar el código de recuperación'
  },
  '/auth/confirm/password/reset': {
    410: 'El código ha expirado o no es correcto',
    424: 'Error al restablecer la contraseña'
  },
  '/auth/resend/code': {
    424: 'Error al reenviar el código'
  },
  '/auth/disable/account': {
    423: 'No es posible deshabilitar la cuenta: aún tienes dinero en el balance o transacciones pendientes',
    424: 'Error al deshabilitar la cuenta'
  },
  '/users/update': {
    424: 'Error al actualizar la información',
    428: 'Los datos proporcionados no son válidos'
  },
  '/users/change/password': {
    424: 'Error al cambiar la contraseña',
    428: 'Los datos proporcionados no son válidos'
  },
  '/users/hydration/data': {
    424: 'Error al obtener los datos del usuario'
  },
  '/users/list/referreds': {
    424: 'Error al obtener la lista de referidos'
  },
  '/accounts/create': {
    423: 'La cuenta bancaria ya existe',
    424: 'Error al crear la cuenta bancaria',
    428: 'Los datos de la cuenta no son válidos'
  },
  '/accounts/update': {
    424: 'Error al actualizar la cuenta bancaria',
    428: 'Los datos de la cuenta no son válidos'
  },
  '/accounts/delete': {
    424: 'Error al eliminar la cuenta bancaria'
  }
}; 