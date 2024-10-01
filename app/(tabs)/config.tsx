import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Href } from 'expo-router';
import { LogoutModal } from '@/components/LogoutModal';
import { useAuth } from '@/context/AuthContext';
import { AvatarIcon } from '@/components/images/AvatarIcon';

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
    <View style={[styles.container, { backgroundColor: themeColors.backgroundColor }]}>
      <Text style={[styles.title, { color: themeColors.textColor }]}>Ajustes</Text>

      <View style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          <AvatarIcon width={80} height={80} style={styles.profileImage} />
          <TouchableOpacity style={[styles.editButton, { backgroundColor: themeColors.buttonBackgroundColor }]}>
            <Ionicons name="pencil" size={10} color={themeColors.white} />
          </TouchableOpacity>
        </View>
        <View>
          <Text style={[styles.name, { color: themeColors.textColor }]}>Alejandro Osses</Text>
          <Text style={[styles.email, { color: themeColors.textParagraph }]}>{userEmail || 'No email'}</Text>
        </View>
      </View>

      {menuItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.menuItem, { borderBottomColor: themeColors.unfocusedBorderColor }]}
          onPress={item.onPress || (() => router.push(item.route))}
        >
          <Ionicons name={item.icon as any} size={20} color={themeColors.textColorAccent} />
          <Text style={[styles.menuItemText, { color: themeColors.textColor }]}>{item.title}</Text>
          <Ionicons name="chevron-forward" size={16} color={themeColors.textParagraph} />
        </TouchableOpacity>
      ))}

      <LogoutModal
        isVisible={isLogoutModalVisible}
        onClose={() => setIsLogoutModalVisible(false)}
        onLogout={confirmLogout}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profileSection: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 30,
    textAlign: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  email: {
    fontSize: 12,
    textAlign: 'center',
  },
  editButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 24,
    height: 24,
    borderRadius: 12,
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 18,
    borderBottomWidth: 0.5,
  },
  menuItemText: {
    fontSize: 14,
    marginLeft: 16,
    flex: 1,
  },
});

export default ConfigScreen;