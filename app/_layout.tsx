import React, { useEffect, useState } from 'react';
import { ThemeProvider as NavigationThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import SplashScreenMoneyfy from './splash-screen';
import { PersistentAuthWrapper } from '@/shared/components';
import { Stack } from 'expo-router';
import { screens } from '@/core/types';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme } from '@/shared/hooks';
import { ThemeProvider, OnboardingProvider, AuthProvider, useAuth, UserProvider, SettingsProvider, useUser } from '@/core/context';

const SPLASH_SCREEN_DURATION = 4000; // Duración fija para la animación de marca

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, isLoading, isPersistentAuthRequired } = useAuth();
  const { hydrateUserData } = useUser();
  const [splashScreenComplete, setSplashScreenComplete] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashScreenComplete(true);
    }, SPLASH_SCREEN_DURATION);

    return () => clearTimeout(timer);
  }, []);

  // Efecto para hidratar datos cuando estamos autenticados sin auth persistente
  useEffect(() => {
    if (isAuthenticated && !isPersistentAuthRequired) {
      hydrateUserData();
    }
  }, [isAuthenticated, isPersistentAuthRequired]);

  // Mostrar splash screen mientras se cargan recursos o la animación no termina
  if (!fontsLoaded || !splashScreenComplete || isLoading) {
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
              <SettingsProvider>
                {isAuthenticated && isPersistentAuthRequired ? (
                  <PersistentAuthWrapper>
                    <OnboardingProvider>
                      <Stack initialRouteName="(tabs)">
                        {screens.map(screen => (
                          <Stack.Screen key={screen.name} name={screen.name} options={screen.options} />
                        ))}
                      </Stack>
                    </OnboardingProvider>
                  </PersistentAuthWrapper>
                ) : (
                  <OnboardingProvider>
                    <Stack initialRouteName={isAuthenticated ? '(tabs)' : '(auth)'}>
                      {screens.map(screen => (
                        <Stack.Screen key={screen.name} name={screen.name} options={screen.options} />
                      ))}
                    </Stack>
                  </OnboardingProvider>
                )}
              </SettingsProvider>
            </UserProvider>
          </AuthProvider>
        </SafeAreaProvider>
      </NavigationThemeProvider>
    </ThemeProvider>
  );
}
