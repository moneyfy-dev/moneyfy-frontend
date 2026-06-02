import React from 'react';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';
import { useThemeColor } from '../../hooks/useThemeColor';

interface ThemedSafeAreaViewProps {
  style?: any;
  edges?: Edge[];
  [key: string]: any;
}

export function ThemedSafeAreaView({ style, edges, ...props }: ThemedSafeAreaViewProps) {
  const themeColors = useThemeColor();

  return (
    <SafeAreaView
      style={[{ flex: 1, backgroundColor: themeColors.backgroundColor }, style]}
      edges={edges}
      {...props}
    />
  );
}
