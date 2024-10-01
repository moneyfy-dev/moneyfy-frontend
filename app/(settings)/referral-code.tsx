import React from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

const ReferralCodeScreen = () => {
  const themeColors = useThemeColor();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: themeColors.backgroundColor }}>
      <Text style={{ color: themeColors.textColor }}>Pantalla de código de referido</Text>
    </View>
  );
};

export default ReferralCodeScreen;

