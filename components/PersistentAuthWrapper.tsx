import React from 'react';
import { PersistentAuth } from '@/app/(auth)/persistent-auth';
import { useAuth } from '@/context/AuthContext';

export const PersistentAuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isPersistentAuthRequired, handlePersistentAuthSuccess } = useAuth();

  if (isPersistentAuthRequired) {
    return <PersistentAuth onAuthSuccess={handlePersistentAuthSuccess} />;
  }

  return <>{children}</>;
};
