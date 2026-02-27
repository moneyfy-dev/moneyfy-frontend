import React, { useState, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import { STORAGE_KEYS } from '@/core/types';
import { storage } from '@/shared/utils/storage';
import { authService } from '@/core/services';
import type { ConfirmationFlowType, LoginResponse, RegisterRequest, RegisterResponse } from '@/core/types';
import { useRouter } from 'expo-router';
import { ROUTES } from '@/core/types';

interface AuthState {
  isAuthenticated: boolean;
  isPersistentAuthRequired: boolean;
  isLoading: boolean;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isPersistentAuthRequired: false,
    isLoading: false
  });
  const router = useRouter();

  // InicializaciÃ³n

  const checkAuthStatus = useCallback(async (): Promise<void> => {
    try {
      const { token, sessionToken } = await storage.auth.getTokens();
      const userData = await storage.user.getData();

      if (!token || !sessionToken || !userData) {
        setAuthState(prev => ({
          ...prev,
          isAuthenticated: false,
          isPersistentAuthRequired: false
        }));
        return;
      }

      // Verificar todos los flags necesarios
      const [biometricEnabled, persistentAuth] =
        await Promise.all([
          storage.get(STORAGE_KEYS.AUTH.BIOMETRIC_ENABLED),
          storage.get(STORAGE_KEYS.AUTH.PERSISTENT_AUTH),
        ]);

      const shouldRequireAuth =
        biometricEnabled === 'true' &&
        persistentAuth === 'true'

      setAuthState(prev => ({
        ...prev,
        isAuthenticated: true,
        isPersistentAuthRequired: shouldRequireAuth
      }));

    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isAuthenticated: false,
        isPersistentAuthRequired: false
      }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await authService.login(email, password);

      console.warn('[AuthProvider.login] response', {
        status: response.status,
        hasTokens: !!response.data?.tokens?.jwtRefresh && !!response.data?.tokens?.jwtSession,
      });

      if ((response.status === 200 || response.status === 202) &&
        response.data?.tokens?.jwtRefresh &&
        response.data?.tokens?.jwtSession) {
        await storage.auth.setTokens(
          response.data.tokens.jwtRefresh,
          response.data.tokens.jwtSession
        );
      }

      switch (response.status) {
        case 200: // Login exitoso
          await storage.user.setData(response.data.user);
          await storage.user.updateLastHydration();
        case 202: // Usuario reactivado
          await storage.user.setData(response.data.user);
          await storage.user.updateLastHydration();
          setAuthState(prev => ({
            ...prev,
            isAuthenticated: true,
            isLoading: false
          }));
          router.replace(ROUTES.TABS.INDEX);
          break;

        case 226: // Cambio de dispositivo requerido
          setAuthState(prev => ({ ...prev, isLoading: false }));
          router.replace({
            pathname: ROUTES.AUTH.CONFIRMATION,
            params: { email, flow: 'changeDevice' }
          });
          break;
      }

      return response;

    } catch (error: any) {
      console.warn('[AuthProvider.login] error', {
        message: error?.message,
        code: error?.code,
        httpStatus: error?.response?.status,
      });
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = async () => {
    setAuthState(prev => ({
      ...prev,
      isLoading: true
    }));
    try {
      // Primero limpiar estados
      setAuthState(prev => ({
        ...prev,
        isAuthenticated: false,
        isPersistentAuthRequired: false
      }));

      // Luego limpiar storage
      await Promise.all([
        storage.auth.clearAuth(),
        storage.user.clearUser(),
        storage.session.clearAll(),
        storage.set(STORAGE_KEYS.AUTH.PERSISTENT_AUTH, 'false'),
        storage.set(STORAGE_KEYS.AUTH.BIOMETRIC_ENABLED, 'false')
      ]);

      // Redirigir al login
      router.replace(ROUTES.AUTH.LOGIN);

    } catch (error) {
    } finally {
      setAuthState(prev => ({
        ...prev,
        isLoading: false
      }));
    }
  };

  const register = async (data: RegisterRequest) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    console.warn('[AuthProvider.register] start', { email: data.email });
    try {
      const response = await authService.register(data);

      if (!response.data) {
        throw new Error('Respuesta de registro inválida');
      }
      console.warn('[AuthProvider.register] response', { status: response.status });
      return response;
    } catch (error: any) {
      console.warn('[AuthProvider.register] error', {
        message: error?.message,
        httpStatus: error?.response?.status,
      });
      throw error;
    } finally {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const requestPasswordReset = async (email: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await authService.requestPasswordReset(email);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const confirmPasswordReset = async (
    email: string,
    code: string,
    newPwd: string,
    repeatedPwd: string
  ) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await authService.confirmPasswordReset({
        email,
        code,
        newPwd: newPwd,
        repeatedPwd: repeatedPwd
      });

      if (response.status === 200) {
        if (!response.data?.tokens || !response.data?.user) {
          throw new Error('Respuesta de registro invÃ¡lida');
        }

        console.warn('[AuthProvider.confirmPasswordReset] tokens', {
          hasTokens: !!response.data.tokens?.jwtRefresh && !!response.data.tokens?.jwtSession,
        });
        await storage.auth.setTokens(
          response.data.tokens.jwtRefresh,
          response.data.tokens.jwtSession
        );
        await storage.user.setData(response.data.user);
        await storage.user.updateLastHydration();

        setAuthState(prev => ({
          ...prev,
          isAuthenticated: true,
          isLoading: false
        }));
      }
      return response;
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const confirmCode = async (
    email: string,
    code: string,
    flow: ConfirmationFlowType,
  ) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await authService.confirmCode({ email, code, flow });

      if (response.status === 201 || response.status === 200) {
        if (!response.data?.tokens || !response.data?.user) {
          throw new Error('Respuesta de registro invÃ¡lida');
        }

        console.warn('[AuthProvider.confirmCode] tokens', {
          status: response.status,
          hasTokens: !!response.data.tokens?.jwtRefresh && !!response.data.tokens?.jwtSession,
        });
        await storage.auth.setTokens(
          response.data.tokens.jwtRefresh,
          response.data.tokens.jwtSession
        );
        await storage.user.setData(response.data.user);
        await storage.user.updateLastHydration();

        setAuthState(prev => ({
          ...prev,
          isAuthenticated: true,
          isLoading: false
        }));
      }
      return response;
    } catch (error) {
      console.warn('[AuthProvider.confirmCode] error', {
        message: (error as any)?.message,
        httpStatus: (error as any)?.response?.status,
        apiData: (error as any)?.response?.data,
      });
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const resendCode = async (email: string, type: ConfirmationFlowType) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await authService.resendCode(email, type);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: authState.isAuthenticated,
        isPersistentAuthRequired: authState.isPersistentAuthRequired,
        isLoading: authState.isLoading,
        checkAuthStatus,
        login,
        logout,
        register,
        requestPasswordReset,
        confirmPasswordReset,
        confirmCode,
        resendCode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};



