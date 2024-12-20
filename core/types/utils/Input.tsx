import { TextInputProps } from 'react-native';

export interface BaseInputProps {
  error?: string;
  label?: string;
  icon?: string;
  onIconPress?: () => void;
  style?: any;
}

export interface ThemedInputCommonProps extends TextInputProps {
  error?: string;
  label?: string;
  icon?: string;
  onIconPress?: () => void;
  style?: any;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
}

export interface SelectInputProps extends ThemedInputCommonProps {
  options?: string[];
}

export type InputType = 'text' | 'password' | 'select' | 'rut' | 'search';