import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OnboardingContextType {
  hasSeenOnboarding: boolean;
  setHasSeenOnboarding: (value: boolean) => void;
  shouldShowOnboarding: boolean;
  setShouldShowOnboarding: (value: boolean) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const value = await AsyncStorage.getItem('hasSeenOnboarding');
      setHasSeenOnboarding(value === 'true');
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    }
  };

  const handleSetHasSeenOnboarding = async (value: boolean) => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', value.toString());
      setHasSeenOnboarding(value);
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