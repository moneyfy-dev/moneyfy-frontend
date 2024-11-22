import React from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { PersistentAuthWrapper } from '@/components/PersistentAuthWrapper';
import { OnboardingProvider } from '@/context/OnboardingContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  React.useEffect(() => {
    if (error) throw error;
  }, [error]);

  React.useEffect(() => {
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
            <OnboardingProvider>
              <PersistentAuthWrapper>
                <Stack initialRouteName='(auth)'>
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(settings)" options={{ headerShown: false }} />
                <Stack.Screen name="(quote)" options={{ headerShown: false }} />
                <Stack.Screen name="(legal)" options={{ headerShown: false }} />
                <Stack.Screen name="(referrals)" options={{ headerShown: false }} />
                </Stack>
              </PersistentAuthWrapper>
            </OnboardingProvider>
          </AuthProvider>
        </SafeAreaProvider>
      </NavigationThemeProvider> 
    </ThemeProvider>
  );
}
