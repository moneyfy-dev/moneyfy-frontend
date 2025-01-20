import React, { useEffect, useState } from 'react';
import { useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { storage } from '../../../utils/storage';
import { STORAGE_KEYS } from '@/core/types';
import PersistentAuth from '@/app/(auth)/persistent-auth';

export function PersistentAuthWrapper({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [authMethod, setAuthMethod] = useState<'pin' | 'biometric' | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const router = useRouter();
  const segments = useSegments();
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    const prepare = async () => {
      try {
        const biometricEnabled = await storage.get(STORAGE_KEYS.AUTH.BIOMETRIC_ENABLED);
        const hasPin = await storage.getSecure(STORAGE_KEYS.AUTH.PIN);

        console.log('Valores del storage:', {
          biometricEnabled,
          hasPin: hasPin ? 'existe' : 'no existe'
        });

        if (biometricEnabled === 'true') {
          console.log('Configurando método biométrico');
          setAuthMethod('biometric');
        } else if (hasPin) {
          console.log('Configurando método PIN');
          setAuthMethod('pin');
        }
        setIsReady(true);
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsReady(true);
      }
    };
    prepare();
  }, []);

  // Efecto para manejar la autenticación
  useEffect(() => {
    if (authMethod && !isAuthenticating) {
      setIsAuthenticating(true);
    }
  }, [authMethod, isAuthenticating]);

  useEffect(() => {
    if (!isReady || !rootNavigationState?.key) return;

    const inAuthGroup = segments[0] === '(auth)';
    const currentRoute = segments[segments.length - 1];
    const isPersistentAuthRoute = currentRoute === 'persistent-auth';

    if (isPersistentAuthRoute) return;
    if (inAuthGroup) return;

    if (authMethod) {
      router.replace('/(auth)/persistent-auth');
    }
  }, [isReady, segments, rootNavigationState?.key, authMethod]);

  const handleAuthSuccess = () => {
    setAuthMethod(null);
    setIsAuthenticating(false);
  };

  if (!isReady || !rootNavigationState?.key) {
    return <>{children}</>;
  }

  console.log('Estado actual:', { isReady, authMethod, isAuthenticating });

  // Renderizado condicional basado en estados
  if (authMethod && isAuthenticating) {
    return (
      <PersistentAuth 
        authMethod={authMethod}
        onAuthSuccess={handleAuthSuccess}
      />
    );
  }

  return <>{children}</>;
}
