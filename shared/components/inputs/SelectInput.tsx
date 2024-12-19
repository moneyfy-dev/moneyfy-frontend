import React, { forwardRef, useState } from 'react';
import { View, TouchableOpacity, Modal, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/shared/hooks/useThemeColor';
import { BaseInput } from './BaseInput';
import { ThemedText } from '../ui/ThemedText';
import { ThemedButton } from '../ui/ThemedButton';
import { SelectInputProps } from '@/core/types/Input';

export const SelectInput = forwardRef<any, SelectInputProps>(
  ({ value, onChangeText, placeholder, options = [], ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const themeColors = useThemeColor();

    const handleSelectOption = (option: string) => {
      onChangeText(option);
      setIsModalVisible(false);
    };

    return (
      <>
        <BaseInput
          isFocused={isFocused}
          themeColors={themeColors}
          {...props}
        >
          <TouchableOpacity
            style={[styles.input, { height: 48, justifyContent: 'center' }]}
            onPress={() => setIsModalVisible(true)}
          >
            <ThemedText style={{ color: themeColors.inputColor }}>
              {value || placeholder}
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsModalVisible(true)}>
            <Ionicons
              name="chevron-down-outline"
              size={18}
              color={themeColors.textColorAccent}
            />
          </TouchableOpacity>
        </BaseInput>

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
      </>
    );
  }
);

const styles = StyleSheet.create({
    input: {
      flex: 1,
      height: 48,
      paddingVertical: 0,
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