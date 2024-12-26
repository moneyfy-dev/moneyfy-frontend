import React, { useEffect, useState } from 'react';
import { useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { View, Text, ActivityIndicator } from 'react-native';
import { useAuth } from '@/core/context/auth/useAuth';
import { storage } from '@/shared/utils/storage';
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
  const { isAuthenticated, isPersistentAuthRequired, isLoading, handlePersistentAuthSuccess, checkAuthStatus } = useAuth();
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
    const isPublicRoute = PUBLIC_ROUTES.includes(segments[0]);
    const isPublicAuthRoute = inAuthGroup && PUBLIC_AUTH_ROUTES.includes(segments[1] || '');

    try {
        // Si no está autenticado -> Login
        if (!isAuthenticated && !inAuthGroup) {
            router.replace('/(auth)/login');
            return;
        }

        // Si está autenticado y requiere auth persistente -> Persistent Auth
        if (isAuthenticated && isPersistentAuthRequired && !inPersistentAuth) {
            router.replace('/(auth)/persistent-auth');
            return;
        }

        // Si está autenticado y no requiere auth persistente -> Index
        if (isAuthenticated && !isPersistentAuthRequired && (inAuthGroup || inPersistentAuth)) {
            router.replace('/(tabs)');
            return;
        }

    } catch (error) {
        console.error('Navigation error:', error);
    }
  }, [isReady, isAuthenticated, isPersistentAuthRequired, segments, rootNavigationState?.key]);

  if (!isReady || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando...</Text>
      </View>
    );
  }

  if (isAuthenticated && isPersistentAuthRequired) {
    return <PersistentAuth 
      onAuthSuccess={handlePersistentAuthSuccess}
      authMethod={authMethod}
    />;
  }

  return <>{children}</>;
}
