import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, AppState } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedInput } from '@/components/ThemedInput';
import { useThemeColor } from '@/hooks/useThemeColor';
import { isBiometricAvailable, authenticateBiometric } from '@/services/biometricService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";
import { ThemedLayout } from '@/components/ThemedLayout';
import { Logo } from '@/components/Logo';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

interface PersistentAuthProps {
  onAuthSuccess: () => void;
}

export default function PersistentAuth({ onAuthSuccess }: PersistentAuthProps) {
  const [pin, setPin] = useState('');
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [canShowAlert, setCanShowAlert] = useState(true);
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
      Alert.alert(title, message);
    } else {
      console.log('No se puede mostrar alerta:', title, message);
    }
  };

  const handleAuthSuccess = async () => {
    console.log('Autenticación persistente exitosa, llamando a handlePersistentAuthSuccess');
    await handlePersistentAuthSuccess();
    console.log('Navegando a (tabs) desde PersistentAuth');
    setTimeout(() => {
      router.replace('/(tabs)');
    }, 100);
  };

  const handleBiometricAuth = async () => {
    try {
      const success = await authenticateBiometric();
      if (success) {
        console.log('Autenticación biométrica exitosa');
        handleAuthSuccess();
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
        handleAuthSuccess();
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
