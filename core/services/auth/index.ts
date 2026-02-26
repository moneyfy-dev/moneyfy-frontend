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
    console.warn('[auth.register] start', {
      baseURL: api.defaults.baseURL,
      email: data.email,
    });
    const timeoutMs = 15000;
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Tiempo de espera agotado')), timeoutMs)
    );

    try {
      const response = await Promise.race([
        api.post('/auth/register', data),
        timeoutPromise,
      ]);

      console.warn('[auth.register] response', {
        httpStatus: (response as any)?.status,
        apiStatus: (response as any)?.data?.status,
      });

      return (response as any).data;
    } catch (error: any) {
      console.warn('[auth.register] error', {
        message: error?.message,
        httpStatus: error?.response?.status,
        apiMessage: error?.response?.data?.message,
      });
      throw error;
    }
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
    console.warn('[auth.confirmCode] start', {
      baseURL: api.defaults.baseURL,
      flow: data.flow,
      email: data.email,
      codeLength: data.code?.length,
    });
    let response: ApiResponse | RegisterResponse;
    switch (data.flow) {
      case 'registerUser':
        response = await api.post('/auth/confirm/registration', { email: data.email, code: data.code });
        console.warn('[auth.confirmCode] response', {
          httpStatus: (response as any)?.status,
          apiStatus: (response as any)?.data?.status,
        });
        return response.data;
      case 'changeDevice':
        response = await api.put('/auth/confirm/device/change', { email: data.email, code: data.code });
        console.warn('[auth.confirmCode] response', {
          httpStatus: (response as any)?.status,
          apiStatus: (response as any)?.data?.status,
        });
        return response.data;
      default:
        throw new Error('Invalid flow type');
    }
  },

  resendCode: async (email: string, type: ConfirmationFlowType): Promise<ApiResponse> => {
    const response = await api.put('/auth/resend/code', { email, type });
    console.log('response', response);
    return response.data;
  }
};
