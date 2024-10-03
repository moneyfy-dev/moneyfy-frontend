import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedLayout } from '@/components/ThemedLayout';
import { ThemedInput } from '@/components/ThemedInput';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedButton } from '@/components/ThemedButton';

export default function ChangePasswordScreen() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const themeColors = useThemeColor();
    const router = useRouter();

    const handleSave = () => {
        // Aquí iría la lógica para cambiar la contraseña
        console.log('Cambiando contraseña...');
        // Si el cambio es exitoso, podrías navegar de vuelta o mostrar un mensaje de éxito
        // router.back();
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