import React, { forwardRef, useState } from 'react';
import { TextInput, StyleSheet, View, TouchableOpacity, TextInputProps } from 'react-native';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '../hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';

interface ThemedInputProps extends TextInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  error?: string;
  label?: string;
  icon?: string; // Nueva propiedad para el icono
  onIconPress?: () => void; // Nueva propiedad para manejar el press del icono
}

export const ThemedInput = forwardRef<TextInput, ThemedInputProps>(
  ({ placeholder, value, onChangeText, secureTextEntry, keyboardType, error, style, label, icon, onIconPress, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const themeColors = useThemeColor();

    const togglePasswordVisibility = () => {
      setIsPasswordVisible(!isPasswordVisible);
    };

    return (
      <View style={styles.container}>
        {label && <ThemedText style={[styles.label, { color: themeColors.accentInDarkMode }]}>{label}</ThemedText>}
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: themeColors.inputBackground,
              borderColor: isFocused ? themeColors.focusedBorderColor : themeColors.unfocusedBorderColor
            },
            style
          ]}
        >
          <TextInput
            ref={ref}
            style={[styles.input, { color: themeColors.inputColor }]}
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry && !isPasswordVisible}
            keyboardType={keyboardType}
            placeholderTextColor={themeColors.placeholderColor}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          {secureTextEntry && (
            <TouchableOpacity onPress={togglePasswordVisibility}>
              <Ionicons
                name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
                size={18}
                color={themeColors.textColorAccent}
              />
            </TouchableOpacity>
          )}
          {icon && (
            <TouchableOpacity onPress={onIconPress}>
              <Ionicons
                name={icon as any}
                size={24}
                color={themeColors.textColorAccent}
              />
            </TouchableOpacity>
          )}
        </View>
        {error ? <ThemedText style={[styles.errorText, { color: themeColors.status.error }]}>{error}</ThemedText> : null}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
  },
  errorText: {
    width: '100%',
    fontSize: 12,
    lineHeight: 16,
    marginTop: 5,
    textAlign: 'left',
  },
});