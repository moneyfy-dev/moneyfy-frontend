import React, { useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedLayout } from '@/components/ThemedLayout';
import { ThemedInput } from '@/components/ThemedInput';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedButton } from '@/components/ThemedButton';
import { changePassword } from '@/services/securityService';

export default function ChangePasswordScreen() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const themeColors = useThemeColor();
    const router = useRouter();

    const handleSave = async () => {
        try {
            await changePassword(currentPassword, newPassword);
            Alert.alert('Éxito', 'Contraseña cambiada correctamente');
            router.back();
        } catch (error) {
            console.error('Error al cambiar la contraseña:', error);
            Alert.alert('Error', 'No se pudo cambiar la contraseña');
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
        </ThemedLayout>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    button: {
        marginTop: 24,
    }
});