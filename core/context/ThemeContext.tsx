import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  currentTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType>({
  themeMode: 'system',
  setThemeMode: () => {},
  currentTheme: 'light'
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');

  useEffect(() => {
    AsyncStorage.getItem('themeMode').then((savedTheme) => {
      if (savedTheme) {
        setThemeMode(savedTheme as ThemeMode);
      }
    });
  }, []);

  const setThemeModeAndSave = (mode: ThemeMode) => {
    setThemeMode(mode);
    AsyncStorage.setItem('themeMode', mode).catch(error => 
      console.error('Error saving theme mode:', error)
    );
  };

  const currentTheme = themeMode === 'system' ? systemColorScheme || 'light' : themeMode;

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode: setThemeModeAndSave, currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};