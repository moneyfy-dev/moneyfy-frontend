import React, { useState, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import { STORAGE_KEYS } from '@/core/types';
import { storage } from '@/shared/utils/storage';
import { authService } from '@/core/services';
import type { ConfirmationFlowType, LoginResponse, RegisterResponse } from '@/core/types';
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
  React.useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
        try {
            setAuthState(prev => ({
                ...prev,
                isLoading: true
            }));
            const { token, sessionToken } = await storage.auth.getTokens();
            const userData = await storage.user.getData();

            if (!token || !sessionToken || !userData) {
                if (isMounted) {
                    setAuthState(prev => ({
                        ...prev,
                        isAuthenticated: false,
                        isPersistentAuthRequired: false
                    }));
                }
                return;
            }

            // Si tenemos tokens y userData, establecer autenticación
            if (isMounted) {
                const biometricEnabled = await storage.get(STORAGE_KEYS.AUTH.BIOMETRIC_ENABLED);
                setAuthState(prev => ({
                    ...prev,
                    isAuthenticated: true,
                    isPersistentAuthRequired: biometricEnabled === 'true'
                }));
            }

            // Verificar auth persistente
            const persistentAuth = await storage.get(STORAGE_KEYS.AUTH.PERSISTENT_AUTH);
            const persistentAuthConfigured = await storage.get(STORAGE_KEYS.AUTH.PERSISTENT_AUTH_CONFIGURED);
            const biometricEnabled = await storage.get(STORAGE_KEYS.AUTH.BIOMETRIC_ENABLED);

            if (isMounted) {
                const shouldRequireAuth = (
                    persistentAuth === 'true' && 
                    persistentAuthConfigured === 'true' &&
                    biometricEnabled === 'true'
                );
                setAuthState(prev => ({
                    ...prev,
                    isPersistentAuthRequired: shouldRequireAuth
                }));
            }
        } catch (error) {
            if (isMounted) {
                setAuthState(prev => ({
                    ...prev,
                    isAuthenticated: false,
                    isPersistentAuthRequired: false
                }));
            }
        } finally {
            if (isMounted) {
                setAuthState(prev => ({
                    ...prev,
                    isLoading: false
                }));
            }
        }
    };

    initializeAuth();

    return () => {
        isMounted = false;
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
        const response = await authService.login(email, password);
        if (!response.data?.user) {
            throw new Error('Respuesta de login inválida');
        }

        // Guardar datos de usuario
        await storage.user.setData(response.data.user);
        await storage.user.updateLastHydration();
        
        // Actualizar estado
        setAuthState(prev => ({
            ...prev,
            isAuthenticated: true
        }));

        return response.data.user;
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
            storage.set(STORAGE_KEYS.AUTH.PERSISTENT_AUTH_CONFIGURED, 'false'),
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
        const [biometricEnabled, persistentAuth, persistentAuthConfigured] = 
            await Promise.all([
                storage.get(STORAGE_KEYS.AUTH.BIOMETRIC_ENABLED),
                storage.get(STORAGE_KEYS.AUTH.PERSISTENT_AUTH),
                storage.get(STORAGE_KEYS.AUTH.PERSISTENT_AUTH_CONFIGURED)
            ]);

        const shouldRequireAuth = 
            biometricEnabled === 'true' && 
            persistentAuth === 'true' && 
            persistentAuthConfigured === 'true';

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

  const checkPersistentAuth = async () => {
    const persistentAuthConfigured = await storage.get(STORAGE_KEYS.AUTH.PERSISTENT_AUTH_CONFIGURED);
    return persistentAuthConfigured === 'true';
  };

  const handlePersistentAuthSuccess = useCallback(async () => {
    setAuthState(prev => ({
        ...prev,
        isPersistentAuthRequired: false,
        isAuthenticated: true
    }));
  }, []);
  
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
      const response = await authService.confirmCode(email, code, flow);
      
      // Si es registro exitoso, guardar datos inmediatamente
      if (flow === 'registerUser' && response.status === 201) {
          if (!response.data?.tokens || !response.data?.user) {
              throw new Error('Respuesta de registro inválida');
          }

          // Guardar tokens
          await storage.auth.setTokens(
              response.data.tokens.jwtRefresh,
              response.data.tokens.jwtSession
          );

          // Actualizar estado de autenticación
          setAuthState(prev => ({
              ...prev,
              isAuthenticated: true
          }));
      }

      return response;
    } catch (error) {
      console.error('Error en confirmCode:', error);
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
        isLoading: authState.isLoading,
        login,
        logout,
        isPersistentAuthRequired: authState.isPersistentAuthRequired,
        handlePersistentAuthSuccess,
        isPersistentAuthConfigured: false,
        checkPersistentAuth,
        checkAuthStatus,
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