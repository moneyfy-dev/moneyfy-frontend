import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { ROUTES } from '@/core/types';
import { StyleSheet, View, Switch, TouchableOpacity } from 'react-native';
import { useThemeColor } from '@/shared/hooks';
import { ThemedLayout, ThemedText, MessageModal } from '@/shared/components';
import { useSettings } from '@/core/context';
import { Ionicons } from '@expo/vector-icons';
import { isBiometricAvailable } from '@/core/services/biometricService';
import { storage } from '@/shared/utils/storage';
import { STORAGE_KEYS } from '@/core/types';

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
    const { security, updateSecurity } = useSettings();
    const [isLoading, setIsLoading] = useState(false);
    const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const checkInitialState = async () => {
            const biometricEnabled = await storage.get(STORAGE_KEYS.AUTH.BIOMETRIC_ENABLED);
            if (!biometricEnabled) {
                await updateSecurity({ fingerprintEnabled: false });
            }
        };
        checkInitialState();
    }, []);

    const securityOptions: SecurityOption[] = [
        {
            id: 'fingerprintEnabled',
            title: 'Autenticación biométrica',
            type: 'switch',
            isEnabled: security.fingerprintEnabled
        },
        {
            id: 'password',
            title: 'Cambiar contraseña',
            type: 'navigate',
            route: ROUTES.SETTINGS.CHANGE_PASSWORD
        },
        {
            id: 'pin',
            title: 'Configurar PIN',
            type: 'navigate',
            route: ROUTES.SETTINGS.PIN_CONFIG
        }
    ];

    const handleToggle = async (id: string) => {
        try {
            if (id === 'fingerprintEnabled') {
                setIsLoading(true);
                const newValue = !security.fingerprintEnabled;
                
                if (newValue) {
                    const isAvailable = await isBiometricAvailable();
                    if (!isAvailable) {
                        setErrorMessage('La autenticación biométrica no está disponible en este dispositivo');
                        setIsErrorModalVisible(true);
                        return;
                    }
                }

                await updateSecurity({ fingerprintEnabled: newValue });
                await storage.set(STORAGE_KEYS.AUTH.BIOMETRIC_ENABLED, newValue.toString());
                await storage.set(STORAGE_KEYS.AUTH.PERSISTENT_AUTH, newValue.toString());
            }
        } catch (error) {
            setErrorMessage('No se pudo actualizar la configuración de seguridad');
            setIsErrorModalVisible(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNavigation = (route?: string) => {
        if (route) {
            router.push(route as any);
        }
    };

    const renderOption = (option: SecurityOption) => (
        <TouchableOpacity key={option.id} style={[
            styles.optionContainer,
            { borderBottomColor: themeColors.borderBackgroundColor }
        ]}
        onPress={() => handleNavigation(option.route)}
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
                    onValueChange={() => handleToggle(option.id)}
                    value={option.isEnabled}
                />
            ) : (
                    <Ionicons
                        name="chevron-forward"
                        size={16}
                        color={themeColors.textParagraph}
                    />
            )}
        </TouchableOpacity>
    );

    return (
        <ThemedLayout padding={[0, 40]}>
            {securityOptions.map(renderOption)}

            <MessageModal
                isVisible={isErrorModalVisible}
                onClose={() => setIsErrorModalVisible(false)}
                title="Error"
                message={errorMessage}
                icon={{
                    name: "alert-circle-outline",
                    color: themeColors.status.error
                }}
                primaryButton={{
                    text: "Entendido",
                    onPress: () => setIsErrorModalVisible(false)
                }}
            />
        </ThemedLayout>
    );
}

const styles = StyleSheet.create({
    optionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 0.5,
    },
    optionContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 16,
    }
});

function getIconName(id: string): keyof typeof Ionicons.glyphMap {
    switch (id) {
        case 'password':
            return 'key-outline';
        case 'pin':
            return 'keypad-outline';
        case 'fingerprintEnabled':
            return 'finger-print-outline';
        default:
            return 'help-outline';
    }
}