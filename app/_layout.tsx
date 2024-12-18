import React, { useEffect, useState } from 'react';
import { ThemeProvider as NavigationThemeProvider, DarkTheme, DefaultTheme, } from '@react-navigation/native';
import SplashScreenMoneyfy from './splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { useColorScheme } from '@/shared/hooks/useColorScheme';
import { AuthProvider, useAuth } from '@/core/context/AuthContext';
import { ThemeProvider } from '@/core/context/ThemeContext';
import { PersistentAuthWrapper } from '@/shared/components/PersistentAuthWrapper';
import { OnboardingProvider } from '@/core/context/OnboardingContext';
import { ROUTES, screens } from '@/core/types/routes';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, isLoading } = useAuth();
  const [minimumLoadingComplete, setMinimumLoadingComplete] = useState(false);

  console.log('RootLayout Render:', {
    isAuthenticated,
    isLoading,
    minimumLoadingComplete
  });

  const [fontsLoaded, fontError] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinimumLoadingComplete(true);
    }, 4000);

    return () => clearTimeout(timer); 
  }, []);

  if (!minimumLoadingComplete || !fontsLoaded) {
    console.log('Loading State:', {
      minimumLoadingComplete,
      fontsLoaded
    });
    return (
      <ThemeProvider>
        <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <SplashScreenMoneyfy />
        </NavigationThemeProvider>
      </ThemeProvider>
    );
  }

  console.log('Main Return:', {
    screens: screens.map(s => s.name)
  });

  return (
    <ThemeProvider>
      <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <SafeAreaProvider>
          <AuthProvider>
            <PersistentAuthWrapper>
              <OnboardingProvider>
                <Stack initialRouteName={isAuthenticated ? '(tabs)' : '(auth)'}>
                  {screens.map(screen => (
                    <Stack.Screen key={screen.name} name={screen.name} options={screen.options} />
                  ))}
                </Stack>
              </OnboardingProvider>
            </PersistentAuthWrapper>
          </AuthProvider>
        </SafeAreaProvider>
      </NavigationThemeProvider>
    </ThemeProvider>
  );
}
