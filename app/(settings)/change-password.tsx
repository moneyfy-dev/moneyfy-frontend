import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router, useRouter } from 'expo-router';
import { useSettings } from '@/core/context';
import { ThemedLayout, ThemedInput, ThemedButton } from '@/shared/components';
import { getPasswordErrors, validatePassword } from '@/shared/utils/validations';
import { useMessageConfig } from '@/shared/hooks';
import { ROUTES } from '@/core/types';

export default function ChangePasswordScreen() {
    const { changePassword } = useSettings();
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    useMessageConfig(['/users/change/password']);
    

    const validateFields = () => {
        let isValid = true;

        if (!formData.currentPassword) {
            setErrors(prev => ({
                ...prev,
                currentPassword: 'Ingresa tu contraseña actual'
            }));
            isValid = false;
        }

        if (!validatePassword(formData.newPassword)) {
            const errors = getPasswordErrors(formData.newPassword);
            setErrors(prev => ({
                ...prev,
                newPassword: `La contraseña debe contener ${errors.join(', ')}`
            }));
            isValid = false;
        }

        if (formData.currentPassword === formData.newPassword) {
            setErrors(prev => ({
                ...prev,
                newPassword: 'La nueva contraseña debe ser diferente a la actual'
            }));
            isValid = false;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setErrors(prev => ({
                ...prev,
                confirmPassword: 'Las contraseñas no coinciden'
            }));
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = async () => {
        // Limpiar errores previos
        setErrors({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        });

        if (!validateFields()) return;

        try {
            await changePassword(formData.currentPassword, formData.newPassword);
            setTimeout(() => {
                router.replace(ROUTES.TABS.INDEX);
            }, 1500);
        } catch (error) {
        }
    };

    return (
        <ThemedLayout>
            <View style={styles.container}>
                <ThemedInput
                    label="Contraseña actual"
                    value={formData.currentPassword}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, currentPassword: text }))}
                    error={errors.currentPassword}
                    secureTextEntry
                />

                <ThemedInput
                    label="Nueva contraseña"
                    value={formData.newPassword}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, newPassword: text }))}
                    error={errors.newPassword}
                    secureTextEntry
                />

                <ThemedInput
                    label="Confirmar nueva contraseña"
                    value={formData.confirmPassword}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, confirmPassword: text }))}
                    error={errors.confirmPassword}
                    secureTextEntry
                />
            </View>

            <ThemedButton
                text="Cambiar contraseña"
                onPress={handleSubmit}
                style={styles.button}
                disabled={!formData.currentPassword || !formData.newPassword || !formData.confirmPassword}
            />

        </ThemedLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    button: {
        marginTop: 24,
    }
});