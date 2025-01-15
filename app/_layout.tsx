import React, { useEffect, useState } from 'react';
import { ThemeProvider as NavigationThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import SplashScreenMoneyfy from './splash-screen';
import { PersistentAuthWrapper } from '@/shared/components';
import { Stack } from 'expo-router';
import { screens } from '@/core/types';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme } from '@/shared/hooks';
import { ThemeProvider, OnboardingProvider, AuthProvider, useAuth, UserProvider, QuoteProvider, SettingsProvider, useUser } from '@/core/context';
import { MessageProvider } from '@/core/context/message';

const SPLASH_SCREEN_DURATION = 4000; // Duración fija para la animación de marca

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, isLoading: authLoading, isPersistentAuthRequired } = useAuth();
  const { hydrateUserData } = useUser();
  const [splashScreenComplete, setSplashScreenComplete] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const isAppReady = fontsLoaded && splashScreenComplete && !authLoading;

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashScreenComplete(true);
    }, SPLASH_SCREEN_DURATION);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isAuthenticated && !isPersistentAuthRequired) {
      hydrateUserData();
    }
  }, [isAuthenticated, isPersistentAuthRequired]);

  if (!isAppReady) {
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
                    {isAuthenticated ? (
                      isPersistentAuthRequired ? (
                        <Stack
                          screenOptions={{
                            headerShown: false,
                            animation: 'fade'
                          }}
                          initialRouteName="(auth)"
                        >
                          {screens.map(screen => (
                            <Stack.Screen key={screen.name} name={screen.name} options={screen.options} />
                          ))}
                        </Stack>
                      ) : (
                        <Stack
                          screenOptions={{
                            animation: 'fade'
                          }}
                          initialRouteName="(tabs)"
                        >
                          {screens.map(screen => (
                            <Stack.Screen key={screen.name} name={screen.name} options={screen.options} />
                          ))}
                        </Stack>
                      )
                    ) : (
                      <Stack
                        screenOptions={{
                          headerShown: false,
                          animation: 'fade'
                        }}
                        initialRouteName="(auth)"
                      >
                        {screens.map(screen => (
                          <Stack.Screen key={screen.name} name={screen.name} options={screen.options} />
                        ))}
                      </Stack>
                    )}
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
