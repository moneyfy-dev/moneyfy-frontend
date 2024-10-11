import React, { useEffect, useState } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments, Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import { View, ActivityIndicator } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { PersistentAuthWrapper } from '@/components/PersistentAuthWrapper';


SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isLoading, isAuthenticated, isPersistentAuthRequired, checkAuthStatus } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const [isNavigationReady, setIsNavigationReady] = useState(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      await checkAuthStatus();
      setIsNavigationReady(true);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (!isNavigationReady) return;

    const timer = setTimeout(() => {
      const inAuthGroup = segments[0] === '(auth)';
      const inPersistentAuth = segments[1] === 'persistent-auth';

      console.log('RootLayoutNav - Estado actualizado:', { isAuthenticated, isPersistentAuthRequired, inAuthGroup, inPersistentAuth });

      if (isAuthenticated && !isPersistentAuthRequired && (inAuthGroup || inPersistentAuth)) {
        console.log('Redirigiendo a (tabs) desde RootLayoutNav');
        router.replace('/(tabs)');
      } else if (!isAuthenticated && !inAuthGroup) {
        console.log('Redirigiendo a login');
        router.replace('/(auth)/login');
      } else if (isAuthenticated && isPersistentAuthRequired && !inPersistentAuth) {
        console.log('Redirigiendo a autenticación persistente');
        router.replace('/(auth)/persistent-auth');
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, isPersistentAuthRequired, segments, isNavigationReady, router]);

  if (isLoading || !isNavigationReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <NavigationThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <SafeAreaProvider>
          <AuthProvider>
            <PersistentAuthWrapper>
              <RootLayoutNav />
            </PersistentAuthWrapper>
          </AuthProvider>
        </SafeAreaProvider>
      </NavigationThemeProvider>
    </ThemeProvider>
  );
}