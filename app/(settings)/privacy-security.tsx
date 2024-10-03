import React, { useState } from 'react';
import { StyleSheet, View, Switch, TouchableOpacity } from 'react-native';
import { ThemedLayout } from '@/components/ThemedLayout';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Href } from 'expo-router';

interface SecurityOption {
    id: string;
    title: string;
    type: 'switch' | 'navigate';
    isEnabled?: boolean;
    route?: string;
}

export default function PrivacySecurityScreen() {
    const themeColors = useThemeColor();
    const router = useRouter();

    const [securityOptions, setSecurityOptions] = useState<SecurityOption[]>([
        { id: 'password', title: 'Cambiar contraseña', type: 'navigate', route: '/change-password' },
        { id: 'pin', title: 'Establecer PIN o Patrón', type: 'navigate', route: '/pin-config' },
        { id: 'twoFactor', title: 'Autenticación de dos pasos', type: 'navigate', route: '/two-factor-auth' },
        { id: 'fingerprint', title: 'Autorizar huella', type: 'switch', isEnabled: true },
    ]);

    const toggleSwitch = (id: string) => {
        setSecurityOptions(prevOptions =>
            prevOptions.map(option =>
                option.id === id ? { ...option, isEnabled: !option.isEnabled } : option
            )
        );
    };

    const handleNavigation = (option: SecurityOption) => {
        if (option.route) {
            router.push(option.route as Href<string>);
        } else {
            console.log(`Navegando a ${option.id}...`);
        }
    };

    const renderOption = (option: SecurityOption) => (
        <TouchableOpacity
            key={option.id}
            style={[styles.optionContainer, { borderBottomWidth: option.id === 'fingerprint' ? 0 : 0.5, borderColor: themeColors.borderBackgroundColor }]}
            onPress={() => option.type === 'navigate' && handleNavigation(option)}
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
                    onValueChange={() => toggleSwitch(option.id)}
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
});

function getIconName(id: string): keyof typeof Ionicons.glyphMap {
    switch (id) {
        case 'password':
            return 'key-outline';
        case 'pin':
            return 'keypad-outline';
        case 'twoFactor':
            return 'shield-checkmark-outline';
        case 'fingerprint':
            return 'finger-print-outline';
        default:
            return 'help-outline';
    }
}