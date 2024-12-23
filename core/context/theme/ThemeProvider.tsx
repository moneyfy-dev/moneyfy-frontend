import React, { useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeContext } from './ThemeContext';
import { ThemeMode } from '@/core/types';
import { storage } from '@/shared/utils/storage';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');

  useEffect(() => {
    storage.get('theme').then((savedTheme) => {
      if (savedTheme) {
        setThemeMode(savedTheme as ThemeMode);
      }
    });
  }, []);

  const setThemeModeAndSave = (mode: ThemeMode) => {
    setThemeMode(mode);
    storage.set('theme', mode).catch(error => 
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