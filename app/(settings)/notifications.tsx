import React, { useState } from 'react';
import { View, StyleSheet, Switch, TouchableOpacity, Alert } from 'react-native';
import { ThemedLayout } from '@/components/ThemedLayout';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { updateNotificationSetting } from '@/services/notificationService';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  isEnabled: boolean;
  type: 'switch' | 'checkbox';
}

export default function NotificationsScreen() {
  const themeColors = useThemeColor();
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
        { id: 'email', title: 'Notificaciones por correo', description: 'Recibe actualizaciones importantes, resúmenes y promociones directamente en tu correo electrónico.', isEnabled: false, type: 'switch' },
        { id: 'push', title: 'Notificaciones push', description: 'Desactiva las alertas en tu dispositivo móvil, pero aún podrás consultar tus notificaciones dentro de la aplicación.', isEnabled: true, type: 'switch' },
        { id: 'commissions', title: 'Actualización de comisiones', description: 'Recibe una notificación cada vez que una nueva comisión sea generada por tus referidos.', isEnabled: true, type: 'checkbox' },
        { id: 'salesStatus', title: 'Cambio de estado en ventas', description: 'Mantente al tanto del estado de tus ventas y las de tus referidos. Recibirás una notificación cuando se apruebe, rechace o modifique una venta.', isEnabled: false, type: 'checkbox' },
        { id: 'fundsAvailable', title: 'Disponibilidad de fondos para retiro', description: 'Te avisaremos cuando el saldo de tus comisiones esté listo para ser retirado o utilizado.', isEnabled: false, type: 'checkbox' },
        { id: 'newSale', title: 'Nueva venta realizada por un referido', description: 'Recibe una alerta cuando uno de tus referidos directos o indirectos concrete una nueva venta.', isEnabled: false, type: 'checkbox' },
        { id: 'insuranceUpdates', title: 'Actualizaciones en el cotizador de seguros', description: 'Serás notificado si se añaden nuevos seguros o si se ajustan los planes disponibles en el cotizador.', isEnabled: false, type: 'checkbox' },
        { id: 'referralInvitations', title: 'Invitaciones de referidos aceptadas', description: 'Recibe una notificación cuando alguien se registre usando tu código de referido.', isEnabled: false, type: 'checkbox' },
        { id: 'withdrawalReminders', title: 'Recordatorios de retiro de fondos', description: 'Recibirás un recordatorio si tienes fondos disponibles para retiro y aún no los has retirado.', isEnabled: false, type: 'checkbox' },
        { id: 'specialOffers', title: 'Ofertas y promociones especiales', description: 'Mantente informado sobre descuentos y promociones en seguros para ti y tus referidos.', isEnabled: false, type: 'checkbox' },
        { id: 'paymentIssues', title: 'Problemas con el pago', description: 'Te notificaremos si surge algún problema con el procesamiento de un pago por parte de tus referidos.', isEnabled: false, type: 'checkbox' },
  ]);

  const toggleSetting = async (id: string) => {
    try {
      const updatedSettings = notificationSettings.map(setting => {
        if (setting.id === id) {
          return { ...setting, isEnabled: !setting.isEnabled };
        }
        return setting;
      });

      setNotificationSettings(updatedSettings);

      const updatedSetting = updatedSettings.find(setting => setting.id === id);
      if (updatedSetting) {
        await updateNotificationSetting(id, updatedSetting.isEnabled);
      }
    } catch (error) {
      console.error('Error al actualizar configuración de notificación:', error);
      Alert.alert('Error', 'No se pudo actualizar la configuración de notificación');
      // Revertir el cambio en caso de error
      setNotificationSettings(prevSettings => prevSettings.map(setting => 
        setting.id === id ? { ...setting, isEnabled: !setting.isEnabled } : setting
      ));
    }
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
        <TouchableOpacity onPress={() => toggleSetting(setting.id)}>
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

