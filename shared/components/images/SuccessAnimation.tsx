import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Animated } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import { ThemedLayout } from '../layouts/ThemedLayout';
import { ThemedText } from '../ui/ThemedText';
import { ThemedButton } from '../ui/ThemedButton';
import { Ionicons } from '@expo/vector-icons';

interface SuccessAnimationProps {
  message: string;
  onBackPress: () => void;
}

export const SuccessAnimation: React.FC<SuccessAnimationProps> = ({ message, onBackPress }) => {
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
    <ThemedLayout padding={[40, 40]}>
      <Animated.View style={[styles.successCircle, { transform: [{ scale: scaleValue }], backgroundColor: themeColors.status.success }]}>
        <Ionicons name="checkmark" size={80} color={themeColors.extremeContrastGray} />
      </Animated.View>
      <ThemedText variant="title" textAlign="center">
        {message}
      </ThemedText>
      <ThemedButton
        text="Volver"
        onPress={onBackPress}
        style={styles.backButton}
      />
    </ThemedLayout>
  );
};

const styles = StyleSheet.create({
  successContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  successCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    marginTop: 24,
  },
});
