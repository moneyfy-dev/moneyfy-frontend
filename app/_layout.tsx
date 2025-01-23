import React, { useEffect, useState } from 'react';
import { ThemeProvider as NavigationThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import SplashScreenMoneyfy from './splash-screen';
import { PersistentAuthWrapper } from '@/shared/components';
import { storage } from '@/shared/utils/storage';
import { Stack } from 'expo-router';
import { screens } from '@/core/types';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useColorScheme } from '@/shared/hooks';
import { OnboardingProvider, AuthProvider, useAuth, UserProvider, QuoteProvider, SettingsProvider, useUser } from '@/core/context';
import { ThemeProvider } from '@/core/theme/ThemeProvider';
import { MessageProvider } from '@/core/context';
import { STORAGE_KEYS } from '@/core/types';

const SPLASH_SCREEN_DURATION = 4000; // Duración fija para la animación de marca

interface AuthState {
  isAuthenticated: boolean;
  isPersistentAuthRequired: boolean;
  isLoading: boolean;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { isAuthenticated, isLoading: authLoading, isPersistentAuthRequired, logout } = useAuth();
  const { hydrateUserData } = useUser();
  const [splashScreenComplete, setSplashScreenComplete] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isPersistentAuthRequired: false,
    isLoading: true
  });

  const isAppReady = fontsLoaded && splashScreenComplete && !authLoading;

  useEffect(() => {
    const timer = setTimeout(() => {
      setSplashScreenComplete(true);
    }, SPLASH_SCREEN_DURATION);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      try {
        setAuthState(prev => ({
          ...prev,
          isLoading: true
        }));

        // Obtener todos los datos necesarios primero
        const { token, sessionToken } = await storage.auth.getTokens();
        const isPersistentAuthConfigured = await storage.get(STORAGE_KEYS.AUTH.PERSISTENT_AUTH);
        const userData = await storage.user.getData();
        const pinEnabled = await storage.get(STORAGE_KEYS.AUTH.PIN);
        const biometricEnabled = await storage.get(STORAGE_KEYS.AUTH.BIOMETRIC_ENABLED);

        if (!token || !sessionToken || !userData) {
          if (isMounted) {
            setAuthState({
              isAuthenticated: false,
              isPersistentAuthRequired: false,
              isLoading: false
            });
            logout();
          }
          return;
        }

        // Determinar el estado final en una sola actualización
        const shouldRequireAuth = isPersistentAuthConfigured === 'true' && 
          (pinEnabled === 'true' || biometricEnabled === 'true');

        if (isMounted) {
          setAuthState({
            isAuthenticated: true,
            isPersistentAuthRequired: shouldRequireAuth,
            isLoading: false
          });
        }

        if (!shouldRequireAuth) {
          hydrateUserData();
        }

      } catch (error) {
        if (isMounted) {
          setAuthState({
            isAuthenticated: false,
            isPersistentAuthRequired: false,
            isLoading: false
          });
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  // Añadir un nuevo useEffect para monitorear cambios en authState
  useEffect(() => {
  }, [authState]);

  if (!isAppReady || authState.isLoading) {
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
              <PersistentAuthWrapper>
                <UserProvider>
                  <QuoteProvider>
                    <SettingsProvider>
                      <OnboardingProvider>
                        {authState.isAuthenticated ? (
                          authState.isPersistentAuthRequired ? (
                            <Stack
                              screenOptions={{
                                headerShown: false,
                                animation: 'fade'
                              }}
                              initialRouteName="(tabs)"
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
              </PersistentAuthWrapper>
            </AuthProvider>
          </MessageProvider>
        </SafeAreaProvider>
      </NavigationThemeProvider>
    </ThemeProvider>
  );
}
