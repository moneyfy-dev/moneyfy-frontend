import React from 'react';
import { BaseInputProps } from '@/core/types';
import { View, TouchableOpacity, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { ThemedText } from '../ui/ThemedText';
import { Ionicons } from '@expo/vector-icons';

interface Props extends BaseInputProps {
  isFocused: boolean;
  themeColors: any;
  children: React.ReactNode;
  onInputPress?: () => void;
}

export const BaseInput: React.FC<Props> = ({
  error,
  label,
  icon,
  onIconPress,
  isFocused,
  themeColors,
  children,
  onInputPress
}) => {
  return (
    <View style={styles.container}>
      {label && (
        <ThemedText style={[styles.label, { color: themeColors.accentInDarkMode }]}>
          {label}
        </ThemedText>
      )}
      <TouchableWithoutFeedback onPress={onInputPress}>
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
      </TouchableWithoutFeedback>
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