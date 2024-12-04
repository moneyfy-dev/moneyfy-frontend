import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';

interface IconContainerProps {
  icon: keyof typeof Ionicons.glyphMap;
  size?: number;
  style?: any;
}

export const IconContainer: React.FC<IconContainerProps> = ({
  icon,
  size = 24,
  style
}) => {
  return (
    <LinearGradient
      colors={[Colors.common.green2, Colors.common.green2]}
      style={[styles.container, style]}
    >
      <Ionicons 
        name={icon} 
        size={size} 
        color={Colors.common.white} 
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 40,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
}); 