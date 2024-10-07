import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedInput } from '@/components/ThemedInput';
import { useThemeColor } from '@/hooks/useThemeColor';
import { isBiometricAvailable, authenticateBiometric } from '@/services/biometricService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";

interface PersistentAuthProps {
  onAuthSuccess: () => void;
}

export default function PersistentAuth({ onAuthSuccess }: PersistentAuthProps) {
  const [pin, setPin] = useState('');
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const themeColors = useThemeColor();

  useEffect(() => {
    checkBiometricAvailability();
    checkNetworkStatus();
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

  const handleAuthSuccess = async () => {
    if (isOffline) {
      Alert.alert(
        "Modo sin conexión",
        "No hay conexión a internet. Se mostrarán los datos almacenados localmente.",
        [{ text: "OK", onPress: () => onAuthSuccess() }]
      );
    } else {
      onAuthSuccess();
    }
  };

  const handleBiometricAuth = async () => {
    try {
      const success = await authenticateBiometric();
      if (success) {
        handleAuthSuccess();
      }
    } catch (error) {
      console.error('Error during biometric authentication:', error);
      Alert.alert('Error', 'No se pudo autenticar con biometría');
    }
  };

  const handlePinAuth = async () => {
    try {
      const storedPin = await AsyncStorage.getItem('user_pin');
      if (pin === storedPin) {
        handleAuthSuccess();
      } else {
        Alert.alert('Error', 'PIN incorrecto');
      }
    } catch (error) {
      console.error('Error during PIN authentication:', error);
      Alert.alert('Error', 'No se pudo verificar el PIN');
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText variant="title" textAlign="center">Autenticación</ThemedText>
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
      {isBiometricEnabled && (
        <ThemedButton 
          text="Usar huella digital" 
          onPress={handleBiometricAuth}
          variant="secondary"
          style={styles.biometricButton}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  biometricButton: {
    marginTop: 10,
  },
});
