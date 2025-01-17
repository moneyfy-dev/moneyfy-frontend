import React, { forwardRef, useState } from 'react';
import { ThemedInputCommonProps } from '@/core/types';
import { TextInput, StyleSheet, NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import { BaseInput } from '../inputs/BaseInput';

export const RutInput = forwardRef<TextInput, ThemedInputCommonProps>(
  ({ value, onChangeText, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const themeColors = useThemeColor();

    const formatRUT = (rut: string) => {
      const cleaned = rut.replace(/[^\dkK]/g, '');
      let formatted = '';
      if (cleaned.length > 1) {
        const lastChar = cleaned.slice(-1).toLowerCase();
        const rutWithoutLastChar = cleaned.slice(0, -1).replace(/[^\d]/g, '');
        formatted = rutWithoutLastChar.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '-' + lastChar;
      } else {
        formatted = cleaned;
      }
      return formatted;
    };

    const handleRUTChange = (text: string) => {
      const validValue = text.replace(/[^\dkK]/g, '');
      onChangeText(validValue);
    };

    const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(false);
      onChangeText(formatRUT(value));
      props.onBlur?.(e);
    };

    return (
      <BaseInput
        isFocused={isFocused}
        themeColors={themeColors}
        {...props}
      >
        <TextInput
          ref={ref}
          style={[
            styles.input, 
            { 
              color: themeColors.textColor,
            }
          ]}
          value={value}
          onChangeText={handleRUTChange}
          onFocus={() => setIsFocused(true)}
          autoCorrect={false}
          onBlur={handleBlur}
          placeholderTextColor={themeColors.placeholderColor}
          maxLength={12}
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
