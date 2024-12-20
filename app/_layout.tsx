import React, { useEffect, useState } from 'react';
import { ThemeProvider as NavigationThemeProvider, DarkTheme, DefaultTheme, } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import SplashScreenMoneyfy from './splash-screen';
import { PersistentAuthWrapper } from '@/shared/components';
import { Stack } from 'expo-router';
import { screens } from '@/core/types';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme } from '@/shared/hooks';
import { ThemeProvider, OnboardingProvider, AuthProvider, useAuth, UserProvider } from '@/core/context';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, isLoading } = useAuth();
  const [minimumLoadingComplete, setMinimumLoadingComplete] = useState(false);

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
    return (
      <ThemeProvider>
        <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <SplashScreenMoneyfy />
        </NavigationThemeProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <SafeAreaProvider>
          <AuthProvider>
            <UserProvider>
              <PersistentAuthWrapper>
                <OnboardingProvider>
                  <Stack initialRouteName={isAuthenticated ? '(tabs)' : '(auth)'}>
                  {screens.map(screen => (
                    <Stack.Screen key={screen.name} name={screen.name} options={screen.options} />
                  ))}
                </Stack>
              </OnboardingProvider>
            </PersistentAuthWrapper>
            </UserProvider>
          </AuthProvider>
        </SafeAreaProvider>
      </NavigationThemeProvider>
    </ThemeProvider>
  );
}
