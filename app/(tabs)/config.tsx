import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Href } from 'expo-router';
import { LogoutModal } from '@/components/LogoutModal';
import { useAuth } from '@/context/AuthContext';
import { AvatarIcon } from '@/components/images/AvatarIcon';
import { ThemedLayout } from '@/components/ThemedLayout';
import { ThemedText } from '@/components/ThemedText';
const ConfigScreen = () => {
  const themeColors = useThemeColor();
  const router = useRouter();
  const { logout, user } = useAuth(); // Cambiamos userEmail por user
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  const handleLogout = () => {
    setIsLogoutModalVisible(true);
  };

  const confirmLogout = async () => {
    try {
      console.log('Iniciando logout');
      await logout();
      console.log('Logout completado en ConfigScreen');
      setIsLogoutModalVisible(false);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const menuItems = [
    { title: 'Información personal', icon: 'person-outline', route: '/(settings)/personal-info' },
    { title: 'Configuración de pago', icon: 'card-outline', route: '/(settings)/payment-config' },
    { title: 'Apariencia', icon: 'color-palette-outline', route: '/(settings)/appearance' },
    { title: 'Código de referido', icon: 'ticket-outline', route: '/(settings)/referral-code' },
    { title: 'Privacidad y seguridad', icon: 'lock-closed-outline', route: '/(settings)/privacy-security' },
    { title: 'Notificaciones', icon: 'notifications-outline', route: '/(settings)/notifications' },
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

      <LogoutModal
        isVisible={isLogoutModalVisible}
        onClose={() => setIsLogoutModalVisible(false)}
        onLogout={confirmLogout}
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
    paddingHorizontal: 16,
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

export default ConfigScreen;