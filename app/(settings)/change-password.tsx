import React, { useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedLayout } from '@/shared/components/layouts/ThemedLayout';
import { ThemedInput } from '@/shared/components/ui/ThemedInput';
import { useThemeColor } from '@/shared/hooks/useThemeColor';
import { ThemedButton } from '@/shared/components/ui/ThemedButton';
import { changePassword } from '@/core/services/securityService';
import { MessageModal } from '@/shared/components/modals/MessageModal';

export default function ChangePasswordScreen() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [successModalVisible, setSuccessModalVisible] = useState(false);

    const themeColors = useThemeColor();
    const router = useRouter();

    const handleSave = async () => {
        if (newPassword !== confirmPassword) {
            setErrorMessage('Las nuevas contraseñas no coinciden');
            setIsErrorModalVisible(true);
            return;
        }

        try {
            const response = await changePassword(currentPassword, newPassword);
            if (response.status === 200) {
                setSuccessMessage(response.message || 'Contraseña cambiada correctamente');
                setSuccessModalVisible(true);
                router.back();
            } else {
                setErrorMessage(response.message || 'No se pudo cambiar la contraseña');
                setIsErrorModalVisible(true);
            }
        } catch (error) {
            setErrorMessage('No se pudo cambiar la contraseña. Por favor, intente de nuevo.');
            setIsErrorModalVisible(true);
        }
    };

    return (
        <ThemedLayout padding={[0, 40]}>
            <View style={styles.content}>
                <ThemedInput
                    label="Contraseña actual"
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    placeholder="Ingrese su contraseña actual"
                    secureTextEntry
                />

                <ThemedInput
                    label="Nueva contraseña"
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="Ingrese su nueva contraseña"
                    secureTextEntry
                />

                <ThemedInput
                    label="Repetir contraseña"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Repita su nueva contraseña"
                    secureTextEntry
                />
            </View>

            <ThemedButton
                text="Guardar contraseña"
                onPress={handleSave}
                style={styles.button}
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

            <MessageModal
                isVisible={successModalVisible}
                onClose={() => setSuccessModalVisible(false)}
                title="Éxito"
                message={successMessage}
                icon={{
                    name: "checkmark-circle-outline",
                    color: themeColors.status.success
                }}
                primaryButton={{
                    text: "Entendido",
                    onPress: () => setSuccessModalVisible(false)
                }}
            />
        </ThemedLayout>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    button: {
        marginTop: 24,
    },
});