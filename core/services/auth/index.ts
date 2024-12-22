import { ApiResponse, LoginResponse, RegisterResponse, RegisterRequest, ConfirmPasswordResetRequest, ConfirmationFlowType } from '@/core/types';
import { api } from '../api';

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post('/auth/log-in', { email, pwd: password });
    return response.data;
  },

  verifySession: async (): Promise<{
    isValid: boolean;
    data: LoginResponse | null;
  }> => {
    try {
      const response = await api.post<LoginResponse>('/users/hydration/data');
      return {
        isValid: response.data.status === 200,
        data: response.data
      };
    } catch (error) {
      return {
        isValid: false,
        data: null
      };
    }
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  requestPasswordReset: async (email: string): Promise<ApiResponse> => {
    const response = await api.post('/auth/restore/password', { email });
    return response.data;
  },

  confirmPasswordReset: async (data: ConfirmPasswordResetRequest): Promise<ApiResponse> => {
    const response = await api.post('/auth/confirm/password/reset', data);
    return response.data;
  },

  confirmCode: async (
    email: string, 
    code: string, 
    flow: ConfirmationFlowType,
    newPassword?: { pwd: string, repeatedPwd: string }
  ): Promise<ApiResponse> => {
    switch (flow) {
      case 'changeDevice':
        return await api.post('/auth/confirm/device/change', { email, code });
      case 'registerUser':
        return await api.post('/auth/confirm/registration', { email, code });
      default:
        throw new Error('Invalid flow type');
    }
  },

  resendCode: async (email: string, type: ConfirmationFlowType): Promise<ApiResponse> => {
    const response = await api.put('/auth/resend/code', { email, type });
    return response.data;
  }
};