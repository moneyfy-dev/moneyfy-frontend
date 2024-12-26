import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, StyleSheet, AppState } from 'react-native';
import { useThemeColor } from '@/shared/hooks';
import { ThemedLayout } from '../../shared/components/layouts/ThemedLayout';
import { Logo } from '../../shared/components/ui/Logo';
import { ThemedInput } from '../../shared/components/ui/ThemedInput';
import { ThemedButton } from '../../shared/components/ui/ThemedButton';
import { MessageModal } from '../../shared/components/modals/MessageModal';
import { useAuth } from '@/core/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";
import { isBiometricAvailable, authenticateBiometric } from '@/core/services';

interface PersistentAuthProps {
  onAuthSuccess: () => void;
  authMethod: 'pin' | 'biometric' | null;
}

export default function PersistentAuth({ onAuthSuccess, authMethod }: PersistentAuthProps) {
  const { handlePersistentAuthSuccess } = useAuth();
  const [pin, setPin] = useState('');
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const themeColors = useThemeColor();

  useEffect(() => {
    // Si está habilitada la biometría, intentar autenticación automáticamente
    if (authMethod === 'biometric') {
      handleBiometricAuth();
    }
  }, []);

  const showAlert = (message: string) => {
    setErrorMessage(message);
    setIsErrorModalVisible(true);
  };

  const handleAuthSuccess = async () => {
    try {
      await handlePersistentAuthSuccess();
      onAuthSuccess();
    } catch (error) {
      showAlert('Hubo un problema con la autenticación');
    }
  };

  const handleBiometricAuth = async () => {
    try {
      const success = await authenticateBiometric();
      if (success) {
        await handleAuthSuccess();
      }
    } catch (error) {
      showAlert('No se pudo autenticar con biometría');
    }
  };

  const handlePinAuth = async () => {
    try {
      const storedPin = await AsyncStorage.getItem('user_pin');
      if (pin === storedPin) {
        await handleAuthSuccess();
      } else {
        showAlert('PIN incorrecto');
      }
    } catch (error) {
      showAlert('No se pudo verificar el PIN');
    }
  };

  return (
    <ThemedLayout>
      <View style={styles.pageContainer}>
        <Logo style={styles.loginLogo} />
        
        {authMethod === 'pin' && (
          <>
            <ThemedInput
              label="PIN"
              value={pin}
              onChangeText={setPin}
              placeholder="Ingrese su PIN"
              keyboardType="number-pad"
              secureTextEntry
              maxLength={4}
            />
            <ThemedButton text="Verificar PIN" onPress={handlePinAuth} />
          </>
        )}

        {authMethod === 'biometric' && (
          <ThemedButton
            text="Usar huella digital"
            onPress={handleBiometricAuth}
            variant="secondary"
            style={styles.biometricButton}
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
        primaryButton={{
          text: "Entendido",
          onPress: () => setIsErrorModalVisible(false)
        }}
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
});
