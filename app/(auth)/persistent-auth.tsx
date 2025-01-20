import React, { useState, useEffect } from 'react';
import { useRouter, useRootNavigationState } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { useThemeColor } from '@/shared/hooks';
import { ThemedLayout } from '../../shared/components/layouts/ThemedLayout';
import { Logo } from '../../shared/components/ui/Logo';
import { ThemedInput } from '../../shared/components/ui/ThemedInput';
import { ThemedButton } from '../../shared/components/ui/ThemedButton';
import { MessageModal } from '../../shared/components/modals/MessageModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authenticateBiometric } from '@/core/services';

interface PersistentAuthProps {
  authMethod: 'pin' | 'biometric' | null;
  onAuthSuccess: () => void;
}

export default function PersistentAuth({ authMethod, onAuthSuccess }: PersistentAuthProps) {
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();
  const [pin, setPin] = useState('');
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const themeColors = useThemeColor();

  useEffect(() => {
    console.log('authMethod', authMethod);
    if (authMethod === 'biometric') {
      handleBiometricAuth();
    }
  }, [authMethod]);

  const showAlert = (message: string) => {
    setErrorMessage(message);
    setIsErrorModalVisible(true);
  };

  const handleBiometricAuth = async () => {
    try {
      console.log('Iniciando autenticación biométrica');
      const success = await authenticateBiometric();
      console.log('Resultado biométrico:', success);
      
      if (success) {
        onAuthSuccess();
      }
    } catch (error) {
      console.error('Error biométrico:', error);
      setErrorMessage('No se pudo autenticar con biometría');
      setIsErrorModalVisible(true);
    }
  };

  const handlePinAuth = async () => {
    try {
      const storedPin = await AsyncStorage.getItem('user_pin');
      if (pin === storedPin) {
        onAuthSuccess();
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
