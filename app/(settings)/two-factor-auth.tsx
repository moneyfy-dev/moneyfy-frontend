import React, { useState } from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { ThemedLayout } from '@/components/ThemedLayout';
import { ThemedText } from '@/components/ThemedText';
import { ThemedInput } from '@/components/ThemedInput';
import { ThemedButton } from '@/components/ThemedButton';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';

export default function TwoFactorAuthScreen() {
    const [verificationCode, setVerificationCode] = useState('');
    const themeColors = useThemeColor();

    const handleVerify = () => {
        // Aquí iría la lógica para verificar el código
        Alert.alert('Verificación', 'Código enviado para verificación');
    };

    const handleResendCode = () => {
        // Aquí iría la lógica para reenviar el código
        Alert.alert('Reenvío', 'Se ha enviado un nuevo código');
    };

    return (
        <ThemedLayout padding={[0, 20]}>
            <View style={styles.container}>
                <Ionicons name="shield-checkmark" size={80} color={themeColors.textColorAccent} style={styles.icon} />
                
                <ThemedText variant="title" textAlign="center" marginBottom={20}>
                    Autenticación de dos pasos
                </ThemedText>
                
                <ThemedText variant="paragraph" textAlign="center" marginBottom={30}>
                    Ingrese el código de 6 dígitos que se envió a su dispositivo para verificar su identidad.
                </ThemedText>
                
                <ThemedInput
                    label="Código de verificación"
                    value={verificationCode}
                    onChangeText={setVerificationCode}
                    placeholder="Ingrese el código"
                    keyboardType="number-pad"
                    maxLength={6}
                    style={styles.input}
                />
                
                <ThemedButton
                    text="Verificar"
                    onPress={handleVerify}
                    style={styles.button}
                />
                
                <ThemedButton
                    text="Reenviar código"
                    onPress={handleResendCode}
                    style={styles.button}
                    variant="secondary"
                />
            </View>
        </ThemedLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        marginBottom: 20,
    },
    input: {
        width: '100%',
    },
    button: {
        width: '100%',
        marginBottom: 10,
    },
});
