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
    isLoading: true
  });
  const router = useRouter();

  // Inicialización


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
      console.error('Error in checkAuthStatus:', error);
      setAuthState(prev => ({
        ...prev,
        isAuthenticated: false,
        isPersistentAuthRequired: false
      }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      // Validar que la respuesta tenga la estructura correcta

      switch (response.status) {
        case 200: // Login exitoso
          await storage.user.setData(response.data.user);
          await storage.user.updateLastHydration();
        case 202: // Usuario reactivado
          await storage.user.setData(response.data.user);
          await storage.user.updateLastHydration();
          setAuthState(prev => ({
            ...prev,
            isAuthenticated: true
          }));
          router.replace(ROUTES.TABS.INDEX);
          break;

        case 226: // Cambio de dispositivo requerido
          router.replace({
            pathname: ROUTES.AUTH.CONFIRMATION,
            params: { email, flow: 'changeDevice' }
          });
          break;
      }

      return response;

    } catch (error: any) {
      console.error('❌ Error en login:', error);
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
      console.error('Error during logout:', error);
    } finally {
      setAuthState(prev => ({
        ...prev,
        isLoading: false
      }));
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      const response = await authService.register(data);
      if (!response.data) {
        throw new Error('Respuesta de registro inválida');
      }
      return response;
    } catch (error: any) {
      console.error('❌ Error en el registro:', error);
      throw error;
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      const response = await authService.requestPasswordReset(email);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const confirmPasswordReset = async (
    email: string,
    code: string,
    newPwd: string,
    repeatedPwd: string
  ) => {
    try {
      const response = await authService.confirmPasswordReset({
        email,
        code,
        newPwd: newPwd,
        repeatedPwd: repeatedPwd
      });

      if (response.status === 200) {
        if (!response.data?.tokens || !response.data?.user) {
          throw new Error('Respuesta de registro inválida');
        }

        // Guardar datos de usuario
        await storage.user.setData(response.data.user);
        await storage.user.updateLastHydration();

        // Actualizar estado
        setAuthState(prev => ({
          ...prev,
          isAuthenticated: true
        }));
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const confirmCode = async (
    email: string,
    code: string,
    flow: ConfirmationFlowType,
  ) => {
    try {
      const response = await authService.confirmCode({ email, code, flow });

      // Si es registro exitoso, guardar datos inmediatamente
      if (response.status === 201 || response.status === 200) {
        if (!response.data?.tokens || !response.data?.user) {
          throw new Error('Respuesta de registro inválida');
        }

        // Guardar datos de usuario
        await storage.user.setData(response.data.user);
        await storage.user.updateLastHydration();

        // Actualizar estado
        setAuthState(prev => ({
          ...prev,
          isAuthenticated: true
        }));
      }
      return response;
    } catch (error) {
      throw error;
    }
  };

  const resendCode = async (email: string, type: ConfirmationFlowType) => {
    try {
      const response = await authService.resendCode(email, type);
      return response;
    } catch (error) {
      throw error;
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