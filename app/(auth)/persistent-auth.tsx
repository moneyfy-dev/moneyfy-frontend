import React from 'react';
import { storage } from '@/shared/utils/storage';
import { STORAGE_KEYS } from '@/core/types';
import PersistentAuthScreen from '@/shared/components/screens/PersistentAuthScreen';
import { useRouter } from 'expo-router';

export default function PersistentAuthPage() {
  const router = useRouter();
  // Este componente solo maneja la configuración inicial
  const [authMethods, setAuthMethods] = React.useState({
    biometric: false,
    pin: false
  });

  React.useEffect(() => {
    const prepare = async () => {
      const biometricEnabled = await storage.get(STORAGE_KEYS.AUTH.BIOMETRIC_ENABLED);
      const hasPin = await storage.getSecure(STORAGE_KEYS.AUTH.PIN);

      setAuthMethods({
        biometric: biometricEnabled === 'true',
        pin: !!hasPin
      });
    };
    prepare();
  }, []);

  const handleAuthSuccess = () => {
    router.replace('/(tabs)');
  };

  return <PersistentAuthScreen authMethods={authMethods} onAuthSuccess={handleAuthSuccess} />;
}
