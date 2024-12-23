import { createContext } from 'react';
import { ThemeContextType } from '@/core/types';

export const ThemeContext = createContext<ThemeContextType>({
  themeMode: 'system',
  setThemeMode: () => {},
  currentTheme: 'light'
});