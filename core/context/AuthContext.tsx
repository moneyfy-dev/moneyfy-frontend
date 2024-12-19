import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login, getUserData, verifyToken } from '@/core/services/authService';
import { differenceInMinutes } from 'date-fns';
import { AuthContextProps, User, LoginResponse } from '@/core/types/auth';

const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  isLoading: true,
  loginContext: async (response: LoginResponse): Promise<User | null> => {
    throw new Error('login function must be overridden');
  },
  logout: async () => {},
  user: null,
  refreshUserSession: async () => {},
  updateUserData: async () => {},
  isPersistentAuthRequired: false,
  handlePersistentAuthSuccess: async () => {},
  userEmail: '',
  isPersistentAuthConfigured: false,
  checkPersistentAuth: async () => false,
  checkAuthStatus: async () => {},
  hydrateUserData: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPersistentAuthRequired, setIsPersistentAuthRequired] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState('');
  const [isPersistentAuthConfigured, setIsPersistentAuthConfigured] = useState(false);
  const [lastHydrationTime, setLastHydrationTime] = useState<Date | null>(null);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const sessionToken = await AsyncStorage.getItem('sessionToken');
        const storedUser = await AsyncStorage.getItem('user');
        const persistentAuthEnabled = await AsyncStorage.getItem('persistentAuthEnabled');

        if (!token || !sessionToken || !storedUser) {
          if (isMounted) {
            setIsAuthenticated(false);
            setUser(null);
            setIsPersistentAuthRequired(false);
          }
          await AsyncStorage.multiRemove(['token', 'sessionToken', 'user']);
        } else {
          const { isValid, userData } = await verifyToken(token, sessionToken);
          if (isValid && isMounted) {
            setIsAuthenticated(true);
            setUser(userData.user);
            setIsPersistentAuthRequired(persistentAuthEnabled === 'true');
          } else {
            if (isMounted) {
              setIsAuthenticated(false);
              setUser(null);
              setIsPersistentAuthRequired(false);
            }
            await AsyncStorage.multiRemove(['token', 'sessionToken', 'user']);
          }
        }
      } catch (error) {
        if (isMounted) {
          setIsAuthenticated(false);
          setUser(null);
          setIsPersistentAuthRequired(false);
        }
        await AsyncStorage.multiRemove(['token', 'sessionToken', 'user']);
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

  const checkAuthStatus = useCallback(async (): Promise<void> => {
    try {
      const token = await AsyncStorage.getItem('token');
      const sessionToken = await AsyncStorage.getItem('sessionToken');
      const storedUser = await AsyncStorage.getItem('user');
      const persistentAuthEnabled = await AsyncStorage.getItem('persistentAuthEnabled');

      if (!token || !sessionToken || !storedUser) {
        setIsAuthenticated(false);
        setUser(null);
        setIsPersistentAuthRequired(false);
        await AsyncStorage.multiRemove(['token', 'sessionToken', 'user']);
      } else {
        const { isValid, userData } = await verifyToken(token, sessionToken);
        if (isValid) {
          setIsAuthenticated(true);
          setUser(userData.user);
          setIsPersistentAuthRequired(persistentAuthEnabled === 'true');
        } else {
          setIsAuthenticated(false);
          setUser(null);
          setIsPersistentAuthRequired(false);
          await AsyncStorage.multiRemove(['token', 'sessionToken', 'user']);
        }
      }
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
      setIsPersistentAuthRequired(false);
      await AsyncStorage.multiRemove(['token', 'sessionToken', 'user']);
    }
  }, []);

  const checkPersistentAuth = async () => {
    const persistentAuthConfigured = await AsyncStorage.getItem('persistentAuthConfigured');
    return persistentAuthConfigured === 'true';
  };

  const hydrateUserData = async (force = false) => {
    const now = new Date();
    const shouldHydrate = force || !lastHydrationTime || differenceInMinutes(now, lastHydrationTime) >= 15;
  
    if (shouldHydrate) {
      try {
        const token = await AsyncStorage.getItem('token');
        const sessionToken = await AsyncStorage.getItem('sessionToken');
        if (token && sessionToken) {
          const response = await getUserData(token, sessionToken);
          if (response.data && response.data.user) {
            setUser(response.data.user);
            setLastHydrationTime(now);
            await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
            await AsyncStorage.setItem('lastHydrationTime', now.toISOString());
            await AsyncStorage.setItem('token', response.data.tokens.jwtRefresh);
            await AsyncStorage.setItem('sessionToken', response.data.tokens.jwtSession);
          } else {
            throw new Error('Invalid user data received');
          }
        }
      } catch (error) {
        setIsAuthenticated(false);
        setUser(null);
      }
    }
  };

  const handlePersistentAuthSuccess = useCallback(async () => {
    await hydrateUserData(true);
    setIsPersistentAuthRequired(false);
    setIsAuthenticated(true);
  }, [hydrateUserData]);

  const loginContext = async (response: LoginResponse) => {
    try {
        // Guardar ambos tokens
        await AsyncStorage.setItem('token', response.data.tokens.jwtRefresh);
        await AsyncStorage.setItem('sessionToken', response.data.tokens.jwtSession);
        
        // Guardar la información del usuario
        const userData = response.data.user;
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
        setLastHydrationTime(new Date());
        await AsyncStorage.setItem('lastHydrationTime', new Date().toISOString());
        return userData;
    } catch (error: any) {
      console.error('Error en login:', error);
      // Solo limpiamos el estado si NO es el caso de nuevo dispositivo
      if (!error.response || error.response.status !== 226) {
        setIsAuthenticated(false);
        setUser(null);
      }
      throw error;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('sessionToken');
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('persistentAuthConfigured');
      setUser(null);
      setIsPersistentAuthRequired(false);
      setIsPersistentAuthConfigured(false);
      setIsAuthenticated(false);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUserSession = async () => {
    await hydrateUserData();
  };

  const updateUserData = async (updatedData: any) => {

    try {
      // Reemplaza completamente el objeto del usuario con los datos actualizados
      const newUser = updatedData;
      setUser(newUser);

      // Guarda los datos actualizados en AsyncStorage
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      setLastHydrationTime(new Date());
      await AsyncStorage.setItem('lastHydrationTime', new Date().toISOString());

      // Si hay un nuevo token, actualízalo también
      if (updatedData.tokens) {
        await AsyncStorage.setItem('token', updatedData.tokens.jwtRefresh);
        await AsyncStorage.setItem('sessionToken', updatedData.tokens.jwtSession);
      }
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isLoading,
      loginContext, 
      logout, 
      user,
      refreshUserSession,
      updateUserData,
      isPersistentAuthRequired,
      handlePersistentAuthSuccess,
      userEmail,
      isPersistentAuthConfigured,
      checkPersistentAuth,
      checkAuthStatus,
      hydrateUserData,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
