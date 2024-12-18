import React, { forwardRef, useState } from 'react';
import { TextInput, StyleSheet, NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';
import { useThemeColor } from '@/shared/hooks/useThemeColor';
import { BaseInput } from './BaseInput';
import { ThemedInputCommonProps } from '@/core/types/Input';

export const ThemedTextInput = forwardRef<TextInput, ThemedInputCommonProps>(
  ({ placeholder, value, onChangeText, onBlur, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const themeColors = useThemeColor();

    const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(false);
      onBlur?.(e);
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