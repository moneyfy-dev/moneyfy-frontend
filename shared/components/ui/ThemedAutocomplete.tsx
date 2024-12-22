import React, { useState, useEffect } from 'react';
import { View, TextInput, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useThemeColor } from '@/shared/hooks';
import { ThemedText } from '../ui/ThemedText';
import { Ionicons } from '@expo/vector-icons';

interface ThemedAutocompleteProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  onSelect: (item: string) => void;
  options: string[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  zIndex?: number;
}

export const ThemedAutocomplete = ({
  label,
  value,
  onChangeText,
  onSelect,
  options,
  placeholder = '',
  error,
  disabled = false,
  zIndex = 1
}: ThemedAutocompleteProps) => {
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const [showOptions, setShowOptions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const themeColors = useThemeColor();

  useEffect(() => {
    if (value.length > 0) {
      const filtered = options.filter(option =>
        option.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(options);
    }
  }, [value, options]);

  const handleInputChange = (text: string) => {
    if (!disabled) {
      onChangeText(text);
      setShowOptions(true);
    }
  };

  const handleSelect = (item: string) => {
    if (!disabled) {
      onSelect(item);
      onChangeText(item);
      setShowOptions(false);
    }
  };

  return (
    <View style={[styles.container, { zIndex }]}>
      {label && (
        <ThemedText style={[styles.label, { color: themeColors.accentInDarkMode }]}>
          {label}
        </ThemedText>
      )}
      
      <View style={styles.dropdownContainer}>
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: themeColors.inputBackground,
              borderColor: isFocused ? themeColors.focusedBorderColor : themeColors.unfocusedBorderColor
            },
            disabled && styles.inputContainerDisabled
          ]}
        >
          <TextInput
            style={[
              styles.input,
              { color: disabled ? themeColors.disabledColor : themeColors.inputColor }
            ]}
            value={value}
            onChangeText={handleInputChange}
            placeholder={placeholder}
            placeholderTextColor={disabled ? themeColors.disabledColor : themeColors.placeholderColor}
            onFocus={() => {
              if (!disabled) {
                setIsFocused(true);
                setShowOptions(true);
              }
            }}
            editable={!disabled}
          />
          <TouchableOpacity 
            onPress={() => !disabled && setShowOptions(!showOptions)}
            disabled={disabled}
          >
            <Ionicons
              name={showOptions ? "chevron-up-outline" : "chevron-down-outline"}
              size={18}
              color={disabled ? themeColors.disabledColor : themeColors.textColorAccent}
            />
          </TouchableOpacity>
        </View>

        {showOptions && filteredOptions.length > 0 && (
          <View style={[
            styles.optionsContainer,
            { backgroundColor: themeColors.backgroundColor }
          ]}>
            <ScrollView 
              nestedScrollEnabled={true}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.optionsScrollContent}
            >
              {filteredOptions.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.option,
                    { 
                      borderBottomColor: themeColors.borderBackgroundColor,
                      borderBottomWidth: index === filteredOptions.length - 1 ? 0 : 1 
                    }
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <ThemedText>{item}</ThemedText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      {error && (
        <ThemedText style={[styles.errorText, { color: themeColors.status.error }]}>
          {error}
        </ThemedText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  dropdownContainer: {
    position: 'relative',
    zIndex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  input: {
    flex: 1,
    height: '100%',
  },
  inputContainerDisabled: {
    opacity: 0.5,
    backgroundColor: 'transparent',
  },
  optionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    maxHeight: 200,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  optionsScrollContent: {
    flexGrow: 1,
  },
  option: {
    padding: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
}); 