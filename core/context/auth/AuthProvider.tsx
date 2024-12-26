import React, { useState, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import { STORAGE_KEYS } from '@/core/types';
import { storage } from '@/shared/utils/storage';
import { authService } from '@/core/services';
import type { ConfirmationFlowType, LoginResponse } from '@/core/types';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPersistentAuthRequired, setIsPersistentAuthRequired] = useState<boolean>(false);
  const [isPersistentAuthConfigured, setIsPersistentAuthConfigured] = useState(false);

  // Inicialización
  React.useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const { token, sessionToken } = await storage.auth.getTokens();
        const userData = await storage.user.getData();

        if (!token || !sessionToken || !userData) {
          if (isMounted) {
            setIsAuthenticated(false);
            setIsPersistentAuthRequired(false);
          }
          await storage.auth.clearAuth();
          await storage.user.clearUser();
        } else {
          const { isValid } = await authService.verifySession();
          if (isValid && isMounted) {
            setIsAuthenticated(true);
            const persistentAuth = await storage.get(STORAGE_KEYS.AUTH.PERSISTENT_AUTH);
            setIsPersistentAuthRequired(persistentAuth === 'true');
          } else {
            if (isMounted) {
              setIsAuthenticated(false);
              setIsPersistentAuthRequired(false);
            }
            await storage.auth.clearAuth();
            await storage.user.clearUser();
          }
        }
      } catch (error) {
        if (isMounted) {
          setIsAuthenticated(false);
          setIsPersistentAuthRequired(false);
        }
        await storage.auth.clearAuth();
        await storage.user.clearUser();
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const loginContext = async (response: LoginResponse) => {
    try {
      // Validar que la respuesta tenga la estructura correcta
      if (!response.data?.tokens || !response.data?.user) {
        throw new Error('Respuesta de login inválida');
      }

      // Guardar tokens
      await storage.auth.setTokens(
        response.data.tokens.jwtRefresh,
        response.data.tokens.jwtSession
      );
      
      // Guardar datos del usuario
      await storage.user.setData(response.data.user);
      await storage.user.updateLastHydration();
      
      // Actualizar estado de autenticación
      setIsAuthenticated(true);

      // Retornar los datos del usuario para que el componente login pueda usarlos
      return response.data.user;
    } catch (error: any) {
      console.error('Error en login:', error);
      if (!error.response || error.response.status !== 226) {
        setIsAuthenticated(false);
      }
      throw error;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await storage.auth.clearAuth();
      await storage.user.clearUser();
      await storage.session.clearAll();
      setIsPersistentAuthRequired(false);
      setIsPersistentAuthConfigured(false);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAuthStatus = useCallback(async (): Promise<void> => {
    try {
      const { token, sessionToken } = await storage.auth.getTokens();
      const userData = await storage.user.getData();
      const persistentAuth = await storage.get(STORAGE_KEYS.AUTH.PERSISTENT_AUTH);

      if (!token || !sessionToken || !userData) {
        setIsAuthenticated(false);
        setIsPersistentAuthRequired(false);
        await storage.auth.clearAuth();
        await storage.user.clearUser();
      } else {
        const { isValid } = await authService.verifySession();
        if (isValid) {
          setIsAuthenticated(true);
          setIsPersistentAuthRequired(persistentAuth === 'true');
        } else {
          setIsAuthenticated(false);
          setIsPersistentAuthRequired(false);
          await storage.auth.clearAuth();
          await storage.user.clearUser();
        }
      }
    } catch (error) {
      setIsAuthenticated(false);
      setIsPersistentAuthRequired(false);
      await storage.auth.clearAuth();
      await storage.user.clearUser();
    }
  }, []);

  const checkPersistentAuth = async () => {
    const persistentAuthConfigured = await storage.get(STORAGE_KEYS.AUTH.PERSISTENT_AUTH_CONFIGURED);
    return persistentAuthConfigured === 'true';
  };

  const handlePersistentAuthSuccess = useCallback(async () => {
    setIsPersistentAuthRequired(false);
    setIsAuthenticated(true);
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
    console.log('confirmPasswordReset', email, code, newPwd, repeatedPwd);
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
      const response = await authService.confirmCode(email, code, flow );
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
        isAuthenticated,
        isLoading,
        loginContext,
        logout,
        isPersistentAuthRequired,
        handlePersistentAuthSuccess,
        isPersistentAuthConfigured,
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