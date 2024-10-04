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
  const { logout, userEmail } = useAuth();
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  const handleLogout = () => {
    setIsLogoutModalVisible(true);
  };

  const confirmLogout = async () => {
    try {
      await logout();
      setIsLogoutModalVisible(false);
      router.replace('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const menuItems = [
    { title: 'Información personal', icon: 'person-outline', route: '/(settings)/personal-info' as Href<string> },
    { title: 'Configuración de pago', icon: 'card-outline', route: '/(settings)/payment-config' as Href<string> },
    { title: 'Apariencia', icon: 'color-palette-outline', route: '/(settings)/appearance' as Href<string> },
    { title: 'Código de referido', icon: 'qr-code-outline', route: '/(settings)/referral-code' as Href<string> },
    { title: 'Privacidad y seguridad', icon: 'lock-closed-outline', route: '/(settings)/privacy-security' as Href<string> },
    { title: 'Notificaciones', icon: 'notifications-outline', route: '/(settings)/notifications' as Href<string> },
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
          onPress={item.onPress || (() => router.push(item.route))}
        >
          <Ionicons name={item.icon as any} size={20} color={themeColors.textColorAccent} />
          <ThemedText variant="subTitle" style={styles.menuItemText}>{item.title}</ThemedText>
          <Ionicons name="chevron-forward" size={16} color={themeColors.textParagraph} />
        </TouchableOpacity>
      ))}

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
});

export default ConfigScreen;