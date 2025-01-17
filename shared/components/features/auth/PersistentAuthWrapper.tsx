import React, { useEffect, useState } from 'react';
import { useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { View, Text, ActivityIndicator } from 'react-native';
import { useAuth } from '@/core/context/auth/useAuth';
import { storage } from '../../../utils/storage';
import { STORAGE_KEYS } from '@/core/types';
import PersistentAuth from '@/app/(auth)/persistent-auth';
import { useUser } from '@/core/context/user/useUser';

const PUBLIC_ROUTES = ['(legal)'];
const PUBLIC_AUTH_ROUTES = [
  'login', 
  'registerScreen', 
  'forgot-password', 
  'confirmation-code', 
  'persistent-auth'
];

export function PersistentAuthWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isPersistentAuthRequired, handlePersistentAuthSuccess, checkAuthStatus } = useAuth();
  const { hydrateUserData } = useUser();
  const [isReady, setIsReady] = useState(false);
  const [authMethod, setAuthMethod] = useState<'pin' | 'biometric' | null>(null);
  const router = useRouter();
  const segments = useSegments();
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    const prepare = async () => {
      try {
        await checkAuthStatus();
        if (isAuthenticated) {
          const biometricEnabled = await storage.get(STORAGE_KEYS.AUTH.BIOMETRIC_ENABLED);
          const hasPin = await storage.getSecure(STORAGE_KEYS.AUTH.PIN);

          if (biometricEnabled === 'true') {
            setAuthMethod('biometric');
          } else if (hasPin) {
            setAuthMethod('pin');
          }

          await hydrateUserData();
        }
        setIsReady(true);
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsReady(true);
      }
    };
    prepare();
  }, []);

  useEffect(() => {
    if (!isReady || !rootNavigationState?.key) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inPersistentAuth = segments[1] === 'persistent-auth';
    
    try {
      if (!isAuthenticated) {
        if (!inAuthGroup || segments[1] !== 'login') {
          router.replace('/(auth)/login');
        }
      } else if (isPersistentAuthRequired) {
        if (!inPersistentAuth) {
          router.replace('/(auth)/persistent-auth');
        }
      } else {
        if (inAuthGroup || inPersistentAuth) {
          router.replace('/(tabs)');
        }
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  }, [isReady, isAuthenticated, isPersistentAuthRequired, segments, rootNavigationState?.key]);

  if (!isReady || !rootNavigationState?.key) {
    return <>{children}</>;
  }

  if (isAuthenticated && isPersistentAuthRequired) {
    return <PersistentAuth 
      onAuthSuccess={handlePersistentAuthSuccess}
      authMethod={authMethod}
    />;
  }

  return <>{children}</>;
}
