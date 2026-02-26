import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemeColor } from '@/shared/hooks/useThemeColor';
import { ThemedLayout } from '../../components/layouts/ThemedLayout';
import { Logo } from '../../components/ui/Logo';
import { ThemedButton } from '../../components/ui/ThemedButton';
import { MessageModal } from '../../components/modals/MessageModal';
import { authenticateBiometric } from '@/core/services';
import { PinInput } from '@/shared/components/ui/PinInput';
import { STORAGE_KEYS } from '@/core/types';
import { storage } from '@/shared/utils/storage';
import { useAuth } from '@/core/context/auth/useAuth';

interface PersistentAuthProps {
  authMethods: {
    biometric: boolean;
    pin: boolean;
  };
  onAuthSuccess: () => void;
}

const PIN_LENGTH = 4;
const MAX_BIOMETRIC_ATTEMPTS = 3;

export default function PersistentAuthScreen({ authMethods, onAuthSuccess }: PersistentAuthProps) {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [biometricAttempts, setBiometricAttempts] = useState(0);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showLogoutOption, setShowLogoutOption] = useState(false);
  const themeColors = useThemeColor();
  const { logout } = useAuth();

  useEffect(() => {
    if (authMethods.biometric) {
      handleBiometricAuth();
    }
  }, []);

  const showAlert = (message: string) => {
    setErrorMessage(message);
    setIsErrorModalVisible(true);
  };

  const handleBiometricAuth = async () => {
    try {
      const success = await authenticateBiometric();
      
      if (success) {
        onAuthSuccess();
      } else {
        const newAttempts = biometricAttempts + 1;
        setBiometricAttempts(newAttempts);
        
        if (newAttempts >= MAX_BIOMETRIC_ATTEMPTS) {
          if (authMethods.pin) {
            showAlert('Demasiados intentos fallidos. Por favor, use su PIN.');
            setShowPin(true);
          } else {
            setShowLogoutOption(true);
            showAlert('Demasiados intentos fallidos. ¿Desea cerrar sesión?');
          }
        } else {
          showAlert('No se pudo autenticar con biometría');
        }
      }
    } catch (error) {
      console.error('Error biométrico:', error);
      const newAttempts = biometricAttempts + 1;
      setBiometricAttempts(newAttempts);
      
      if (newAttempts >= MAX_BIOMETRIC_ATTEMPTS) {
        if (authMethods.pin) {
          showAlert('Error de autenticación biométrica. Por favor, use su PIN.');
          setShowPin(true);
        } else {
          setShowLogoutOption(true);
          showAlert('Error de autenticación biométrica. ¿Desea cerrar sesión?');
        }
      } else {
        showAlert('No se pudo autenticar con biometría');
      }
    }
  };

  const handleNumberPress = (number: string) => {
    setPin(prev => prev.length < PIN_LENGTH ? prev + number : prev);
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  useEffect(() => {
    const verifyPin = async () => {
      if (pin.length === PIN_LENGTH) {
        try {
          const storedPin = await storage.getSecure(STORAGE_KEYS.AUTH.PIN);
          if (pin === storedPin) {
            onAuthSuccess();
          } else {
            showAlert('PIN incorrecto');
            setPin('');
          }
        } catch (error) {
          showAlert('Error al verificar el PIN');
        }
      }
    };

    if (pin.length === PIN_LENGTH) {
      verifyPin();
    }
  }, [pin]);

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
            onPress={handleBiometricAuth}
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
              handleBiometricAuth();
            }}
            variant="secondary"
            style={styles.switchButton}
          />
        )}
      </View>

      <MessageModal
        isVisible={isErrorModalVisible}
        onClose={() => setIsErrorModalVisible(false)}
        title="Error"
        message={errorMessage}
        icon={{
          name: "alert-circle-outline",
          color: themeColors.status.error
        }}
        primaryButton={showLogoutOption ? {
          text: "Cerrar sesión",
          onPress: async () => {
            setIsErrorModalVisible(false);
            await logout();
          }
        } : {
          text: "Entendido",
          onPress: () => setIsErrorModalVisible(false)
        }}
        secondaryButton={showLogoutOption ? {
          text: "Cancelar",
          onPress: () => {
            setIsErrorModalVisible(false);
            setShowLogoutOption(false);
            if (authMethods.biometric) handleBiometricAuth();
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
  buttonContainer: {
    width: '100%',
    marginTop: 24,
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
  }
});
