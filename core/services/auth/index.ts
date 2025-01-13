import { ApiResponse, LoginResponse, RegisterResponse, RegisterRequest, ConfirmPasswordResetRequest, ConfirmationFlowType, ConfirmCodeRequest } from '../../types';
import { api } from '../api/config';

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
      const response = await api.post<LoginResponse>('/auth/verify-session');
      return {
        isValid: response.data.status === 200,
        data: response.data
      };
    } catch (error) {
      console.error('Error en verificación de sesión:', error);
      return {
        isValid: false,
        data: null
      };
    }
  },

  register: async (data: RegisterRequest): Promise<ApiResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  requestPasswordReset: async (email: string): Promise<ApiResponse> => {
    const response = await api.post('/auth/restore/password', { email });
    return response.data;
  },

  confirmPasswordReset: async (data: ConfirmPasswordResetRequest): Promise<ApiResponse> => {
    const response = await api.put('/auth/confirm/password/reset', data);
    return response.data;
  },

  confirmCode: async (data: ConfirmCodeRequest): Promise<ApiResponse | RegisterResponse> => {
    let response: ApiResponse | RegisterResponse;
    switch (data.flow) {
      case 'registerUser':
        response = await api.post('/auth/confirm/registration', { email: data.email, code: data.code });
        return response.data;
      case 'changeDevice':
        response = await api.put('/auth/confirm/device/change', { email: data.email, code: data.code });
        return response.data;
      default:
        throw new Error('Invalid flow type');
    }
  },

  resendCode: async (email: string, type: ConfirmationFlowType): Promise<ApiResponse> => {
    const response = await api.put('/auth/resend/code', { email, type });
    return response.data;
  }
};