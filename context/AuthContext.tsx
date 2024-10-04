import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login, refreshToken } from '@/services/authService';
import { UserData, fetchInitialUserData, saveUserDataLocally, getUserDataFromStorage, updateUserData as updateUserDataService } from '@/services/userDataService';

interface AuthContextProps {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  userEmail: string | null;
  setTempEmail: (email: string) => void;
  refreshUserSession: () => Promise<void>;
  userData: UserData | null;
  updateUserData: (updatedData: Partial<UserData>) => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  userEmail: null,
  setTempEmail: () => {},
  refreshUserSession: async () => {},
  userData: null,
  updateUserData: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

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
      const storedUserData = await getUserDataFromStorage();
      if (storedUserData) {
        setUserData(storedUserData);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loginContext = async (email: string, password: string) => {
    try {
      const response = await login(email, password);
      if (response.jwt && response.email) {
        await AsyncStorage.setItem('userToken', response.jwt);
        await AsyncStorage.setItem('userEmail', response.email);
        setIsAuthenticated(true);
        setUserEmail(response.email);

        // Fetch and store initial user data
        const initialUserData = await fetchInitialUserData(response.jwt);
        await saveUserDataLocally(initialUserData);
        setUserData(initialUserData);
      }
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userEmail');
    setIsAuthenticated(false);
    setUserEmail(null);
    setUserData(null);
    await AsyncStorage.removeItem('userData');
  };

  const setTempEmail = (email: string) => {
    setUserEmail(email);
  };

  const refreshUserSession = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        const response = await refreshToken(token);
        if (response.jwt) {
          await AsyncStorage.setItem('userToken', response.jwt);
          // Optionally, fetch updated user data here
          const updatedUserData = await fetchInitialUserData(response.jwt);
          await saveUserDataLocally(updatedUserData);
          setUserData(updatedUserData);
        }
      }
    } catch (error) {
      console.error('Error refreshing user session:', error);
      await logout();
    }
  };

  const updateUserData = async (updatedData: Partial<UserData>) => {
    if (userData) {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        const newUserData = await updateUserDataService(updatedData, token);
        setUserData(newUserData);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isLoading, 
      login: loginContext, 
      logout, 
      userEmail, 
      setTempEmail,
      refreshUserSession,
      userData,
      updateUserData
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);