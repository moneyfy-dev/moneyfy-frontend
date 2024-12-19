import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedLayout } from '@/shared/components/layouts/ThemedLayout';
import { ThemedText } from '@/shared/components/ui/ThemedText';
import { useThemeColor } from '@/shared/hooks/useThemeColor';
import { useTheme } from '@/core/context/ThemeContext';

interface ThemeOption {
  id: 'light' | 'dark' | 'system';
  title: string;
  description: string;
}

export default function AppearanceScreen() {
  const themeColors = useThemeColor();
  const { themeMode, setThemeMode, currentTheme } = useTheme();

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

  const selectTheme = (id: 'light' | 'dark' | 'system') => {
    setThemeMode(id);
  };

  useEffect(() => {
    console.log('Current theme mode:', themeMode);
    console.log('Current theme:', currentTheme);
  }, [themeMode, currentTheme]);

  const renderThemeOption = (option: ThemeOption, index: number) => (
    <TouchableOpacity
      key={option.id}
      style={[
        styles.optionContainer,
        {
          borderBottomWidth: index === themeOptions.length - 1 ? 0 : 0.5,
          borderColor: themeColors.borderBackgroundColor
        }
      ]}
      onPress={() => selectTheme(option.id)}
    >
      <View style={styles.optionContent}>
        <View
          style={[
            styles.radioButton,
            {
              borderColor: themeMode === option.id
                ? themeColors.textColorAccent
                : themeColors.unfocusedBorderColor
            }
          ]}
        >
          {themeMode === option.id && (
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
      </View>
    </TouchableOpacity>
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
  debugText: {
    marginTop: 20,
  },
});