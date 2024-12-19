import React, { useEffect, useState } from 'react';
import { useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { View, Text, ActivityIndicator } from 'react-native';
import { useAuth } from '@/core/context';
import PersistentAuth from '@/app/(auth)/persistent-auth';

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
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const segments = useSegments();
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    const prepare = async () => {
      try {
        await checkAuthStatus();
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

    console.log('Navigation State:', {
      isReady,
      isAuthenticated,
      isPersistentAuthRequired,
      segments,
      inAuthGroup: segments[0] === '(auth)',
      currentSegment: segments[0]
    });

    setTimeout(() => {
      if (isPublicRoute || isPublicAuthRoute) {
        return;
      }

      try {
        if (isAuthenticated && !isPersistentAuthRequired && (inAuthGroup || inPersistentAuth)) {
          router.replace('/(tabs)');
        } else if (!isAuthenticated && !inAuthGroup) {
          router.replace('/(auth)/login');
        } else if (isAuthenticated && isPersistentAuthRequired && !inPersistentAuth) {
          router.replace('/(auth)/persistent-auth');
        }
      } catch (error) {
        console.error('Navigation error:', error);
      }
    }, 0);
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
    return <PersistentAuth onAuthSuccess={handlePersistentAuthSuccess} />;
  }

  return <>{children}</>;
}
