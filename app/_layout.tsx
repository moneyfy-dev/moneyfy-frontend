import React from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { View, ActivityIndicator } from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { PersistentAuthWrapper } from '@/components/PersistentAuthWrapper';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { isLoading, isAuthenticated, isPersistentAuthRequired } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        isPersistentAuthRequired ? (
          <Stack.Screen name="(auth)/persistent-auth" options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        )
      ) : (
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      )}
    </Stack>
  );
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
