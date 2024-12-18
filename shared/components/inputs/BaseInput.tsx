import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../ThemedText';
import { BaseInputProps } from '@/core/types/Input';

interface Props extends BaseInputProps {
  isFocused: boolean;
  themeColors: any;
  children: React.ReactNode;
}

export const BaseInput: React.FC<Props> = ({
  error,
  label,
  icon,
  onIconPress,
  isFocused,
  themeColors,
  children
}) => {
  return (
    <View style={styles.container}>
      {label && (
        <ThemedText style={[styles.label, { color: themeColors.accentInDarkMode }]}>
          {label}
        </ThemedText>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: themeColors.inputBackground,
            borderColor: isFocused ? themeColors.focusedBorderColor : themeColors.unfocusedBorderColor
          }
        ]}
      >
        {children}
        {icon && (
          <TouchableOpacity onPress={onIconPress}>
            <Ionicons
              name={icon as any}
              size={18}
              color={themeColors.textColorAccent}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <ThemedText style={[styles.error, { color: themeColors.status.error }]}>
          {error}
        </ThemedText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
}); 