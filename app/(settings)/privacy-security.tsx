import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Switch, TouchableOpacity, Alert } from 'react-native';
import { ThemedLayout } from '@/components/ThemedLayout';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Href } from 'expo-router';
import { getLocalSecuritySettings, updateLocalSecuritySettings } from '@/services/securityService';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SecurityOption {
    id: string;
    title: string;
    type: 'switch' | 'navigate';
    route?: string;
    isEnabled?: boolean;
}

export default function PrivacySecurityScreen() {
    const themeColors = useThemeColor();
    const router = useRouter();
  
    const [securitySettings, setSecuritySettings] = useState({
      fingerprintEnabled: false,
      persistentAuthEnabled: false,
    });
  
    useEffect(() => {
      const fetchSecuritySettings = async () => {
        try {
          const settings = await getLocalSecuritySettings();
          setSecuritySettings(settings);
        } catch (error) {
          console.error('Error al obtener configuración de seguridad:', error);
        }
      };
  
      fetchSecuritySettings();
    }, []);
  
    const toggleSwitch = async (id: keyof typeof securitySettings) => {
      try {
        const updatedSettings = {
          ...securitySettings,
          [id]: !securitySettings[id],
        };
        await updateLocalSecuritySettings(updatedSettings);
        setSecuritySettings(updatedSettings);
      } catch (error) {
        console.error('Error al actualizar configuración de seguridad:', error);
        Alert.alert('Error', 'No se pudo actualizar la configuración de seguridad');
      }
    };
  
    const securityOptions: SecurityOption[] = [
      { id: 'password', title: 'Cambiar contraseña', type: 'navigate', route: '/change-password' },
      { id: 'pin', title: 'Establecer PIN o Patrón', type: 'navigate', route: '/pin-config' },
      { id: 'twoFactor', title: 'Autenticación de dos pasos', type: 'navigate', route: '/two-factor-auth' },
      { id: 'fingerprintEnabled', title: 'Autorizar huella', type: 'switch', isEnabled: securitySettings.fingerprintEnabled },
      { id: 'persistentAuthEnabled', title: 'Autenticación persistente', type: 'switch', isEnabled: securitySettings.persistentAuthEnabled },
    ];
  
    const renderOption = (option: SecurityOption) => (
      <TouchableOpacity
        key={option.id}
        style={[styles.optionContainer, { borderBottomWidth: 0.5, borderColor: themeColors.borderBackgroundColor }]}
        onPress={() => option.type === 'navigate' && option.route && router.push(option.route as Href<string>)}
      >
        <View style={styles.optionContent}>
          <Ionicons
            name={getIconName(option.id)}
            size={24}
            color={themeColors.textColorAccent}
            style={styles.icon}
          />
          <ThemedText variant="subTitle">{option.title}</ThemedText>
        </View>
        {option.type === 'switch' ? (
          <Switch
            trackColor={{ false: themeColors.extremeContrastGray, true: themeColors.textColorAccent }}
            thumbColor={option.isEnabled ? themeColors.extremeContrastGray : themeColors.textColorAccent}
            ios_backgroundColor={themeColors.extremeContrastGray}
            onValueChange={() => toggleSwitch(option.id as keyof typeof securitySettings)}
            value={option.isEnabled}
          />
        ) : (
          <Ionicons name="chevron-forward" size={16} color={themeColors.textParagraph} />
        )}
      </TouchableOpacity>
    );
  
    return (
      <ThemedLayout padding={[0, 40]}>
        {securityOptions.map(renderOption)}
      </ThemedLayout>
    );
  }

const styles = StyleSheet.create({
    optionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    optionContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 16,
    },
    setupButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#e0e0e0',
        borderRadius: 5,
        alignItems: 'center',
    },
});

function getIconName(id: string): keyof typeof Ionicons.glyphMap {
    switch (id) {
        case 'password':
            return 'key-outline';
        case 'pin':
            return 'keypad-outline';
        case 'twoFactor':
            return 'shield-checkmark-outline';
        case 'fingerprintEnabled':
            return 'finger-print-outline';
        case 'persistentAuthEnabled':
            return 'lock-closed-outline';
        default:
            return 'help-outline';
    }
}