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
