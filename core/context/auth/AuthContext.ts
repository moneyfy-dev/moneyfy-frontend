import { createContext } from 'react';
import { ConfirmationFlowType, LoginResponse, PasswordResetResponse, User, RegisterResponse } from '@/core/types';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  isPersistentAuthRequired: boolean;
  isPersistentAuthConfigured: boolean;
}

interface AuthContextType extends AuthState {
  loginContext: (response: LoginResponse) => Promise<User>;
  logout: () => Promise<void>;
  handlePersistentAuthSuccess: () => Promise<void>;
  checkPersistentAuth: () => Promise<boolean>;
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
  handleRegistrationSuccess: (response: RegisterResponse) => Promise<User>;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);