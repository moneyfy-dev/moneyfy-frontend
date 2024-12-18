import React from 'react';
import { View, ViewProps } from 'react-native';
import { useThemeColor } from '@/shared/hooks/useThemeColor';

interface ThemedViewProps extends ViewProps {
  lightColor?: string;
  darkColor?: string;
}

export function ThemedView(props: ThemedViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const themeColors = useThemeColor();

  const backgroundColor = lightColor || darkColor || themeColors.backgroundColor;

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
