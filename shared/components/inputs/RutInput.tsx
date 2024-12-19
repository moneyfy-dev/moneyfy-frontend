import React, { forwardRef, useState } from 'react';
import { ThemedInputCommonProps } from '@/core/types';
import { TextInput, StyleSheet, NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';
import { useThemeColor } from '@/shared/hooks';
import { BaseInput } from '@/shared/components';

export const RutInput = forwardRef<TextInput, ThemedInputCommonProps>(
  ({ value, onChangeText, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const themeColors = useThemeColor();

    const formatRUT = (rut: string) => {
      const cleaned = rut.replace(/\D/g, '');
      let formatted = '';
      if (cleaned.length > 1) {
        let lastChar = cleaned.slice(-1).toLowerCase();
        let rutWithoutLastChar = cleaned.slice(0, -1);
        formatted = rutWithoutLastChar.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '-' + lastChar;
      } else {
        formatted = cleaned;
      }
      return formatted;
    };

    const handleRUTChange = (text: string) => {
      const numericValue = text.replace(/\D/g, '');
      onChangeText(numericValue);
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
