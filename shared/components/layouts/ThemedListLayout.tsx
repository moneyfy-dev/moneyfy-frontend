import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Edge, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColor } from '../../hooks/useThemeColor';
import { ThemedSafeAreaView } from '../layouts/ThemedSafeAreaView';

interface ThemedListLayoutProps {
  children: React.ReactNode;
  padding?: number | [number, number];
  style?: ViewStyle;
  headerComponent?: React.ReactNode;
  safeAreaEdges?: Edge[];
  reserveBottomInset?: boolean;
}

export const ThemedListLayout: React.FC<ThemedListLayoutProps> = ({
  children,
  padding,
  style,
  headerComponent,
  safeAreaEdges,
  reserveBottomInset = true,
}) => {
  const themeColors = useThemeColor();
  const insets = useSafeAreaInsets();

  const getPaddingStyle = (padding?: number | [number, number]): ViewStyle => {
    if (!padding) return {};
    if (typeof padding === 'number') {
      return {
        paddingTop: padding,
        paddingHorizontal: padding,
        paddingBottom: reserveBottomInset ? Math.max(padding, insets.bottom + 24) : padding,
      };
    }
    return {
      paddingTop: padding[0],
      paddingBottom: reserveBottomInset ? Math.max(padding[0], insets.bottom + 24) : padding[0],
      paddingHorizontal: padding[1],
    };
  };

  return (
    <ThemedSafeAreaView
      edges={safeAreaEdges ?? (reserveBottomInset ? undefined : ['top', 'left', 'right'])}
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
    </ThemedSafeAreaView>
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
