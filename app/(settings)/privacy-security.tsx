import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { ROUTES } from '@/core/types';
import { StyleSheet, View, Switch, TouchableOpacity } from 'react-native';
import { useThemeColor } from '@/shared/hooks';
import { ThemedLayout, ThemedText, MessageModal } from '@/shared/components';
import { useSettings, useAuth } from '@/core/context';
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
    const { checkAuthStatus } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [securityOptions, setSecurityOptions] = useState<SecurityOption[]>([
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
    ]);
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        console.log('security', security);
        setSecurityOptions(prevOptions =>
            prevOptions.map(option => 
                option.id === 'fingerprintEnabled' 
                    ? { ...option, isEnabled: security.fingerprintEnabled }
                    : option
            )
        );
    }, [security]);

    const handleToggle = async (id: string) => {
        if (isLoading) return;
        let newValue: boolean;
        
        try {
            if (id === 'fingerprintEnabled') {
                setIsLoading(true);
                newValue = !securityOptions.find(opt => opt.id === id)?.isEnabled;

                if (newValue) {
                    const isAvailable = await isBiometricAvailable();
                    if (!isAvailable) {
                        setErrorMessage('La autenticación biométrica no está disponible');
                        setIsErrorModalVisible(true);
                        return;
                    }
                }

                setSecurityOptions(prevOptions =>
                    prevOptions.map(option =>
                        option.id === id ? { ...option, isEnabled: newValue } : option
                    )
                );

                await Promise.all([
                    storage.set(STORAGE_KEYS.AUTH.BIOMETRIC_ENABLED, String(newValue)),
                    storage.set(STORAGE_KEYS.AUTH.PERSISTENT_AUTH, String(newValue)),
                    storage.set(STORAGE_KEYS.AUTH.PERSISTENT_AUTH_CONFIGURED, String(newValue))
                ]);

                await updateSecurity({ fingerprintEnabled: newValue });

                await checkAuthStatus();

                setSuccessMessage(newValue ? 
                    'Autenticación biométrica activada' : 
                    'Autenticación biométrica desactivada'
                );
                setIsSuccessModalVisible(true);
            }
        } catch (error) {
            setSecurityOptions(prevOptions =>
                prevOptions.map(option =>
                    option.id === id ? { ...option, isEnabled: !newValue } : option
                )
            );
            setErrorMessage('Error al actualizar la configuración');
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
                    disabled={isLoading}
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

            <MessageModal
                isVisible={isSuccessModalVisible}
                onClose={() => setIsSuccessModalVisible(false)}
                title="Éxito"
                message={successMessage}
                icon={{
                    name: "checkmark-circle-outline",
                    color: themeColors.status.success
                }}
                primaryButton={{
                    text: "Entendido",
                    onPress: () => setIsSuccessModalVisible(false)
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