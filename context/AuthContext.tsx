import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login, getUserData, verifyToken } from '@/services/authService';
import { differenceInMinutes } from 'date-fns';
import getEnvVars from '../config';
const { apiUrl } = getEnvVars();

interface UserData {
  name: string;
  surname: string;
  pin: string;
  email: string;
  phone: string;
  address: string;
  profileRole: string;
  profilePicture: string;
  dateOfBirth: string;
  rememberToken: string;
  enable: boolean;
}

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
  updateUserData: (updatedData: Partial<UserData> | FormData) => Promise<void>;
  isPersistentAuthRequired: boolean;
  handlePersistentAuthSuccess: () => Promise<void>;
  userEmail: string;
  isPersistentAuthConfigured: boolean;
  checkPersistentAuth: () => Promise<boolean>;
  checkAuthStatus: () => Promise<void>;
  hydrateUserData: (force?: boolean) => Promise<void>;
}

interface LoginResponse {
  message: string;
  status: number;
  data: {
    user: User;
    jwt: string;
  };
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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isPersistentAuthRequired, setIsPersistentAuthRequired] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isPersistentAuthConfigured, setIsPersistentAuthConfigured] = useState(false);
  const [lastHydrationTime, setLastHydrationTime] = useState<Date | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async (): Promise<void> => {
    console.log('Iniciando checkAuthStatus');
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const storedUser = await AsyncStorage.getItem('user');
      const persistentAuthEnabled = await AsyncStorage.getItem('persistentAuthEnabled');
  
      console.log('Token encontrado:', token ? 'Sí' : 'No');
      console.log('Autenticación persistente habilitada:', persistentAuthEnabled);
  
      if (!token || !storedUser) {
        console.log('No hay token o usuario almacenado, estableciendo isAuthenticated a false');
        setIsAuthenticated(false);
        setUser(null);
      } else {
        const isValid = await verifyToken(token);
        console.log('Token válido:', isValid ? 'Sí' : 'No');
        if (isValid) {
          setIsAuthenticated(true);
          setUser(JSON.parse(storedUser));
          setIsPersistentAuthRequired(persistentAuthEnabled === 'true');
          console.log('isPersistentAuthRequired establecido a:', persistentAuthEnabled === 'true');
        } else {
          await logout();
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      console.log('Finalizando checkAuthStatus, estableciendo isLoading a false');
      setIsLoading(false);
    }
  };

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
        if (token) {
          const response = await getUserData(token);
          if (response.data && response.data.user) {
            setUser(response.data.user);
            setLastHydrationTime(now);
            await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
            await AsyncStorage.setItem('lastHydrationTime', now.toISOString());
          } else {
            throw new Error('Invalid user data received');
          }
        }
      } catch (error) {
        console.error('Error hydrating user data:', error);
        setIsAuthenticated(false);
        setUser(null);
      }
    }
  };

  const handlePersistentAuthSuccess = useCallback(async () => {
    console.log('handlePersistentAuthSuccess llamado');
    setIsPersistentAuthRequired(false);
    setIsAuthenticated(true);
    await hydrateUserData(true);
    console.log('Estado actualizado después de autenticación persistente:', { isAuthenticated: true, isPersistentAuthRequired: false });
  }, [hydrateUserData]);

  const loginContext = async (email: string, password: string) => {
    try {
      const response: LoginResponse = await login(email, password);
      if (response.data && response.data.jwt) {
        await AsyncStorage.setItem('token', response.data.jwt);
        console.log('Token guardado:', response.data.jwt);
        
        // Guardar la información del usuario
        const userData = response.data.user;
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
        setLastHydrationTime(new Date());
        await AsyncStorage.setItem('lastHydrationTime', new Date().toISOString());
        return userData;
      } else {
        throw new Error('No se recibió un token válido');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('persistentAuthConfigured');
      setUser(null);
      setIsPersistentAuthRequired(false);
      setIsPersistentAuthConfigured(false);
      setIsAuthenticated(false);
      console.log('Logout completado, isAuthenticated:', false);
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setIsLoading(false);
      console.log('isLoading establecido a false después del logout');
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

  const updateUserData = async (updatedData: Partial<UserData> | FormData) => {
    if (user) {
      try {
        const token = await AsyncStorage.getItem('token');
        const headers: HeadersInit = {
          'Authorization': `Bearer ${token}`,
        };

        if (!(updatedData instanceof FormData)) {
          headers['Content-Type'] = 'application/json';
        }

        const response = await fetch(`${apiUrl}/user/update`, {
          method: 'PUT',
          headers: headers,
          body: updatedData instanceof FormData ? updatedData : JSON.stringify(updatedData),
        });

        if (!response.ok) {
          throw new Error('Failed to update user data');
        }

        const updatedUser = await response.json();
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      } catch (error) {
        console.error('Error updating user data:', error);
        throw error;
      }
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