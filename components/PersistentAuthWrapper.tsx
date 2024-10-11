import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import PersistentAuth from '@/app/(auth)/persistent-auth';
import { useRouter, useSegments } from 'expo-router';

export function PersistentAuthWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isPersistentAuthRequired, handlePersistentAuthSuccess } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('PersistentAuthWrapper - Estado actualizado:', { isAuthenticated, isPersistentAuthRequired });
      setIsChecking(false);
    }, 0);

    return () => clearTimeout(timer);
  }, [isAuthenticated, isPersistentAuthRequired]);

  useEffect(() => {
    if (!isChecking && isAuthenticated && !isPersistentAuthRequired && segments[0] !== '(tabs)') {
      const timer = setTimeout(() => {
        console.log('Redirigiendo a (tabs) desde PersistentAuthWrapper');
        router.replace('/(tabs)');
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isChecking, isAuthenticated, isPersistentAuthRequired, segments, router]);

  if (isChecking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (isAuthenticated && isPersistentAuthRequired) {
    return <PersistentAuth onAuthSuccess={handlePersistentAuthSuccess} />;
  }

  return <>{children}</>;
}