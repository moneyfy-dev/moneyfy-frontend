import React, { forwardRef, useState } from 'react';
import { TextInput, StyleSheet, NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import { BaseInput } from './BaseInput';
import { ThemedInputCommonProps } from './types';

export const RutInput = forwardRef<TextInput, ThemedInputCommonProps>(
  ({ value, onChangeText, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const themeColors = useThemeColor();

    const formatRUT = (rut: string) => {
      const cleaned = rut.replace(/\D/g, '');
      let formatted = '';
      if (cleaned.length > 1) {
        formatted = cleaned.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '-' + cleaned.slice(-1);
      } else {
        formatted = cleaned;
      }
      return formatted;
    };

    const handleRUTChange = (text: string) => {
      const numericValue = text.replace(/\D/g, '');
      onChangeText(formatRUT(numericValue));
    };

    const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
        setIsFocused(false);
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
          value={formatRUT(value)}
          onChangeText={handleRUTChange}
          keyboardType="numeric"
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          placeholderTextColor={themeColors.placeholderColor}
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