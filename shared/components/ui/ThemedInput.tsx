import React, { forwardRef } from 'react';
import { TextInput } from 'react-native';
import { ThemedTextInput, PasswordInput, SelectInput, RutInput, SearchInput } from '@/shared/components';
import { ThemedInputCommonProps } from '@/core/types';

interface ThemedInputProps extends ThemedInputCommonProps {
  type?: 'text' | 'password' | 'select' | 'rut' | 'search' | 'plate';
  secureTextEntry?: boolean;
  isSelect?: boolean;
  options?: string[];
  isRUT?: boolean;
  isPlate?: boolean;
}

export const ThemedInput = forwardRef<TextInput, ThemedInputProps>(
  ({ type, secureTextEntry, isSelect, isRUT, isPlate, ...props }, ref) => {
    if (secureTextEntry) type = 'password';
    if (isSelect) type = 'select';
    if (isRUT) type = 'rut';
    if (isPlate) type = 'plate';

    switch (type) {
      case 'password':
        return <PasswordInput ref={ref} {...props} />;
      case 'select':
        return <SelectInput ref={ref} {...props} />;
      case 'rut':
        return <RutInput ref={ref} {...props} />;
      case 'search':
        return <SearchInput ref={ref} {...props} />;
      case 'plate':
        return <ThemedTextInput 
          ref={ref} 
          {...props} 
          maxLength={6}
          autoCapitalize="characters"
        />;
      default:
        return <ThemedTextInput ref={ref} {...props} />;
    }
  }
);

