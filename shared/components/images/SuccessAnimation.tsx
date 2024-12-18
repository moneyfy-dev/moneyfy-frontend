import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Animated } from 'react-native';
import { ThemedLayout } from '@/shared/components/ThemedLayout';
import { ThemedText } from '@/shared/components/ThemedText';
import { ThemedButton } from '@/shared/components/ThemedButton';
import { useThemeColor } from '@/shared/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';

interface SuccessAnimationProps {
  message: string;
  onBackPress: () => void;
}

const SuccessAnimation: React.FC<SuccessAnimationProps> = ({ message, onBackPress }) => {
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

export default SuccessAnimation;