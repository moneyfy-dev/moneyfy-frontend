import React, { useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '../hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { ThemedInput } from './ThemedInput';

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
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const themeColors = useThemeColor();

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (day: any) => {
    const selectedDate = new Date(day.timestamp);
    onChange(selectedDate);
    hideDatePicker();
  };

  const styles = StyleSheet.create({
    container: {
      marginBottom: 20,
      width: '100%',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
    },
    input: {
      flex: 1,
    },
    icon: {
      position: 'absolute',
      right: 10,
      top: '50%',
      transform: [{ translateY: -12 }],
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    calendarContainer: {
      backgroundColor: themeColors.backgroundCardColor,
      borderRadius: 10,
      overflow: 'hidden',
      width: '90%',
    },
    header: {
      backgroundColor: themeColors.backgroundCardColor,
      padding: 15,
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: themeColors.borderColor,
    },
    headerText: {
      color: themeColors.textColorAccent,
      fontSize: 18,
      fontWeight: 'bold',
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 10,
      backgroundColor: themeColors.backgroundCardColor,
      borderTopWidth: 1,
      borderTopColor: themeColors.borderColor,
    },
    button: {
      padding: 10,
    },
    buttonText: {
      color: themeColors.textColorAccent,
      fontSize: 16,
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={showDatePicker} style={styles.inputContainer}>
        <ThemedInput
          label={label}
          value={value ? value.toLocaleDateString() : ''}
          onChangeText={() => {}}
          editable={false}
          placeholder={placeholder}
          style={styles.input}
        />
        <Ionicons name="calendar" size={24} color={themeColors.textColorAccent} style={styles.icon} />
      </TouchableOpacity>
      <Modal
        transparent={true}
        visible={isDatePickerVisible}
        onRequestClose={hideDatePicker}
      >
        <View style={styles.modalContainer}>
          <View style={styles.calendarContainer}>
            <View style={styles.header}>
              <ThemedText style={styles.headerText}>{label || "Seleccione una fecha"}</ThemedText>
            </View>
            <Calendar
              onDayPress={handleConfirm}
              markedDates={{
                [value.toISOString().split('T')[0]]: {selected: true, selectedColor: themeColors.buttonBackgroundColor}
              }}
              theme={{
                backgroundColor: themeColors.backgroundCardColor,
                calendarBackground: themeColors.backgroundCardColor,
                textSectionTitleColor: themeColors.textColorAccent,
                selectedDayBackgroundColor: themeColors.buttonBackgroundColor,
                selectedDayTextColor: themeColors.buttonTextColor,
                todayTextColor: themeColors.textColorAccent,
                dayTextColor: themeColors.textColor,
                textDisabledColor: themeColors.textColorSecondary,
                monthTextColor: themeColors.textColorAccent,
              }}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={hideDatePicker} style={styles.button}>
                <ThemedText style={styles.buttonText}>Cancelar</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};