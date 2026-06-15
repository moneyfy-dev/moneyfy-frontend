import React, { forwardRef, useState } from 'react';
import { ThemedInputCommonProps } from '@/core/types';
import { TextInput, StyleSheet, type TextInputProps } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import { BaseInput } from '../inputs/BaseInput';
import { cleanRUT, formatRUT } from '@/shared/utils/validations';

export const RutInput = forwardRef<TextInput, ThemedInputCommonProps>(
  ({ value, onChangeText, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const themeColors = useThemeColor();

    const handleRUTChange = (text: string) => {
      const cleaned = cleanRUT(text);
      onChangeText(cleaned.length >= 8 ? formatRUT(cleaned) : cleaned);
    };

    const handleBlur: NonNullable<TextInputProps['onBlur']> = (event) => {
      setIsFocused(false);
      onChangeText(formatRUT(value));
      props.onBlur?.(event);
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
