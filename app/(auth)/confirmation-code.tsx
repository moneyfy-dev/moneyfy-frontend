import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Keyboard, TextInput, ScrollView, Alert } from 'react-native';
import { useRouter, Href } from 'expo-router';
import { ThemedLayout } from '@/components/ThemedLayout';
import { ThemedText } from '@/components/ThemedText';
import { ThemedInput } from '@/components/ThemedInput';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAuth } from '@/context/AuthContext';
import { ThemedButton } from '@/components/ThemedButton';
import { confirmRegistration, resendConfirmationCode } from '@/services/authService';

export default function ConfirmationCodeScreen() {
    const [code, setCode] = useState(['', '', '', '']);
    const inputRefs = useRef<Array<React.RefObject<TextInput>>>([
        React.createRef(), React.createRef(), React.createRef(), React.createRef()
    ]);
    const themeColors = useThemeColor();
    const router = useRouter();
    const { login, userEmail } = useAuth();
    const [isResendDisabled, setIsResendDisabled] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else if (resendTimer === 0) {
            setIsResendDisabled(false);
        }
        return () => clearInterval(interval);
    }, [resendTimer]);

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
        const fullCode = code.join('');
        if (fullCode.length !== 4) {
            Alert.alert('Error', 'Por favor, ingrese el código completo de 4 dígitos.');
            return;
        }

        try {
            const response = await confirmRegistration(userEmail, fullCode);
            if (response.status === 200) {
                try {
                    await login(userEmail, ''); // Asumiendo que esta función devuelve una promesa
                    router.replace('/(tabs)' as Href<string>);
                } catch (loginError) {
                    console.error('Error al iniciar sesión después de la confirmación:', loginError);
                    Alert.alert('Error', 'La cuenta se activó correctamente, pero hubo un problema al iniciar sesión. Por favor, intente iniciar sesión manualmente.');
                    router.replace('/login' as Href<string>);
                }
            }
        } catch (error) {
            console.error('Error al validar el código:', error);
            Alert.alert('Error', 'No se pudo validar el código. Inténtalo de nuevo.');
        }
    };

    const handleResendCode = async () => {
        if (isResendDisabled) return;

        setIsResendDisabled(true);
        setResendTimer(60); // Deshabilita el botón por 60 segundos

        try {
            const response = await resendConfirmationCode(userEmail);
            if (response.status === 200) {
                Alert.alert('Éxito', 'Se ha enviado un nuevo código de confirmación.');
            }
        } catch (error) {
            console.error('Error al reenviar el código:', error);
            Alert.alert('Error', 'No se pudo reenviar el código. Inténtalo de nuevo.');
        }
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
        <ThemedLayout>
            <View style={styles.pageContainer}>

                <ThemedText variant='title' textAlign='center' marginBottom={8}>Ingrese el código de confirmación</ThemedText>
                <ThemedText variant='paragraph' textAlign='center' marginBottom={40}>
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
            </View>

            <View style={styles.buttonContainer}>

                <TouchableOpacity onPress={handleResendCode} disabled={isResendDisabled}>
                    <ThemedText 
                        variant='textLink' 
                        textAlign='center' 
                        marginBottom={24}
                        style={isResendDisabled ? styles.disabledText : {}}
                    >
                        {isResendDisabled 
                            ? `Reenviar código en ${resendTimer}s` 
                            : 'Reenviar código'}
                    </ThemedText>
                </TouchableOpacity>

                <ThemedButton
                    text="Continuar"
                    onPress={handleContinue}
                />
            </View>
        </ThemedLayout>
    );
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    codeContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        marginHorizontal: 'auto',
    },
    codeInput: {
        width: 50,
        height: 50,
        borderWidth: 1,
        borderRadius: 10,
        textAlign: 'center',
        fontSize: 24,
    },
    buttonContainer: {
        width: '100%',
        marginTop: 24,
    },
    disabledText: {
        opacity: 0.5,
    }
});