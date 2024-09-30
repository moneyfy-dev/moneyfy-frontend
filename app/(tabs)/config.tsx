import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Href } from 'expo-router';
import { LogoutModal } from '@/components/LogoutModal';
import { useAuth } from '@/context/AuthContext'; // Asegúrate de tener este contexto

const ConfigScreen = () => {
  const themeColors = useThemeColor();
  const router = useRouter();
  const { logout, userEmail } = useAuth(); // Usamos logout en lugar de signOut
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  const handleLogout = () => {
    setIsLogoutModalVisible(true);
  };

  const confirmLogout = async () => {
    try {
      await logout(); // Usamos logout en lugar de signOut
      setIsLogoutModalVisible(false);
      // Navega a la pantalla de login o a donde sea apropiado después de cerrar sesión
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
        <Image
          source={{ uri: 'https://via.placeholder.com/100' }}
          style={styles.profileImage}
        />
        <View>
          <Text style={[styles.name, { color: themeColors.textColor }]}>Alejandro Osses</Text>
          <Text style={[styles.email, { color: themeColors.textParagraph }]}>{userEmail || 'No email'}</Text>
        </View>
        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="pencil" size={20} color={themeColors.textColorAccent} />
        </TouchableOpacity>
      </View>

      {menuItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.menuItem}
          onPress={item.onPress || (() => router.push(item.route))}
        >
          <Ionicons name={item.icon} size={24} color={themeColors.textColorAccent} />
          <Text style={[styles.menuItemText, { color: themeColors.textColor }]}>{item.title}</Text>
          <Ionicons name="chevron-forward" size={24} color={themeColors.textParagraph} />
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
  },
  editButton: {
    marginLeft: 'auto',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 15,
    flex: 1,
  },
});

export default ConfigScreen;