import React, { useState } from 'react';
import { useRouter, Href } from 'expo-router';
import { ROUTES } from '@/core/types';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useThemeColor } from '@/shared/hooks';
import { ThemedLayout, ThemedText, ConfirmationModal } from '@/shared/components';
import { useAuth, useUser } from '@/core/context';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const themeColors = useThemeColor();
  const router = useRouter();
  const { logout } = useAuth();
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  const handleLogout = () => {
    setIsLogoutModalVisible(true);
  };

  const confirmLogout = async () => {
    try {
      await logout();
      setIsLogoutModalVisible(false);
    } catch (error) {
    }
  };

  const menuItems = [
    { title: 'Información personal', icon: 'person-outline', route: ROUTES.SETTINGS.PERSONAL_INFO },
    { title: 'Configuración de pago', icon: 'card-outline', route: ROUTES.SETTINGS.PAYMENT_CONFIG },
    { title: 'Apariencia', icon: 'color-palette-outline', route: ROUTES.SETTINGS.APPEARANCE },
    { title: 'Código de referido', icon: 'ticket-outline', route: ROUTES.SETTINGS.REFERRAL_CODE },
    { title: 'Privacidad y seguridad', icon: 'lock-closed-outline', route: ROUTES.SETTINGS.PRIVACY_SECURITY },
    { title: 'Notificaciones', icon: 'notifications-outline', route: ROUTES.SETTINGS.NOTIFICATIONS },
    { title: 'Cerrar sesión', icon: 'log-out-outline', onPress: handleLogout },
  ];

  return (
    <ThemedLayout padding={[0, 40]}>
      <View style={styles.header}>
        <ThemedText variant="title" textAlign="center">Ajustes</ThemedText>
      </View>

      {menuItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.menuItem, { borderBottomWidth: index === menuItems.length - 1 ? 0 : 1, borderColor: themeColors.borderBackgroundColor }]}
          onPress={item.onPress || (() => router.push(item.route as Href))}
        >
          <Ionicons name={item.icon as any} size={20} color={themeColors.textColorAccent} />
          <ThemedText variant="subTitle" style={styles.menuItemText}>{item.title}</ThemedText>
          <Ionicons name="chevron-forward" size={16} color={themeColors.textParagraph} />
        </TouchableOpacity>
      ))}

      <View style={styles.legalLinksContainer}>
        <View style={styles.legalLinksRow}>
          <TouchableOpacity 
            onPress={() => router.push('/(legal)/terms-and-conditions')}
            style={styles.legalLink}
          >
            <ThemedText 
              variant="textLink" 
              textAlign="center"
            >
              Términos y condiciones
            </ThemedText>
          </TouchableOpacity>

          <ThemedText variant="paragraph">•</ThemedText>

          <TouchableOpacity 
            onPress={() => router.push('/(legal)/privacy-policy')}
            style={styles.legalLink}
          >
            <ThemedText 
              variant="textLink" 
              textAlign="center"
            >
              Política de privacidad
            </ThemedText>
          </TouchableOpacity>
        </View>
        <ThemedText 
          variant="paragraph" 
          textAlign="center" 
          style={styles.versionText}
        >
          Versión 1.0.0
        </ThemedText>
      </View>

      <ConfirmationModal
        isVisible={isLogoutModalVisible}
        onClose={() => setIsLogoutModalVisible(false)}
        onConfirm={confirmLogout}
        title="Cerrar sesión"
        message="¿Estás seguro de que quieres cerrar sesión?"
        confirmText="Cerrar sesión"
        cancelText="Cancelar"
      />
    </ThemedLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    paddingVertical: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingVertical: 18,
    borderBottomWidth: 0.5,
  },
  menuItemText: {
    marginLeft: 16,
    flex: 1,
  },
  legalLinksContainer: {
    marginTop: 'auto',
    paddingVertical: 24,
  },
  legalLinksRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  legalLink: {
    paddingVertical: 4,
  },
  versionText: {
    opacity: 0.5,
  }
});