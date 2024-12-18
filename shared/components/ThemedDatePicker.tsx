import React, { useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { ThemedInput } from './ThemedInput';
import { useThemeColor } from '@/shared/hooks/useThemeColor';
import { useTheme } from '@/core/context/ThemeContext';

interface ThemedDatePickerProps {
  value: Date | null;
  onChange: (date: Date) => void;
  label?: string;
  placeholder?: string;
}

export const ThemedDatePicker: React.FC<ThemedDatePickerProps> = ({
  value,
  onChange,
  label,
  placeholder = 'Seleccione una fecha'
}) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const themeColors = useThemeColor();
  const { currentTheme } = useTheme();

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    onChange(date);
    hideDatePicker();
  };

  return (
    <View style={styles.container}>
      <ThemedInput
        label={label}
        value={value ? value.toLocaleDateString() : ''}
        onChangeText={() => {}}
        editable={false}
        placeholder={placeholder}
        icon="calendar-outline"
        onIconPress={showDatePicker}
      />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        date={value || new Date()}
        // Configuración común para iOS y Android
        isDarkModeEnabled={currentTheme === 'dark'}
        themeVariant={currentTheme === 'dark' ? 'dark' : 'light'}
        accentColor={themeColors.buttonBackgroundColor}
        textColor={themeColors.textColor}
        // Configuración específica para iOS
        buttonTextColorIOS={themeColors.buttonBackgroundColor}
        cancelTextIOS="Cancelar"
        confirmTextIOS="Confirmar"
        modalStyleIOS={{
          backgroundColor: themeColors.backgroundCardColor,
        }}
        pickerContainerStyleIOS={{
          backgroundColor: themeColors.backgroundCardColor,
        }}
        // Configuración específica para Android
        {...(Platform.OS === 'android' && {
          display: 'default', // o 'spinner'
          
          positiveButton: { label: 'OK', textColor: themeColors.buttonBackgroundColor },
          negativeButton: { label: 'Cancelar', textColor: themeColors.buttonBackgroundColor },
        })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
});