import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { LottieAnimation } from './LottieAnimation';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';

export const LoadingScreen = () => {
  const themeColors = useThemeColor();
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prevDots => {
        switch (prevDots) {
          case '':
            return '.';
          case '.':
            return '..';
          case '..':
            return '...';
          default:
            return '';
        }
      });
    }, 500); // Velocidad de la animación

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: themeColors.backgroundColor }]}>
      <ThemedView style={styles.textContainer}>
        <ThemedText variant="title">
          Cargando{dots}
        </ThemedText>
      </ThemedView>
      <LottieAnimation
        name="Loading"
        style={styles.animation}
        autoPlay
        loop
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: 420,
    height: 420,
    marginBottom: 20,
  },
  textContainer: {
    width: 100,
  },
});