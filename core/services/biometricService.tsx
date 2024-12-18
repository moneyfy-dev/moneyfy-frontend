import * as LocalAuthentication from 'expo-local-authentication';

export const isBiometricAvailable = async (): Promise<boolean> => {
  const compatible = await LocalAuthentication.hasHardwareAsync();
  const enrolled = await LocalAuthentication.isEnrolledAsync();
  return compatible && enrolled;
};

export const authenticateBiometric = async (): Promise<boolean> => {
  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Autenticar con huella digital',
    fallbackLabel: 'Usar PIN',
  });
  return result.success;
};