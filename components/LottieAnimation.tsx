import React, { useRef, useEffect } from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import LottieView from 'lottie-react-native';
import { animations } from '@/assets/animations';
import { useThemeColor } from '@/hooks/useThemeColor';

interface LottieAnimationProps {
  name: keyof typeof animations;
  style?: ViewStyle;
  autoPlay?: boolean;
  loop?: boolean;
  speed?: number;
}

export const LottieAnimation: React.FC<LottieAnimationProps> = ({
  name,
  style,
  autoPlay = true,
  loop = true,
  speed = 1,
}) => {
  const themeColors = useThemeColor();
  const lottieRef = useRef<LottieView>(null);

  const colorFilters = [
    {
      keypath: "Capa 1 contornos.Grupo 5",
      color: themeColors.extremeContrastGray,
    },
    {
      keypath: "Capa 1 contornos.Grupo 1",
      color: themeColors.onboardingBackground,
    }
  ];

  return (
    <LottieView
      ref={lottieRef}
      source={animations[name]}
      autoPlay={autoPlay}
      loop={loop}
      speed={speed}
      style={[styles.animation, style]}
      colorFilters={colorFilters}
      renderMode="HARDWARE"
    />
  );
};

const styles = StyleSheet.create({
  animation: {
    width: 200,
    height: 200,
  },
}); 