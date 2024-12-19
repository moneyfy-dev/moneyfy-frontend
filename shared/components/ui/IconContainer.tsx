import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

interface IconContainerProps {
  icon: keyof typeof Ionicons.glyphMap;
  size?: number;
  style?: any;
  backgroundColor?: string;
}

export const IconContainer: React.FC<IconContainerProps> = ({
  icon,
  size = 24,
  style,
  backgroundColor = Colors.common.green2
}) => {
  return (
    <View
      style={[
        styles.container,
        { backgroundColor },
        style
      ]}
    >
      <Ionicons 
        name={icon} 
        size={size} 
        color={Colors.common.white} 
      />
    </View>
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