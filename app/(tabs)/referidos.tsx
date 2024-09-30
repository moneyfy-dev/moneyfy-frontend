import React from 'react';
import { View, Text } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function ReferidosScreen() {
  const themeColors = useThemeColor();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: themeColors.backgroundColor }}>
      <Text style={{ color: themeColors.textColor }}>Pantalla de Referidos</Text>
    </View>
  );
}