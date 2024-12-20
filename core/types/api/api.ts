import type { User } from '@/core/types';
import type { Vehicle } from '@/core/types';

export interface ApiError {
  message: string;
  status?: number;
  data?: any;
}

export interface ApiResponse<T = any> {
  status: number;
  message: string;
  data: T;
}

// Extendemos de las interfaces existentes
export interface BaseResponse extends ApiResponse {
  data: {
    tokens: {
      jwtRefresh: string;
      jwtSession: string;
    };
    user: User;
  };
}

// Usamos los tipos existentes
export interface VehicleResponse extends BaseResponse {
  data: {
    vehicles: Vehicle[];
    tokens: {
      jwtRefresh: string;
      jwtSession: string;
    };
    user: User;
  };
}

// Tipos para las peticiones
export interface LoginRequest {
  email: string;
  pwd: string;
}
