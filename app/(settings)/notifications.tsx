import React, { useState, useEffect } from 'react';
import { NotificationSetting, NotificationPreferences } from '@/core/types';
import { View, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useThemeColor } from '@/shared/hooks';
import { ThemedLayout, ThemedText } from '@/shared/components';
import { useUser } from '@/core/context';
import { Ionicons } from '@expo/vector-icons';

export default function NotificationsScreen() {
  const themeColors = useThemeColor();
  const { user, updateUserData } = useUser();
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    { id: 'byEmail', title: 'Notificaciones por correo', description: 'Recibe actualizaciones importantes, resúmenes y promociones directamente en tu correo electrónico.', isEnabled: false, type: 'switch' },
    { id: 'byPush', title: 'Notificaciones push', description: 'Desactiva las alertas en tu dispositivo móvil, pero aún podrás consultar tus notificaciones dentro de la aplicación.', isEnabled: true, type: 'switch' },
    { id: 'commissionUpdate', title: 'Actualización de comisiones', description: 'Recibe una notificación cada vez que una nueva comisión sea generada por tus referidos.', isEnabled: true, type: 'checkbox' },
    { id: 'saleState', title: 'Cambio de estado en ventas', description: 'Mantente al tanto del estado de tus ventas y las de tus referidos. Recibirás una notificación cuando se apruebe, rechace o modifique una venta.', isEnabled: false, type: 'checkbox' },
    { id: 'withdrawalAvailability', title: 'Disponibilidad de fondos para retiro', description: 'Te avisaremos cuando el saldo de tus comisiones esté listo para ser retirado o utilizado.', isEnabled: false, type: 'checkbox' },
    { id: 'referredAccepted', title: 'Invitaciones de referidos aceptadas', description: 'Recibe una notificación cuando alguien se registre usando tu código de referido.', isEnabled: false, type: 'checkbox' },
    { id: 'specialOffers', title: 'Ofertas y promociones especiales', description: 'Mantente informado sobre descuentos y promociones en seguros para ti y tus referidos.', isEnabled: false, type: 'checkbox' },
    { id: 'paymentProblems', title: 'Problemas con el pago', description: 'Te notificaremos si surge algún problema con el procesamiento de un pago por parte de tus referidos.', isEnabled: false, type: 'checkbox' },
  ]);

  useEffect(() => {
    if (user && user.notifPreference) {
      setNotificationSettings(prevSettings =>
        prevSettings.map(setting => ({
          ...setting,
          isEnabled: user.notifPreference[setting.id] ?? setting.isEnabled
        }))
      );
    }
  }, [user]);

  const toggleSetting = async (id: keyof NotificationPreferences) => {
    setNotificationSettings(prevSettings =>
      prevSettings.map(setting =>
        setting.id === id ? { ...setting, isEnabled: !setting.isEnabled } : setting
      )
    );
  };

  const renderSetting = (setting: NotificationSetting, index: number) => (
    <View key={setting.id} style={[styles.settingContainer, { borderBottomWidth: index === notificationSettings.length - 1 ? 0 : 0.5, borderColor: themeColors.borderBackgroundColor }]}>
      <View style={styles.settingTextContainer}>
        <ThemedText variant="subTitle" marginBottom={4}>{setting.title}</ThemedText>
        <ThemedText variant="paragraph">{setting.description}</ThemedText>
      </View>
      {setting.type === 'switch' ? (  
        <Switch
          trackColor={{ false: themeColors.extremeContrastGray, true: themeColors.textColorAccent }}
          thumbColor={setting.isEnabled ? themeColors.extremeContrastGray : themeColors.textColorAccent}
          ios_backgroundColor={themeColors.extremeContrastGray}
          onValueChange={() => toggleSetting(setting.id)}
          value={setting.isEnabled}
        />
      ) : (
        <TouchableOpacity
          onPress={() => toggleSetting(setting.id)}
        >
          <Ionicons
            name={setting.isEnabled ? "checkbox-outline" : "square-outline"}
            size={24}
            color={setting.isEnabled ? themeColors.textColorAccent : themeColors.unfocusedBorderColor}
          />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <ThemedLayout padding={[0, 40]}>
      {notificationSettings.map(renderSetting)}
    </ThemedLayout>
  );
}

const styles = StyleSheet.create({
  settingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 24,
    marginBottom: 24,
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 16,
  }
});
