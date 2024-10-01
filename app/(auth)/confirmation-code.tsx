import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Keyboard, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedInput } from '@/components/ThemedInput';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAuth } from '@/context/AuthContext';
import { Alert } from 'react-native';

export default function ConfirmationCodeScreen() {
    const [code, setCode] = useState(['', '', '', '']);
    const inputRefs = useRef<Array<React.RefObject<TextInput>>>([
        React.createRef(), React.createRef(), React.createRef(), React.createRef()
    ]);
    const themeColors = useThemeColor();
    const router = useRouter();
    const { login: loginContext, userEmail } = useAuth();

    const handleCodeChange = (text: string, index: number) => {
        if (text.length <= 1 && /^\d*$/.test(text)) {
            const newCode = [...code];
            newCode[index] = text;
            setCode(newCode);

            if (text.length === 1 && index < 3) {
                inputRefs.current[index + 1].current?.focus();
            }
        }
    };

    const handleContinue = async () => {
        // Aquí iría la lógica para validar el código con el backend
        try {
            // Simula una respuesta del backend
            const response = { jwt: 'token_simulado', email: userEmail };
            await loginContext(response);
            router.replace('/(tabs)');
        } catch (error) {
            console.error('Error al validar el código:', error);
            Alert.alert('Error', 'No se pudo validar el código. Inténtalo de nuevo.');
        }
    };

    const handleResendCode = () => {
        // Aquí iría la lógica para reenviar el código
        console.log('Reenviar código');
    };

    useEffect(() => {
        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            inputRefs.current.forEach(ref => ref.current?.blur());
        });

        return () => {
            keyboardDidHideListener.remove();
        };
    }, []);

    return (
        <ThemedView style={styles.container}>
            <ThemedText style={styles.title}>Ingrese el código de confirmación</ThemedText>
            <ThemedText style={styles.subtitle}>
                Un código de 4 dígitos fue enviado a {userEmail}
            </ThemedText>

            <View style={styles.codeContainer}>
                {code.map((digit, index) => (
                    <ThemedInput
                        key={index}
                        ref={inputRefs.current[index]}
                        value={digit}
                        onChangeText={(text) => handleCodeChange(text, index)}
                        keyboardType="numeric"
                        maxLength={1}
                        placeholder=""
                        style={styles.codeInput}
                    />
                ))}
            </View>

            <TouchableOpacity onPress={handleResendCode}>
                <ThemedText style={styles.resendCode}>Reenviar código</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.continueButton, { backgroundColor: themeColors.buttonBackgroundColor }]}
                onPress={handleContinue}
            >
                <ThemedText style={styles.continueButtonText}>Continuar</ThemedText>
            </TouchableOpacity>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 30,
    },
    codeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        marginBottom: 30,
    },
    codeInput: {
        width: 50,
        height: 50,
        borderWidth: 1,
        borderRadius: 10,
        textAlign: 'center',
        fontSize: 24,
    },
    resendCode: {
        fontSize: 16,
        color: 'blue',
        marginBottom: 30,
    },
    continueButton: {
        width: '80%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
    },
    continueButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});