import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSettings } from '@/core/context';
import { ThemedLayout, ThemedInput, ThemedButton, MessageModal } from '@/shared/components';
import { useThemeColor } from '@/shared/hooks';
import { validatePassword } from '@/shared/utils/validations';

export default function ChangePasswordScreen() {
    const router = useRouter();
    const themeColors = useThemeColor();
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
    const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

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
            setIsSuccessModalVisible(true);
        } catch (error) {
            setErrorMessage('No se pudo actualizar la contraseña');
            setIsErrorModalVisible(true);
        }
    };

    const handleSuccessClose = () => {
        setIsSuccessModalVisible(false);
        router.back();
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

                <ThemedButton
                    text="Cambiar contraseña"
                    onPress={handleSubmit}
                    style={styles.button}
                />
            </View>

            <MessageModal
                isVisible={isSuccessModalVisible}
                onClose={handleSuccessClose}
                title="¡Éxito!"
                message="Tu contraseña ha sido actualizada correctamente"
                icon={{
                    name: "checkmark-circle-outline",
                    color: themeColors.status.success
                }}
                primaryButton={{
                    text: "Entendido",
                    onPress: handleSuccessClose
                }}
            />

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
    container: {
        flex: 1,
        gap: 16,
    },
    button: {
        marginTop: 24,
    }
});