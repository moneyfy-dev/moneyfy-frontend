import React, { useEffect, useState } from 'react';
import { ThemeProvider as NavigationThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import SplashScreenMoneyfy from './splash-screen';
import { PersistentAuthWrapper } from '@/shared/components';
import { Stack } from 'expo-router';
import { screens } from '@/core/types';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme } from '@/shared/hooks';
import { AuthProvider, MessageProvider, OnboardingProvider, QuoteProvider, SettingsProvider, UserProvider, useAuth, useUser } from '@/core/context';
import { ThemeProvider } from '@/core/theme/ThemeProvider';

const SPLASH_SCREEN_DURATION = 4000;

function AppStack() {
  const { isAuthenticated, isLoading, isPersistentAuthRequired } = useAuth();
  const { hydrateUserData } = useUser();

  useEffect(() => {
    if (isAuthenticated && !isPersistentAuthRequired) {
      hydrateUserData().catch(() => {});
    }
  }, [hydrateUserData, isAuthenticated, isPersistentAuthRequired]);

  if (isLoading) {
    return <SplashScreenMoneyfy />;
  }

  const initialRouteName = isAuthenticated ? '(tabs)' : '(auth)';
  const screenOptions = isAuthenticated && !isPersistentAuthRequired
    ? { animation: 'fade' as const }
    : { headerShown: false, animation: 'fade' as const };

  const stack = (
    <Stack screenOptions={screenOptions} initialRouteName={initialRouteName}>
      {screens.map(screen => (
        <Stack.Screen key={screen.name} name={screen.name} options={screen.options} />
      ))}
    </Stack>
  );

  return (
    <PersistentAuthWrapper enabled={isAuthenticated && isPersistentAuthRequired}>
      {stack}
    </PersistentAuthWrapper>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [splashScreenComplete, setSplashScreenComplete] = useState(false);

  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashScreenComplete(true);
    }, SPLASH_SCREEN_DURATION);

    return () => clearTimeout(timer);
  }, []);

  if (!fontsLoaded || !splashScreenComplete) {
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
          <MessageProvider>
            <AuthProvider>
              <UserProvider>
                <QuoteProvider>
                  <SettingsProvider>
                    <OnboardingProvider>
                      <AppStack />
                    </OnboardingProvider>
                  </SettingsProvider>
                </QuoteProvider>
              </UserProvider>
            </AuthProvider>
          </MessageProvider>
        </SafeAreaProvider>
      </NavigationThemeProvider>
    </ThemeProvider>
  );
}
