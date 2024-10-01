import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColor } from '@/hooks/useThemeColor';

export function ThemedSafeAreaView({ style, ...props }: any) {
  const themeColors = useThemeColor();

  return (
    <SafeAreaView
      style={[{ flex: 1, backgroundColor: themeColors.backgroundColor }, style]}
      {...props}
    />
  );
}