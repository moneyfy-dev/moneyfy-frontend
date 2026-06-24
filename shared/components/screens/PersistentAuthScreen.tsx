import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useAuth } from '@/core/context/auth/useAuth';
import { authenticateBiometric } from '@/core/services';
import { STORAGE_KEYS } from '@/core/types';
import { storage } from '@/shared/utils/storage';
import { useThemeColor } from '@/shared/hooks/useThemeColor';
import { ThemedLayout } from '../../components/layouts/ThemedLayout';
import { Logo } from '../../components/ui/Logo';
import { ThemedButton } from '../../components/ui/ThemedButton';
import { MessageModal } from '../../components/modals/MessageModal';
import { PinInput } from '@/shared/components/ui/PinInput';

interface PersistentAuthProps {
  authMethods: {
    biometric: boolean;
    pin: boolean;
  };
  onAuthSuccess: () => void;
}

const PIN_LENGTH = 4;
const MAX_BIOMETRIC_ATTEMPTS = 3;

export default function PersistentAuthScreen({
  authMethods,
  onAuthSuccess,
}: PersistentAuthProps) {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [biometricAttempts, setBiometricAttempts] = useState(0);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showCredentialOption, setShowCredentialOption] = useState(false);
  const themeColors = useThemeColor();
  const { goToLogin } = useAuth();

  useEffect(() => {
    if (authMethods.biometric) {
      void handleBiometricAuth();
    }
  }, [authMethods.biometric]);

  const showAlert = (message: string, allowCredentialFallback = false) => {
    setErrorMessage(message);
    setShowCredentialOption(allowCredentialFallback);
    setIsErrorModalVisible(true);
  };

  const handleGoToLogin = async () => {
    setIsErrorModalVisible(false);
    await goToLogin();
  };

  const handleBiometricAuth = async () => {
    try {
      const success = await authenticateBiometric();

      if (success) {
        onAuthSuccess();
        return;
      }

      const newAttempts = biometricAttempts + 1;
      setBiometricAttempts(newAttempts);

      if (newAttempts >= MAX_BIOMETRIC_ATTEMPTS) {
        if (authMethods.pin) {
          showAlert('Demasiados intentos fallidos. Por favor, usa tu PIN.');
          setShowPin(true);
        } else {
          showAlert(
            'Demasiados intentos fallidos. Puedes volver a intentarlo o ingresar nuevamente con tus credenciales.',
            true
          );
        }
      } else {
        showAlert('No se pudo autenticar con biometría.');
      }
    } catch (error) {
      console.error('Error biométrico:', error);
      const newAttempts = biometricAttempts + 1;
      setBiometricAttempts(newAttempts);

      if (newAttempts >= MAX_BIOMETRIC_ATTEMPTS) {
        if (authMethods.pin) {
          showAlert('Error de autenticación biométrica. Por favor, usa tu PIN.');
          setShowPin(true);
        } else {
          showAlert(
            'Error de autenticación biométrica. Puedes volver a intentarlo o ingresar nuevamente con tus credenciales.',
            true
          );
        }
      } else {
        showAlert('No se pudo autenticar con biometría.');
      }
    }
  };

  const handleNumberPress = (number: string) => {
    setPin((prev) => (prev.length < PIN_LENGTH ? prev + number : prev));
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  useEffect(() => {
    const verifyPin = async () => {
      if (pin.length !== PIN_LENGTH) {
        return;
      }

      try {
        const storedPin = await storage.getSecure(STORAGE_KEYS.AUTH.PIN);
        if (pin === storedPin) {
          onAuthSuccess();
        } else {
          showAlert('PIN incorrecto.');
          setPin('');
        }
      } catch (error) {
        showAlert('Error al verificar el PIN.');
      }
    };

    void verifyPin();
  }, [pin, onAuthSuccess]);

  return (
    <ThemedLayout>
      <View style={styles.pageContainer}>
        <Logo style={styles.loginLogo} />

        {(showPin || !authMethods.biometric) && authMethods.pin && (
          <PinInput
            value={pin}
            maxLength={PIN_LENGTH}
            onNumberPress={handleNumberPress}
            onDelete={handleDelete}
          />
        )}

        {authMethods.biometric && !showPin && (
          <ThemedButton
            text="Usar huella digital"
            onPress={() => {
              void handleBiometricAuth();
            }}
            variant="secondary"
            style={styles.biometricButton}
          />
        )}

        {authMethods.pin && authMethods.biometric && !showPin && (
          <ThemedButton
            text="Usar PIN"
            onPress={() => setShowPin(true)}
            variant="secondary"
            style={styles.switchButton}
          />
        )}

        {showPin && authMethods.biometric && (
          <ThemedButton
            text="Usar huella digital"
            onPress={() => {
              setShowPin(false);
              void handleBiometricAuth();
            }}
            variant="secondary"
            style={styles.switchButton}
          />
        )}

        <ThemedButton
          text="Ingresar con credenciales"
          onPress={() => {
            void handleGoToLogin();
          }}
          variant="secondary"
          style={styles.loginButton}
        />
      </View>

      <MessageModal
        isVisible={isErrorModalVisible}
        onClose={() => {
          setIsErrorModalVisible(false);
          setShowCredentialOption(false);
        }}
        title="Error"
        message={errorMessage}
        icon={{
          name: 'alert-circle-outline',
          color: themeColors.status.error,
        }}
        primaryButton={showCredentialOption ? {
          text: 'Ir al login',
          onPress: () => {
            void handleGoToLogin();
          }
        } : {
          text: 'Entendido',
          onPress: () => {
            setIsErrorModalVisible(false);
          }
        }}
        secondaryButton={showCredentialOption ? {
          text: 'Reintentar',
          onPress: () => {
            setIsErrorModalVisible(false);
            setShowCredentialOption(false);
          }
        } : undefined}
      />
    </ThemedLayout>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  biometricButton: {
    marginTop: 10,
  },
  loginLogo: {
    alignSelf: 'center',
    marginBottom: 24,
  },
  switchButton: {
    marginTop: 16,
  },
  loginButton: {
    marginTop: 16,
  },
});
