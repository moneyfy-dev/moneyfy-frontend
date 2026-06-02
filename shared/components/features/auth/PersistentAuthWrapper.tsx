import React, { useEffect, useState } from 'react';
import { storage } from '../../../utils/storage';
import { STORAGE_KEYS } from '@/core/types';
import PersistentAuthScreen from '../../../components/screens/PersistentAuthScreen';
import { LoadingScreen } from '../../animations/LoadingScreen';

interface PersistentAuthWrapperProps {
  children: React.ReactNode;
  enabled?: boolean;
}

export function PersistentAuthWrapper({ children, enabled = true }: PersistentAuthWrapperProps) {
  const [isReady, setIsReady] = useState(false);
  const [authMethods, setAuthMethods] = useState<{
    biometric: boolean;
    pin: boolean;
  }>({
    biometric: false,
    pin: false
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (!enabled) {
      setIsReady(true);
      setIsAuthenticated(false);
      return;
    }

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
  }, [enabled]);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  if (!enabled) {
    return <>{children}</>;
  }

  if (!isReady || !isMounted) {
    return <LoadingScreen />;
  }

  if ((authMethods.biometric || authMethods.pin) && !isAuthenticated) {
    return (
      <PersistentAuthScreen 
        authMethods={authMethods}
        onAuthSuccess={handleAuthSuccess}
      />
    );
  }

  return <>{children}</>;
}
