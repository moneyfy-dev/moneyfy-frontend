import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import PersistentAuth from '@/app/(auth)/persistent-auth';
import { useRouter, useSegments, useRootNavigationState } from 'expo-router';

export function PersistentAuthWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isPersistentAuthRequired, isLoading, handlePersistentAuthSuccess, checkAuthStatus } = useAuth();
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();
  const segments = useSegments();
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    const prepare = async () => {
      await checkAuthStatus();
      setIsReady(true);
    };
    prepare();
  }, []);

  useEffect(() => {
    if (!isReady || !rootNavigationState?.key) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inPersistentAuth = segments[1] === 'persistent-auth';

    if (isAuthenticated && !isPersistentAuthRequired && (inAuthGroup || inPersistentAuth)) {
      router.replace('/(tabs)');
    } else if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && isPersistentAuthRequired && !inPersistentAuth) {
      router.replace('/(auth)/persistent-auth');
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
    return <PersistentAuth onAuthSuccess={handlePersistentAuthSuccess} />;
  }

  return <>{children}</>;
}
