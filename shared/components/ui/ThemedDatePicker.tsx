import React, { useState } from 'react';
import { useTheme } from '@/core/context';
import { View, StyleSheet, Platform } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import { ThemedInput } from '../ui/ThemedInput';
import DateTimePickerModal from "react-native-modal-datetime-picker";

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