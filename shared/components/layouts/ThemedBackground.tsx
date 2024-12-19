import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useColorScheme } from 'react-native';

export const ThemedBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme();

  return (
    <View style={[
      styles.container,
      { backgroundColor: colorScheme === 'dark' ? '#90C00F' : '#FFFFFF' }
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});