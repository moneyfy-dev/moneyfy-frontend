import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Animated } from 'react-native';
import { ThemedLayout } from '@/components/ThemedLayout';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// ... (resto del código anterior)

const SuccessAnimation = () => {
  const themeColors = useThemeColor();
  const scaleValue = new Animated.Value(0);
  
  useEffect(() => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.successCircle, { transform: [{ scale: scaleValue }] }]}>
      <Ionicons name="checkmark" size={80} color={themeColors.extremeContrastGray} />
    </Animated.View>
  );
};

// ... (en la parte del renderizado)

if (stage === 'success') {
  return (
    <ThemedLayout padding={[40, 40]} style={styles.successContainer}>
      <SuccessAnimation />
      <ThemedText variant="title" textAlign="center" marginTop={24}>
        PIN configurado exitosamente
      </ThemedText>
      <ThemedButton
        text="Volver"
        onPress={() => router.back()}
        style={styles.backButton}
      />
    </ThemedLayout>
  );
}

// ... (resto del código)

const styles = StyleSheet.create({
  // ... (estilos anteriores)
  successContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  successCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#4CAF50', // Color verde, puedes ajustarlo según tu tema
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    marginTop: 24,
  },
});