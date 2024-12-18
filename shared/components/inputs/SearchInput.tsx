import React, { forwardRef, useState } from 'react';
import { TextInput, StyleSheet, NativeSyntheticEvent, TextInputFocusEventData } from 'react-native';
import { useThemeColor } from '@/shared/hooks/useThemeColor';
import { BaseInput } from './BaseInput';
import { ThemedInputCommonProps } from '@/core/types/Input';

export const SearchInput = forwardRef<TextInput, ThemedInputCommonProps>(
  ({ value, onChangeText, onIconPress, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const themeColors = useThemeColor();

    const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(false);
      props.onBlur?.(e);
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