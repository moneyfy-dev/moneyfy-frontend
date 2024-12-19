import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemeColor } from '@/shared/hooks';
import { ThemedView, ThemedText, LottieAnimation } from '@/shared/components';

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
    <View style={[styles.content, { backgroundColor: themeColors.loadingScreen }]}>
      <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    backgroundColor: 'transparent',
  },
});