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
import SplashScreenMoneyfy from './splash-screen';
import * as SplashScreen from 'expo-splash-screen';
import { useInitialResources } from '@/hooks/useInitialResources';

// Mantener el splash screen visible mientras cargamos recursos
SplashScreen.preventAutoHideAsync().catch(() => {
  /* revert to default behavior */
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isResourcesLoaded, setResourcesLoaded] = useState(false);
  const [isSplashHidden, setSplashHidden] = useState(false);
  
  const [fontsLoaded, fontError] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  
  const { isLoading: isInitialDataLoading, error: initialDataError } = useInitialResources();

  React.useEffect(() => {
    async function prepare() {
      try {
        // Simular carga de recursos iniciales
        await new Promise(resolve => setTimeout(resolve, 5000));
      } catch (e) {
        console.warn(e);
      } finally {
        setResourcesLoaded(true);
      }
    }

    prepare();
  }, []);

  React.useEffect(() => {
    if (fontsLoaded && isResourcesLoaded) {
      // Cuando los recursos estén listos, ocultar el splash screen nativo
      async function hideSplash() {
        try {
          await SplashScreen.hideAsync();
          setSplashHidden(true);
        } catch (e) {
          console.warn('Error hiding splash screen:', e);
        }
      }
      
      hideSplash();
    }
  }, [fontsLoaded, isResourcesLoaded]);

  // Manejo de errores
  React.useEffect(() => {
    if (fontError || initialDataError) {
      console.error('Error loading initial resources:', { fontError, initialDataError });
    }
  }, [fontError, initialDataError]);

  // Mientras los recursos no estén listos o el splash no se haya ocultado, retornar null
  if (!fontsLoaded || !isResourcesLoaded || !isSplashHidden) {
    return null;
  }

  // Una vez que todo está listo, mostrar nuestro splash personalizado
  if (isInitialDataLoading) {
    return <SplashScreenMoneyfy />;
  }

  // Finalmente, mostrar la app
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
