import { createContext } from 'react';
import { ConfirmationFlowType, LoginResponse } from '@/core/types';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  isPersistentAuthRequired: boolean;
  isPersistentAuthConfigured: boolean;
}

interface AuthContextType extends AuthState {
  loginContext: (response: LoginResponse) => Promise<void>;
  logout: () => Promise<void>;
  handlePersistentAuthSuccess: () => Promise<void>;
  checkPersistentAuth: () => Promise<boolean>;
  checkAuthStatus: () => Promise<void>;
  confirmCode: (
    email: string, 
    code: string, 
    flow: ConfirmationFlowType,
    newPassword?: { pwd: string, repeatedPwd: string }
  ) => Promise<any>;
  resendCode: (
    email: string, 
    type: ConfirmationFlowType
  ) => Promise<any>;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);