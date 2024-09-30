import React from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

const PrivacySecurityScreen = () => {
  const themeColors = useThemeColor();

  const settingsOptions = [
    { title: 'Notificaciones por correo', description: 'Recibe actualizaciones importantes, resúmenes y promociones directamente en tu correo electrónico.', type: 'switch' },
    { title: 'Notificaciones push', description: 'Desactiva las alertas en tu dispositivo móvil, pero aún podrás consultar tus notificaciones dentro de la aplicación.', type: 'switch' },
    { title: 'Actualización de comisiones', description: 'Recibe una notificación cada vez que una nueva comisión sea generada por tus referidos.', type: 'checkbox' },
    // ... Añade el resto de las opciones aquí
  ];

  return (
    <ScrollView style={[styles.container, { backgroundColor: themeColors.backgroundColor }]}>
      <Text style={[styles.description, { color: themeColors.textParagraph }]}>
        Configura tus opciones de seguridad
      </Text>
      {settingsOptions.map((option, index) => (
        <View key={index} style={styles.optionContainer}>
          <View style={styles.optionTextContainer}>
            <Text style={[styles.optionTitle, { color: themeColors.textColor }]}>{option.title}</Text>
            <Text style={[styles.optionDescription, { color: themeColors.textParagraph }]}>{option.description}</Text>
          </View>
          {option.type === 'switch' ? (
            <Switch
              trackColor={{ false: themeColors.disabledColor, true: themeColors.textColorAccent }}
              thumbColor={themeColors.backgroundColor}
            />
          ) : (
            <View style={[styles.checkbox, { borderColor: themeColors.textColorAccent }]}>
              {/* Aquí puedes añadir lógica para mostrar el check */}
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  optionTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  optionDescription: {
    fontSize: 14,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 4,
  },
});

export default PrivacySecurityScreen;