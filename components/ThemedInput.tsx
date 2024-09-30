import React, { useState } from 'react';
import { TextInput, StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '../hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';

interface ThemedInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  error?: string;
}

export function ThemedInput({ placeholder, value, onChangeText, secureTextEntry, keyboardType, error }: ThemedInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const themeColors = useThemeColor();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View>
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: themeColors.inputBackground,
            borderColor: isFocused ? themeColors.focusedBorderColor : themeColors.unfocusedBorderColor
          }
        ]}
      >
        <TextInput
          style={[styles.input, { color: themeColors.inputColor }]}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          placeholderTextColor={themeColors.placeholderColor}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
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
      </View>
      {error ? <ThemedText style={[styles.errorText, { color: themeColors.status.error }]}>{error}</ThemedText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 16,
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