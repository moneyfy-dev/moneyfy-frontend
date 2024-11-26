import React, { forwardRef, useState } from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
  StyleProp,
  TouchableOpacity,
} from 'react-native';
import { ThemedText } from '../ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';

export interface BaseInputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onIconPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
}

export const BaseInput = forwardRef<TextInput, BaseInputProps>(
  (
    {
      label,
      error,
      icon,
      onIconPress,
      containerStyle,
      style,
      inputStyle,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const themeColors = useThemeColor();

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <ThemedText style={[styles.label, { color: themeColors.textColor }]}>
            {label}
          </ThemedText>
        )}
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: themeColors.inputBackground,
              borderColor: isFocused
                ? themeColors.focusedBorderColor
                : themeColors.unfocusedBorderColor,
            },
            style,
          ]}
        >
          <TextInput
            ref={ref}
            style={[
              styles.input,
              { color: themeColors.inputColor },
              inputStyle,
            ]}
            placeholderTextColor={themeColors.placeholderColor}
            onFocus={(e) => {
              setIsFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              onBlur?.(e);
            }}
            {...props}
          />
          {icon && (
            <TouchableOpacity onPress={onIconPress}>
              <Ionicons
                name={icon}
                size={20}
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
  }
);

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
  input: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
  },
}); 