import React, { forwardRef, useState, useEffect } from 'react';
import { TextInput, StyleSheet, View, TouchableOpacity, TextInputProps, Modal, FlatList } from 'react-native';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '../hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { ThemedButton } from './ThemedButton';

interface ThemedInputProps extends TextInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  error?: string;
  label?: string;
  icon?: string;
  onIconPress?: () => void;
  onBlur?: () => void;
  isSelect?: boolean;
  options?: string[];
  isRUT?: boolean; // Nueva prop para identificar inputs de RUT
}

export const ThemedInput = forwardRef<TextInput, ThemedInputProps>(
  ({ placeholder, value, onChangeText, secureTextEntry, keyboardType, error, style, label, icon, onIconPress, onBlur, isSelect, options, isRUT, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [formattedValue, setFormattedValue] = useState('');
    const themeColors = useThemeColor();

    useEffect(() => {
      if (isRUT) {
        setFormattedValue(formatRUT(value));
      } else {
        setFormattedValue(value);
      }
    }, [value, isRUT]);

    const formatRUT = (rut: string) => {
      // Eliminar todos los caracteres no numéricos
      const cleaned = rut.replace(/\D/g, '');

      // Aplicar el formato
      let formatted = '';
      if (cleaned.length > 1) {
        formatted = cleaned.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '-' + cleaned.slice(-1);
      } else {
        formatted = cleaned;
      }

      return formatted;
    };

    const handleRUTChange = (text: string) => {
      // Eliminar todos los caracteres no numéricos
      const numericValue = text.replace(/\D/g, '');
      onChangeText(formatRUT(numericValue));
    };

    const togglePasswordVisibility = () => {
      setIsPasswordVisible(!isPasswordVisible);
    };

    const handleSelectOption = (option: string) => {
      onChangeText(option);
      setIsModalVisible(false);
    };

    const renderSelectInput = () => (
      <TouchableOpacity
      style={[
        styles.input,
        { height: 48 }, // Asegurar altura consistente
        { justifyContent: 'center' } // Centrar contenido verticalmente
      ]}
        onPress={() => setIsModalVisible(true)}
      >
        <ThemedText style={{ color: themeColors.inputColor }}>
          {value || placeholder}
        </ThemedText>
      </TouchableOpacity>
    );

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
          {isSelect ? renderSelectInput() : (
            <TextInput
              ref={ref}
              style={[styles.input, { color: themeColors.inputColor }]}
              placeholder={placeholder}
              value={formattedValue}
              onChangeText={isRUT ? handleRUTChange : onChangeText}
              secureTextEntry={secureTextEntry && !isPasswordVisible}
              keyboardType={isRUT ? 'numeric' : keyboardType}
              placeholderTextColor={themeColors.placeholderColor}
              onFocus={() => setIsFocused(true)}
              onBlur={() => {
                setIsFocused(false);
                onBlur && onBlur();
              }}
              {...props}
            />
          )}
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
                size={18}
                color={themeColors.textColorAccent}
              />
            </TouchableOpacity>
          )}
          {isSelect && (
            <TouchableOpacity onPress={() => setIsModalVisible(true)}>
              <Ionicons
                name="chevron-down-outline"
                size={18}
                color={themeColors.textColorAccent}
              />
            </TouchableOpacity>
          )}
        </View>
        {error ? <ThemedText style={[styles.errorText, { color: themeColors.status.error }]}>{error}</ThemedText> : null}
        <Modal
          visible={isModalVisible}
          transparent={true}
          animationType="slide"
        >
          <View style={[styles.modalContainer, { backgroundColor: themeColors.backgroundColor }]}>
            <FlatList
              style={{ width: '100%' }}
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.optionItem, { borderBottomColor: themeColors.borderBackgroundColor }]}
                  onPress={() => handleSelectOption(item)}
                >
                  <ThemedText>{item}</ThemedText>
                </TouchableOpacity>
              )}
            />
            <ThemedButton
              text="Cerrar"
              onPress={() => setIsModalVisible(false)}
              style={styles.closeButton}
            />
          </View>
        </Modal>
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
    height: 48,
    paddingVertical: 0,
  },
  errorText: {
    width: '100%',
    fontSize: 12,
    lineHeight: 16,
    marginTop: 5,
    textAlign: 'left',
  },
  modalContainer: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  optionItem: {
    padding: 15,
    borderBottomWidth: 1,
    width: '100%',
  },
  closeButton: {
    marginTop: 20,
  },
});
