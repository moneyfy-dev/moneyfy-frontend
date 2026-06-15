import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from './user/useUser';

const LEGACY_ONBOARDING_KEY = 'hasSeenOnboarding';
const getOnboardingKey = (userId: string) => `hasSeenOnboarding:${userId}`;

interface OnboardingContextType {
  hasSeenOnboarding: boolean;
  setHasSeenOnboarding: (value: boolean, userId?: string) => Promise<void>;
  shouldShowOnboarding: boolean;
  setShouldShowOnboarding: (value: boolean) => void;
  isOnboardingStatusLoaded: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false);
  const [isOnboardingStatusLoaded, setIsOnboardingStatusLoaded] = useState(false);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.userId) {
      setIsOnboardingStatusLoaded(false);
      return;
    }

    void checkOnboardingStatus(user.userId);
  }, [user?.userId]);

  const checkOnboardingStatus = async (userId: string) => {
    setIsOnboardingStatusLoaded(false);
    setActiveUserId(userId);

    try {
      const userKey = getOnboardingKey(userId);
      const value = await AsyncStorage.getItem(userKey);

      if (value !== null) {
        setHasSeenOnboarding(value === 'true');
        return;
      }

      const legacyValue = await AsyncStorage.getItem(LEGACY_ONBOARDING_KEY);
      const legacyHasSeenOnboarding = legacyValue === 'true';
      await AsyncStorage.setItem(userKey, legacyHasSeenOnboarding.toString());
      setHasSeenOnboarding(legacyHasSeenOnboarding);
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    } finally {
      setIsOnboardingStatusLoaded(true);
    }
  };

  const handleSetHasSeenOnboarding = async (value: boolean, userId?: string) => {
    const targetUserId = userId || activeUserId || user?.userId;

    if (!targetUserId) {
      return;
    }

    try {
      await AsyncStorage.setItem(getOnboardingKey(targetUserId), value.toString());
      setActiveUserId(targetUserId);
      setHasSeenOnboarding(value);
      setIsOnboardingStatusLoaded(true);
    } catch (error) {
      console.error('Error setting onboarding status:', error);
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        hasSeenOnboarding,
        setHasSeenOnboarding: handleSetHasSeenOnboarding,
        shouldShowOnboarding,
        setShouldShowOnboarding,
        isOnboardingStatusLoaded,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
