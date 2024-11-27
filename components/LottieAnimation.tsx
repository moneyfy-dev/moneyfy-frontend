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
    },
    {
      keypath: "bg contornos 1.Grupo 3",
      color: themeColors.extremeContrastGray,
    },
    {
      keypath: "bg contornos 1.Grupo 2",
      color: themeColors.onboardingBackground,
    },
    {
      keypath: "tarjeta contornos.Grupo 13",
      color: themeColors.onboardingBackground,
    },
    {
      keypath: "bg contornos 2.Grupo 3",
      color: themeColors.extremeContrastGray,
    },
    {
      keypath: "bg contornos 2.Grupo 2",
      color: themeColors.onboardingBackground,
    },
    {
      keypath: "bg contornos 2.Grupo 1",
      color: themeColors.green2to3,
    },
    {
      keypath: "bloques contornos.Grupo 1",
      color: themeColors.onboardingBackground,
    },
    {
      keypath: "cabeza contornos 2.Grupo 1",
      color: themeColors.iconRefBorder,
    },
    {
      keypath: "bg contornos 3.Grupo 3",
      color: themeColors.extremeContrastGray,
    },
    {
      keypath: "bg contornos 3.Grupo 2",
      color: themeColors.green2to3,
    },
    {
      keypath: "bg contornos 3.Grupo 1",
      color: themeColors.onboardingBackground,
    },
    {
      keypath: "cabeza contornos 3.Grupo 1",
      color: themeColors.iconRefBorder,
    },
    {
      keypath: "cabeza contornos 3.Grupo 3",
      color: themeColors.iconRefBorder,
    },
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