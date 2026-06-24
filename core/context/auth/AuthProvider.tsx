import React, { useState, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import { useEffect } from 'react';
import { STORAGE_KEYS } from '@/core/types';
import { storage } from '@/shared/utils/storage';
import { extractAuthTokens } from '@/shared/utils/authTokens';
import { authService } from '@/core/services';
import type { ConfirmationFlowType, RegisterRequest } from '@/core/types';
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

  // InicializaciÃ³n

  const checkAuthStatus = useCallback(async (): Promise<void> => {
    setAuthState(prev => ({
      ...prev,
      isLoading: true
    }));

    try {
      const { token, sessionToken } = await storage.auth.getTokens();
      const userData = await storage.user.getData();

      if (!token || !sessionToken || !userData) {
        setAuthState({
          isAuthenticated: false,
          isPersistentAuthRequired: false,
          isLoading: false
        });
        return;
      }

      // Verificar todos los flags necesarios
      const [biometricEnabled, persistentAuth, pinEnabled] =
        await Promise.all([
          storage.get(STORAGE_KEYS.AUTH.BIOMETRIC_ENABLED),
          storage.get(STORAGE_KEYS.AUTH.PERSISTENT_AUTH),
          storage.getSecure(STORAGE_KEYS.AUTH.PIN),
        ]);

      const shouldRequireAuth =
        persistentAuth === 'true' &&
        (biometricEnabled === 'true' || !!pinEnabled);

      setAuthState({
        isAuthenticated: true,
        isPersistentAuthRequired: shouldRequireAuth,
        isLoading: false
      });

    } catch (error) {
      setAuthState({
        isAuthenticated: false,
        isPersistentAuthRequired: false,
        isLoading: false
      });
    }
  }, []);

  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    try {
      const response = await authService.login(email, password);

      switch (response.status) {
        case 200: // Login exitoso
          {
            const tokens = extractAuthTokens(response);
            if (!response.data?.user || !tokens) {
              throw new Error('Respuesta de inicio de sesiÃ³n invÃ¡lida');
            }

            await storage.auth.setTokens(tokens.refreshToken, tokens.sessionToken);
            await storage.user.setData(response.data.user);
            await storage.user.updateLastHydration();
            setAuthState(prev => ({
              ...prev,
              isAuthenticated: true,
              isPersistentAuthRequired: false,
              isLoading: false
            }));
            router.replace(ROUTES.TABS.INDEX);
          }
          break;

        case 202: // Usuario reactivado, el backend no entrega tokens en este flujo
          if (response.data?.user) {
            await storage.user.setData(response.data.user);
            await storage.user.updateLastHydration();
          }
          setAuthState(prev => ({
            ...prev,
            isAuthenticated: false,
            isLoading: false
          }));
          router.replace(ROUTES.AUTH.LOGIN);
          break;
      }

      return response;

    } catch (error: any) {
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
      await authService.logout().catch(() => undefined);

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
        storage.quote.clearQuote(),
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
    try {
      const response = await authService.register(data);

      if (!response.data) {
        throw new Error('Respuesta de registro inválida');
      }
      return response;
    } catch (error: any) {
      throw error;
    } finally {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const goToLogin = async () => {
    setAuthState(prev => ({
      ...prev,
      isLoading: true
    }));

    try {
      setAuthState(prev => ({
        ...prev,
        isAuthenticated: false,
        isPersistentAuthRequired: false
      }));

      await Promise.all([
        storage.auth.clearTokens(),
        storage.user.clearUser(),
        storage.session.clearAll(),
        storage.quote.clearQuote(),
      ]);

      router.replace(ROUTES.AUTH.LOGIN);
    } catch (error) {
    } finally {
      setAuthState(prev => ({
        ...prev,
        isLoading: false
      }));
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
        const tokens = extractAuthTokens(response);
        if (!response.data?.user || !tokens) {
          throw new Error('Respuesta de recuperaciÃ³n de contraseÃ±a invÃ¡lida');
        }

        await storage.auth.setTokens(tokens.refreshToken, tokens.sessionToken);
        await storage.user.setData(response.data.user);
        await storage.user.updateLastHydration();
        await Promise.all([
          storage.session.clearAll(),
          storage.quote.clearQuote(),
        ]);

        setAuthState(prev => ({
          ...prev,
          isAuthenticated: true,
          isPersistentAuthRequired: false,
          isLoading: false
        }));
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
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
        const tokens = extractAuthTokens(response);

        if (!response.data?.user || !tokens) {
          throw new Error('Respuesta de registro invÃ¡lida');
        }

        await storage.auth.setTokens(tokens.refreshToken, tokens.sessionToken);
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
        goToLogin,
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



