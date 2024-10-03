import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedLayout } from '@/components/ThemedLayout';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

interface ThemeOption {
  id: string;
  title: string;
  description: string;
}

export default function AppearanceScreen() {
  const themeColors = useThemeColor();
  const [selectedTheme, setSelectedTheme] = useState<string>('system');

  const themeOptions: ThemeOption[] = [
    {
      id: 'light',
      title: 'Tema claro',
      description: 'Utiliza colores claros para la interfaz de la aplicación.'
    },
    {
      id: 'dark',
      title: 'Tema oscuro',
      description: 'Utiliza colores oscuros para reducir el brillo y ahorrar batería.'
    },
    {
      id: 'system',
      title: 'Configuración del sistema',
      description: 'Sigue la configuración de tema de tu dispositivo.'
    },
  ];

  const selectTheme = (id: string) => {
    setSelectedTheme(id);
    // Aquí iría la lógica para cambiar el tema de la aplicación
    // changeAppTheme(id);
  };

  const renderThemeOption = (option: ThemeOption, index: number) => (
    <View
      key={option.id}
      style={[
        styles.optionContainer,
        {
          borderBottomWidth: index === themeOptions.length - 1 ? 0 : 0.5,
          borderColor: themeColors.borderBackgroundColor
        }
      ]}
    >
      <TouchableOpacity
        style={styles.optionContent}
        onPress={() => selectTheme(option.id)}
      >
        <View
          style={[
            styles.radioButton,
            {
              borderColor: selectedTheme === option.id
                ? themeColors.textColorAccent
                : themeColors.unfocusedBorderColor
            }
          ]}
        >
          {selectedTheme === option.id && (
            <View
              style={[
                styles.radioButtonInner,
                { backgroundColor: themeColors.textColorAccent }
              ]}
            />
          )}
        </View>
        <View style={styles.optionTextContainer}>
          <ThemedText variant="subTitle" marginBottom={4}>{option.title}</ThemedText>
          <ThemedText variant="paragraph">{option.description}</ThemedText>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <ThemedLayout padding={[0, 40]}>
      {themeOptions.map(renderThemeOption)}
    </ThemedLayout>
  );
}

const styles = StyleSheet.create({
  optionContainer: {
    paddingVertical: 16,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  optionTextContainer: {
    flex: 1,
  },
});