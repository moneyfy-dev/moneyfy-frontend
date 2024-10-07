import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login, refreshToken, getUserData } from '@/services/authService';
import getEnvVars from '../config';
import NetInfo from "@react-native-community/netinfo";

// Elimina la importación de PersistentAuth

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
  userData: UserData;
  wallet: Wallet;
  accounts: any[];
  referredPeople: any[];
}

interface AuthContextProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  user: User | null;
  setTempEmail: (email: string) => void;
  refreshUserSession: () => Promise<void>;
  updateUserData: (updatedData: Partial<UserData> | FormData) => Promise<void>;
  isPersistentAuthRequired: boolean;
  handlePersistentAuthSuccess: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  user: null,
  setTempEmail: () => {},
  refreshUserSession: async () => {},
  updateUserData: async () => {},
  isPersistentAuthRequired: false,
  handlePersistentAuthSuccess: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isPersistentAuthRequired, setIsPersistentAuthRequired] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const userString = await AsyncStorage.getItem('user');
      const token = await AsyncStorage.getItem('token');
      if (userString && token) {
        const userData = JSON.parse(userString);
        setUser(userData);
        setIsAuthenticated(true);
        setIsPersistentAuthRequired(true);
        
        // Verificar la validez del token y actualizar los datos del usuario
        await refreshUserSession();
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      // Si hay un error, limpiamos los datos locales
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  const hydrateUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const isConnected = await NetInfo.fetch().then(state => state.isConnected);
      
      if (isConnected) {
        // Si hay conexión, obtenemos datos frescos del servidor
        const freshUserData = await getUserData(token);
        await AsyncStorage.setItem('user', JSON.stringify(freshUserData));
        setUser(freshUserData);
      } else {
        // Si no hay conexión, usamos los datos almacenados localmente
        const cachedUserData = await AsyncStorage.getItem('user');
        if (cachedUserData) {
          setUser(JSON.parse(cachedUserData));
        }
      }
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error hydrating user data:', error);
      await logout();
    }
  };

  const handlePersistentAuthSuccess = async () => {
    setIsPersistentAuthRequired(false);
    await hydrateUserData();
  };

  const loginContext = async (email: string, password: string) => {
    try {
      const response = await login(email, password);
      if (response.data && response.data.user) {
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
        await AsyncStorage.setItem('token', response.data.jwt);
        setUser(response.data.user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
  };

  const setTempEmail = (email: string) => {
    if (user) {
      setUser({ ...user, userData: { ...user.userData, email } });
    }
  };

  const refreshUserSession = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const response = await refreshToken(token);
        if (response.data && response.data.user) {
          await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
          await AsyncStorage.setItem('token', response.data.jwt);
          setUser(response.data.user);
          setIsAuthenticated(true);
        } else {
          // Si no hay datos válidos, cerramos la sesión
          await logout();
        }
      }
    } catch (error) {
      console.error('Error refreshing user session:', error);
      await logout();
    }
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

        const response = await fetch(`${apiUrl}/app/user/update`, {
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
      refreshUserSession: hydrateUserData,
      updateUserData,
      isPersistentAuthRequired,
      handlePersistentAuthSuccess
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);