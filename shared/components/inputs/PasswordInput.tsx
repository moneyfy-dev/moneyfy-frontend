import React, { forwardRef, useState, useRef } from 'react';
import { ThemedInputCommonProps } from '@/core/types';
import { TextInput, TouchableOpacity, StyleSheet, NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import { BaseInput } from '../inputs/BaseInput';
import { Ionicons } from '@expo/vector-icons';

export const PasswordInput = forwardRef<TextInput, ThemedInputCommonProps>(
  (props, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const inputRef = useRef<TextInput>(null);
    const themeColors = useThemeColor();

    const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(false);
      props.onBlur?.(e);
    };

    const handleInputPress = () => {
      inputRef.current?.focus();
    };

    return (
      <BaseInput
        isFocused={isFocused}
        themeColors={themeColors}
        onInputPress={handleInputPress}
        {...props}
      >
        <TextInput
          ref={(input) => {
            // Mantener ambas referencias
            inputRef.current = input;
            if (typeof ref === 'function') {
              ref(input);
            } else if (ref) {
              ref.current = input;
            }
          }}
          style={[styles.input, { color: themeColors.inputColor }]}
          secureTextEntry={!isPasswordVisible}
          placeholderTextColor={themeColors.placeholderColor}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          {...props}
        />
        <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
          <Ionicons
            name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
            size={18}
            color={themeColors.textColorAccent}
          />
        </TouchableOpacity>
      </BaseInput>
    );
  }
);

const styles = StyleSheet.create({
    input: {
      flex: 1,
      height: 48,
      paddingVertical: 0,
    }
  });