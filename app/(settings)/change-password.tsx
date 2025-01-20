import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { router, useRouter } from 'expo-router';
import { useSettings } from '@/core/context';
import { ThemedLayout, ThemedInput, ThemedButton } from '@/shared/components';
import { validatePassword } from '@/shared/utils/validations';
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

    const handleSubmit = async () => {
        // Validar campos
        const newErrors = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        };
        let hasErrors = false;

        if (!formData.currentPassword) {
            newErrors.currentPassword = 'Ingresa tu contraseña actual';
            hasErrors = true;
        }

        if (!validatePassword(formData.newPassword)) {
            newErrors.newPassword = 'La contraseña debe tener al menos 8 caracteres, una mayúscula y un número';
            hasErrors = true;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
            hasErrors = true;
        }

        setErrors(newErrors);

        if (hasErrors) return;

        try {
            await changePassword(formData.currentPassword, formData.newPassword);

            // Esperar un momento para que el mensaje se muestre antes de navegar
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