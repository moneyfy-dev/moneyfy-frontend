import React from 'react';
import { View, Text } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function HistorialScreen() {
  const themeColors = useThemeColor();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: themeColors.backgroundColor }}>
      <Text style={{ color: themeColors.textColor }}>Pantalla de Historial</Text>
    </View>
  );
}