import React, { useState } from 'react';
import { TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ThemedInput } from './ThemedInput';
import { useThemeColor } from '../hooks/useThemeColor';

interface ThemedDatePickerProps {
  value: Date;
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
  const [showDatePicker, setShowDatePicker] = useState(false);
  const themeColors = useThemeColor();

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  return (
    <>
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <ThemedInput
          label={label}
          value={value.toLocaleDateString()}
          onChangeText={() => {}}
          editable={false}
          placeholder={placeholder}
        />
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={value}
          mode="date"
          display="default"
          onChange={handleDateChange}
          textColor={themeColors.textColor}
        />
      )}
    </>
  );
};