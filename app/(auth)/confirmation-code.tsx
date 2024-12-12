import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Keyboard, TextInput, ScrollView } from 'react-native';
import { useRouter, Href, useLocalSearchParams } from 'expo-router';
import { ThemedLayout } from '@/components/ThemedLayout';
import { ThemedText } from '@/components/ThemedText';
import { ThemedInput } from '@/components/ThemedInput';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAuth } from '@/context/AuthContext';
import { ThemedButton } from '@/components/ThemedButton';
import { confirmRegistration, resendConfirmationCode, confirmDeviceChange } from '@/services/authService';
import { MessageModal } from '@/components/MessageModal';

export default function ConfirmationCodeScreen() {
    const route = useLocalSearchParams();
    const { email, flow } = route;
    const { updateUserData } = useAuth();
    const router = useRouter();
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const inputRefs = useRef<Array<React.RefObject<TextInput>>>([
        React.createRef(), React.createRef(), React.createRef(), React.createRef(), React.createRef(), React.createRef()
    ]);
    const themeColors = useThemeColor();
    const [isResendDisabled, setIsResendDisabled] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

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

            if (text.length === 1 && index < 5) {
                inputRefs.current[index + 1].current?.focus();
            }
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && index > 0 && code[index] === '') {
            const newCode = [...code];
            newCode[index - 1] = '';
            setCode(newCode);
            inputRefs.current[index - 1].current?.focus();
        }
    };

    const handleConfirmCode = async (code: string) => {
        try {
            let response;
            
            if (flow === 'device-change') {
                response = await confirmDeviceChange(email as string, code);
                await updateUserData(response.data.user);
                router.replace('/(tabs)');
            } else {
                response = await confirmRegistration(email as string, code);
                await updateUserData(response.data.user);
                router.replace('/(tabs)');
            }
        } catch (error) {
            setErrorMessage('Código inválido. Por favor intente nuevamente.');
            setIsErrorModalVisible(true);
        }
    };

    const handleResendCode = async () => {
        if (isResendDisabled) return;

        setIsResendDisabled(true);
        setResendTimer(60);

        try {
            if(flow === 'device-change') {
                const response = await resendConfirmationCode(email as string, 'changeDevice');
                if (response.status === 200) {
                    setSuccessMessage('Se ha enviado un nuevo código de confirmación.');
                    setSuccessModalVisible(true);
                }
            } else {
                const response = await resendConfirmationCode(email as string, 'registerUser');
                if (response.status === 200) {
                    setSuccessMessage('Se ha enviado un nuevo código de confirmación.');
                    setSuccessModalVisible(true);
                }
            }
        } catch (error) {
            console.error('Error al reenviar el código:', error);
            setErrorMessage('No se pudo reenviar el código. Inténtalo de nuevo.');
            setIsErrorModalVisible(true);
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
                <ThemedText variant='paragraph' textAlign='center' marginBottom={10}>
                    Un código de 6 dígitos fue enviado a
                </ThemedText>
                <ThemedText variant='paragraph' style={{ color: themeColors.textColorAccent }} textAlign='center' marginBottom={40}>
                    {email}
                </ThemedText>

                <View style={styles.codeContainer}>
                    {code.map((digit, index) => (
                        <ThemedInput
                            key={index}
                            ref={inputRefs.current[index]}
                            value={digit}
                            onChangeText={(text) => handleCodeChange(text, index)}
                            onKeyPress={(e) => handleKeyPress(e, index)}
                            keyboardType="numeric"
                            maxLength={1}
                            placeholder=""
                            style={[styles.codeInput, { color: themeColors.textColorAccent }]}
                        />
                    ))}
                </View>
            </View>

            <View style={styles.buttonContainer}>

                <TouchableOpacity onPress={handleResendCode} disabled={isResendDisabled}>
                    <ThemedText 
                        variant='paragraph' 
                        textAlign='center' 
                        marginBottom={24}
                        style={isResendDisabled ? styles.disabledText : {color: themeColors.textColorAccent}}
                    >
                        {isResendDisabled 
                            ? `Reenviar código en ${resendTimer}s` 
                            : 'Reenviar código'}
                    </ThemedText>
                </TouchableOpacity>

                <ThemedButton
                    text="Continuar"
                    onPress={() => handleConfirmCode(code.join(''))}
                />
            </View>

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
        textAlign: 'center',
        width: 10,
        padding: 0,
    },
    buttonContainer: {
        width: '100%',
        marginTop: 24,
    },
    disabledText: {
        opacity: 0.5,
    }
});