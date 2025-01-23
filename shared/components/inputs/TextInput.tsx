import React, { forwardRef, useState, useRef } from 'react';
import { ThemedInputCommonProps } from '@/core/types';
import { TextInput, StyleSheet, NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import { BaseInput } from '../inputs/BaseInput';

export const ThemedTextInput = forwardRef<TextInput, ThemedInputCommonProps>(
  ({ placeholder, value, onChangeText, onBlur, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<TextInput>(null);
    const themeColors = useThemeColor();

    const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(false);
      onBlur?.(e);
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
          style={[
            styles.input, 
            { 
              color: themeColors.textColor,
            }
          ]}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          placeholderTextColor={themeColors.placeholderColor}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          {...props}
        />
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