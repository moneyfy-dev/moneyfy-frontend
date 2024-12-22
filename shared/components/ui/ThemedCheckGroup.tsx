import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { ThemedText } from '../ui/ThemedText';
import { useThemeColor } from '@/shared/hooks';

interface CheckOption {
  key: string;
  label: string;
}

interface ThemedCheckGroupProps {
  options: CheckOption[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  containerStyle?: any;
  optionStyle?: any;
}

export const ThemedCheckGroup: React.FC<ThemedCheckGroupProps> = ({
  options,
  selectedValue,
  onSelect,
  containerStyle,
  optionStyle
}) => {
  const themeColors = useThemeColor();

  return (
    <View style={[styles.container, containerStyle]}>
      {options.map(({ key, label }) => (
        <Pressable
          key={key}
          style={[
            styles.option,
            { backgroundColor: themeColors.extremeContrastGray, borderColor: themeColors.extremeContrastGray },
            selectedValue === key && { backgroundColor: themeColors.buttonBackgroundColor, borderColor: themeColors.buttonBackgroundColor },
            optionStyle
          ]}
          onPress={() => onSelect(key)}
        >
          <ThemedText
            variant="notes"
            textAlign="center"
            color={selectedValue === key ? themeColors.backgroundColor : themeColors.textColorAccent}
            numberOfLines={1}
          >
            {label}
          </ThemedText>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    width: '100%',
  },
  option: {
    width: '30%', // Aproximadamente un tercio menos el espacio para los gaps
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 50,
    borderWidth: 1,
  },
}); 