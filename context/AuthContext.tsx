import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (response: any) => Promise<void>;
  logout: () => Promise<void>;
  userEmail: string | null;
  setTempEmail: (email: string) => void; // Nueva función
}

const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  isLoading: true,
  login: async () => {
    console.warn('login function not implemented');
  },
  logout: async () => {
    console.warn('logout function not implemented');
  },
  userEmail: null,
  setTempEmail: () => {
    console.warn('setTempEmail function not implemented');
  },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const email = await AsyncStorage.getItem('userEmail');
      if (token && email) {
        setIsAuthenticated(true);
        setUserEmail(email);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (response: any) => {
    if (response.jwt && response.email) {
      await AsyncStorage.setItem('userToken', response.jwt);
      await AsyncStorage.setItem('userEmail', response.email);
      setIsAuthenticated(true);
      setUserEmail(response.email);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userEmail');
    setIsAuthenticated(false);
    setUserEmail(null);
  };

  const setTempEmail = (email: string) => {
    setUserEmail(email);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout, userEmail, setTempEmail }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);