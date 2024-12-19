import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, StyleSheet, AppState } from 'react-native';
import { useThemeColor } from '@/shared/hooks';
import { ThemedLayout, Logo, ThemedInput, ThemedButton, MessageModal } from '@/shared/components';
import { useAuth } from '@/core/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";
import { isBiometricAvailable, authenticateBiometric } from '@/core/services';

interface PersistentAuthProps {
  onAuthSuccess: () => void;
}

export default function PersistentAuth({ onAuthSuccess }: PersistentAuthProps) {
  const [pin, setPin] = useState('');
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [canShowAlert, setCanShowAlert] = useState(true);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const themeColors = useThemeColor();
  const router = useRouter();
  const { handlePersistentAuthSuccess } = useAuth();

  useEffect(() => {
    checkBiometricAvailability();
    checkNetworkStatus();

    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'active') {
        setCanShowAlert(true);
        checkNetworkStatus();
      } else {
        setCanShowAlert(false);
      }
    });

    return () => {
      unsubscribe();
      subscription.remove();
    };
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const available = await isBiometricAvailable();
      setIsBiometricEnabled(available);
      if (available) {
        handleBiometricAuth();
      }
    } catch (error) {
      console.error('Error checking biometric availability:', error);
    }
  };

  const checkNetworkStatus = async () => {
    const connection = await NetInfo.fetch();
    setIsOffline(!connection.isConnected);
  };

  const showAlert = (title: string, message: string) => {
    if (canShowAlert) {
      setErrorMessage(message);
      setIsErrorModalVisible(true);
    } else {
      console.log('No se puede mostrar alerta:', title, message);
    }
  };

  const handleAuthSuccess = async () => {
    try {
      await handlePersistentAuthSuccess();
    } catch (error) {
      console.error('Error en handleAuthSuccess:', error);
      showAlert('Error', 'Hubo un problema con la autenticación');
    }
  };

  const handleBiometricAuth = async () => {
    try {
      const success = await authenticateBiometric();
      if (success) {
        console.log('Autenticación biométrica exitosa');
        await handleAuthSuccess();
      }
    } catch (error) {
      console.error('Error during biometric authentication:', error);
      showAlert('Error', 'No se pudo autenticar con biometría. Por favor, use el PIN.');
    }
  };

  const handlePinAuth = async () => {
    try {
      const storedPin = await AsyncStorage.getItem('user_pin');
      if (pin === storedPin) {
        await handleAuthSuccess();
      } else {
        showAlert('Error', 'PIN incorrecto');
      }
    } catch (error) {
      console.error('Error during PIN authentication:', error);
      showAlert('Error', 'No se pudo verificar el PIN');
    }
  };

  return (
    <ThemedLayout>
      <View style={styles.pageContainer}>
        <Logo style={styles.loginLogo} />
        <ThemedInput
          label="PIN"
          value={pin}
          onChangeText={setPin}
          placeholder="Ingrese su PIN"
          keyboardType="number-pad"
          secureTextEntry
          maxLength={4}
        />
      </View>

      <View style={styles.buttonContainer}>
        <ThemedButton text="Verificar PIN" onPress={handlePinAuth} />
        {isBiometricEnabled && (
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
