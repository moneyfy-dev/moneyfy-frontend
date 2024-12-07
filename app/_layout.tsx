import React, { useState } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { PersistentAuthWrapper } from '@/components/PersistentAuthWrapper';
import { OnboardingProvider } from '@/context/OnboardingContext';
import { SplashScreenMoneyfy } from './splash-screen';
import { ConfirmAddressScreen } from '../app/(quote)/confirm-address';
import { PaymentQRScreen } from '../app/(quote)/payment-qr';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isLoading, setIsLoading] = useState(true);
  const [currentScreen, setCurrentScreen] = useState(0);
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  React.useEffect(() => {
    if (error) throw error;
  }, [error]);

  React.useEffect(() => {
    if (loaded) {
      const interval = setTimeout(() => {
        setIsLoading(false);
      }, 5000);

      return () => clearTimeout(interval);
    }
  }, [loaded]);

  if (!loaded || isLoading) {
    return <SplashScreenMoneyfy />;
  }

//    if (loaded) {
//      const interval = setInterval(() => {
//        setCurrentScreen((prev) => (prev === 0 ? 1 : 0));
//      }, 5000);
//
//      return () => clearInterval(interval);
//    }
//  }, [loaded]);
//
//  if (!loaded || isLoading) {
//    return currentScreen === 0 ? (
//      <ConfirmAddressScreen />
//    ) : (
//      <PaymentQRScreen />
//    );
//  }

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
                <Stack.Screen name="(referrals)" options={{ headerShown: false }} />
                <Stack.Screen name="(wallet)" options={{ headerShown: false }} />
                <Stack.Screen name="(legal)" options={{ headerShown: false }} />
                </Stack>
              </PersistentAuthWrapper>
            </OnboardingProvider>
          </AuthProvider>
        </SafeAreaProvider>
      </NavigationThemeProvider> 
    </ThemeProvider>
  );
}
