import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { ROUTES } from '@/core/types';
import { StyleSheet, View, Switch, TouchableOpacity } from 'react-native';
import { useThemeColor } from '@/shared/hooks';
import { ThemedLayout, ThemedText, MessageModal } from '@/shared/components';
import { useSettings } from '@/core/context';
import { Ionicons } from '@expo/vector-icons';
import { storage } from '@/shared/utils/storage';
import { STORAGE_KEYS } from '@/core/types';

export default function PrivacySecurityScreen() {
    const themeColors = useThemeColor();
    const router = useRouter();
    const { security, updateSecurity, isBiometricAvailable } = useSettings();
    const [isLoading, setIsLoading] = useState(false);
    const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [isBiometricEnabled, setIsBiometricEnabled] = useState(security.fingerprintEnabled);

    useEffect(() => {
        setIsBiometricEnabled(security.fingerprintEnabled);
    }, [security.fingerprintEnabled]);

    const handleToggle = async () => {
        if (isLoading) return;
        const newValue = !isBiometricEnabled;

        try {
            setIsLoading(true);

            if (newValue) {
                const isAvailable = await isBiometricAvailable();
                if (!isAvailable) {
                    setErrorMessage('La autenticación biométrica no está disponible');
                    setIsErrorModalVisible(true);
                    return;
                }
            }

            await Promise.all([
                storage.set(STORAGE_KEYS.AUTH.BIOMETRIC_ENABLED, String(newValue)),
                storage.set(STORAGE_KEYS.AUTH.PERSISTENT_AUTH, String(newValue)),
            ]);

            await updateSecurity({ fingerprintEnabled: newValue });
            setIsBiometricEnabled(newValue);

            setSuccessMessage(newValue ?
                'Autenticación biométrica activada' :
                'Autenticación biométrica desactivada'
            );
            setIsSuccessModalVisible(true);
        } catch (error) {
            setErrorMessage('Error al actualizar la configuración');
            setIsErrorModalVisible(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNavigation = (route: string) => {
        router.push(route as any);
    };

    return (
        <ThemedLayout padding={[0, 40]}>
            {/* Opción de autenticación biométrica */}
            <View style={[
                styles.optionContainer,
                { borderBottomColor: themeColors.borderBackgroundColor }
            ]}>
                <View style={styles.optionContent}>
                    <Ionicons
                        name="finger-print-outline"
                        size={24}
                        color={themeColors.textColorAccent}
                        style={styles.icon}
                    />
                    <ThemedText variant="subTitle">Autenticación biométrica</ThemedText>
                </View>
                <Switch
                    trackColor={{ false: themeColors.extremeContrastGray, true: themeColors.textColorAccent }}
                    thumbColor={isBiometricEnabled ? themeColors.extremeContrastGray : themeColors.textColorAccent}
                    ios_backgroundColor={themeColors.extremeContrastGray}
                    onValueChange={handleToggle}
                    value={isBiometricEnabled}
                    disabled={isLoading}
                />
            </View>

            {/* Opción de cambiar contraseña */}
            <TouchableOpacity
                style={[
                    styles.optionContainer,
                    { borderBottomColor: themeColors.borderBackgroundColor }
                ]}
                onPress={() => handleNavigation(ROUTES.SETTINGS.CHANGE_PASSWORD)}
            >
                <View style={styles.optionContent}>
                    <Ionicons
                        name="key-outline"
                        size={24}
                        color={themeColors.textColorAccent}
                        style={styles.icon}
                    />
                    <ThemedText variant="subTitle">Cambiar contraseña</ThemedText>
                </View>
                <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={themeColors.textParagraph}
                />
            </TouchableOpacity>

            {/* Opción de configurar PIN */}
            <TouchableOpacity
                style={[
                    styles.optionContainer,
                    { borderBottomColor: themeColors.borderBackgroundColor }
                ]}
                onPress={() => handleNavigation(ROUTES.SETTINGS.PIN_CONFIG)}
            >
                <View style={styles.optionContent}>
                    <Ionicons
                        name="keypad-outline"
                        size={24}
                        color={themeColors.textColorAccent}
                        style={styles.icon}
                    />
                    <ThemedText variant="subTitle">Configurar PIN</ThemedText>
                </View>
                <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={themeColors.textParagraph}
                />
            </TouchableOpacity>

            {/* Modales de error y éxito */}
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