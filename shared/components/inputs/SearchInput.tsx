import React, { forwardRef, useState } from 'react';
import { ThemedInputCommonProps } from '@/core/types';
import { TextInput, StyleSheet, type TextInputProps } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import { BaseInput } from '../inputs/BaseInput';

export const SearchInput = forwardRef<TextInput, ThemedInputCommonProps>(
  ({ value, onChangeText, onIconPress, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const themeColors = useThemeColor();

    const handleBlur: NonNullable<TextInputProps['onBlur']> = (event) => {
      setIsFocused(false);
      props.onBlur?.(event);
    };

    return (
      <BaseInput
        isFocused={isFocused}
        themeColors={themeColors}
        icon="search"
        onIconPress={onIconPress}
        {...props}
      >
        <TextInput
          ref={ref}
          style={[styles.input, { color: themeColors.inputColor }]}
          value={value}
          onChangeText={onChangeText}
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
