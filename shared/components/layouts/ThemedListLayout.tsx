import React from 'react';
import { SafeAreaView, View, StyleSheet, ViewStyle } from 'react-native';
import { useThemeColor } from '@/shared/hooks';

interface ThemedListLayoutProps {
  children: React.ReactNode;
  padding?: number | [number, number];
  style?: ViewStyle;
  headerComponent?: React.ReactNode;
}

export const ThemedListLayout: React.FC<ThemedListLayoutProps> = ({
  children,
  padding,
  style,
  headerComponent
}) => {
  const themeColors = useThemeColor();

  const getPaddingStyle = (padding?: number | [number, number]): ViewStyle => {
    if (!padding) return {};
    if (typeof padding === 'number') {
      return { padding };
    }
    return {
      paddingVertical: padding[0],
      paddingHorizontal: padding[1],
    };
  };

  return (
    <SafeAreaView 
      style={[
        styles.container, 
        { backgroundColor: themeColors.backgroundColor },
        style
      ]}
    >
      {headerComponent}
      <View style={[styles.content, getPaddingStyle(padding)]}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
}); 