import React, { useEffect, useState } from 'react';
import { useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { storage } from '../../../utils/storage';
import { STORAGE_KEYS } from '@/core/types';
import PersistentAuthScreen from '../../../components/screens/PersistentAuthScreen';

export function PersistentAuthWrapper({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [authMethods, setAuthMethods] = useState<{
    biometric: boolean;
    pin: boolean;
  }>({
    biometric: false,
    pin: false
  });
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const segments = useSegments();
  const rootNavigationState = useRootNavigationState();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    const prepare = async () => {
      try {
        const biometricEnabled = await storage.get(STORAGE_KEYS.AUTH.BIOMETRIC_ENABLED);
        const hasPin = await storage.getSecure(STORAGE_KEYS.AUTH.PIN);

        setAuthMethods({
          biometric: biometricEnabled === 'true',
          pin: !!hasPin
        });
        
        setIsReady(true);
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsReady(true);
      }
    };
    prepare();
  }, []);

  useEffect(() => {
    if (!isReady || !rootNavigationState?.key || !isMounted) return;

    const inAuthGroup = segments[0] === '(auth)';
    const currentRoute = segments[segments.length - 1];
    const isPersistentAuthRoute = currentRoute === 'persistent-auth';
    const isInitialAuth = !isAuthenticated && !isAuthenticating;

    if (!inAuthGroup && !isPersistentAuthRoute && isInitialAuth) {
      const navigate = async () => {
        try {
          if (authMethods.biometric || authMethods.pin) {
            await router.replace('/(auth)/persistent-auth');
          }
        } catch (error) {
          console.error('Navigation error:', error);
        }
      };

      requestAnimationFrame(() => {
        navigate();
      });
    }
  }, [isReady, segments, rootNavigationState?.key, authMethods, isAuthenticated, isMounted]);

  useEffect(() => {
    if (isAuthenticated && segments[0] === '(auth)') {
      requestAnimationFrame(() => {
        router.replace('/(tabs)');
      });
    }
  }, [isAuthenticated, segments]);

  const handleAuthSuccess = () => {
    setIsAuthenticating(false);
    setIsAuthenticated(true);
  };

  if (!isReady || !rootNavigationState?.key || !isMounted) {
    return <>{children}</>;
  }

  if ((authMethods.biometric || authMethods.pin) && !isAuthenticated) {
    if (!isAuthenticating) {
      setIsAuthenticating(true);
    }
    return (
      <PersistentAuthScreen 
        authMethods={authMethods}
        onAuthSuccess={handleAuthSuccess}
      />
    );
  }

  return <>{children}</>;
}
