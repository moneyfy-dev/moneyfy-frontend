import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login, getUserData, verifyToken } from '@/services/authService';
import { differenceInMinutes } from 'date-fns';
import { Notifications } from '@/types/useNotifications';

interface Wallet {
  totalBalance: number;
  outstandingBalance: number;
  availableBalance: number;
  paymentBalance: number;
  history: any[];
}

interface User {
  userId: string;
  personalData: {
    name: string;
    surname: string;
    email: string;
    phone: string;
    address: string;
    dateOfBirth: string;
    profilePicture: string;
    enable: boolean;
  };
  notifs: Notifications;
  wallet: Wallet;
  accounts: any[];
  referredPeople: any[];
}

interface AuthContextProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;  // Cambiado de Promise<void> a Promise<User>
  logout: () => Promise<void>;
  user: User | null;
  setTempEmail: (email: string) => void;
  refreshUserSession: () => Promise<void>;
  updateUserData: (updatedData: any) => Promise<void>;
  isPersistentAuthRequired: boolean;
  handlePersistentAuthSuccess: () => Promise<void>;
  userEmail: string;
  isPersistentAuthConfigured: boolean;
  checkPersistentAuth: () => Promise<boolean>;
  checkAuthStatus: () => Promise<void>;
  hydrateUserData: (force?: boolean) => Promise<void>;
}

interface LoginResponse {
  data: {
    tokens: {
      jwtRefresh: string;
      jwtSession: string;
    };
    user: User;
  };
  message: string;
  status: number;
}

const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  isLoading: true,
  login: async (email: string, password: string): Promise<User> => {
    throw new Error('login function must be overridden');
  },
  logout: async () => {},
  user: null,
  setTempEmail: () => {},
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
    checkAuthStatus();
  }, []);

  const checkAuthStatus = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const sessionToken = await AsyncStorage.getItem('sessionToken');
      const storedUser = await AsyncStorage.getItem('user');
      const persistentAuthEnabled = await AsyncStorage.getItem('persistentAuthEnabled');
  
      if (!token || !sessionToken || !storedUser) {
        setIsAuthenticated(false);
        setUser(null);
        setIsPersistentAuthRequired(false);
        // Limpiar tokens si alguno falta
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
    } finally {
      setIsLoading(false);
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

  const loginContext = async (email: string, password: string) => {
    try {
      const response: LoginResponse = await login(email, password);
      console.log(response);
      if (response.data && response.data.tokens) {
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
      } else {
        throw new Error('No se recibieron los tokens válidos');
      }
    } catch (error) {
      console.error('Error en login:', error);
      setIsAuthenticated(false);
      setUser(null);
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

  const setTempEmail = (email: string) => {
    setUserEmail(email);
    if (user) {
      setUser({
        ...user,
        personalData: { ...user.personalData, email }
      });
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
      login: loginContext, 
      logout, 
      user, 
      setTempEmail,
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
