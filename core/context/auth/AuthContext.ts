import { createContext } from 'react';
import { ConfirmationFlowType, LoginResponse, PasswordResetResponse, User, RegisterResponse, RegisterRequest, ApiResponse } from '@/core/types';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  isPersistentAuthRequired: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<ApiResponse>;
  logout: () => Promise<void>;
  register: (data: RegisterRequest) => Promise<RegisterResponse>;
  checkAuthStatus: () => Promise<void>;
  confirmPasswordReset: (
    email: string, 
    code: string,
    newPwd: string,
    repeatedPwd: string
  ) => Promise<any>;
  confirmCode: (
    email: string, 
    code: string, 
    flow: ConfirmationFlowType
  ) => Promise<any>;
  resendCode: (
    email: string, 
    type: ConfirmationFlowType
  ) => Promise<any>;
  requestPasswordReset: (email: string) => Promise<PasswordResetResponse>;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);