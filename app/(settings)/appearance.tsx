import React from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

const AppearanceScreen = () => {
  const themeColors = useThemeColor();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: themeColors.backgroundColor }}>
      <Text style={{ color: themeColors.textColor }}>Pantalla de apariencia</Text>
    </View>
  );
};

export default AppearanceScreen;

