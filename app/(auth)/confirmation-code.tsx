import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ROUTES, ConfirmationFlowType } from '@/core/types';
import { View, StyleSheet, TouchableOpacity, Keyboard, TextInput } from 'react-native';
import { useThemeColor } from '@/shared/hooks';
import { ThemedLayout, ThemedText, ThemedInput, ThemedButton, MessageModal } from '@/shared/components';
import { useAuth } from '@/core/context';

export default function ConfirmationCodeScreen() {
    const route = useLocalSearchParams();
    const { email, flow, newPassword } = route;
    const { confirmCode, resendCode } = useAuth();
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
            const response = await confirmCode(
                email as string, 
                code, 
                flow as ConfirmationFlowType,
                flow === 'restorePassword' ? JSON.parse(newPassword as string) : undefined
            );

            if (response.status === 200) {
                if (flow === 'restorePassword') {
                    router.replace(ROUTES.AUTH.LOGIN);
                } else {
                    router.replace(ROUTES.TABS.INDEX);
                }
            }
        } catch (error: any) {
            setErrorMessage(error.message || 'Código inválido. Por favor intente nuevamente.');
            setIsErrorModalVisible(true);
        }
    };

    const handleResendCode = async () => {
        if (isResendDisabled) return;

        setIsResendDisabled(true);
        setResendTimer(60);

        try {
            const response = await resendCode(
                email as string, 
                flow as ConfirmationFlowType
            );

            if (response.status === 200) {
                setSuccessMessage('Se ha enviado un nuevo código de confirmación.');
                setSuccessModalVisible(true);
            }
        } catch (error: any) {
            console.error('Error al reenviar el código:', error);
            setErrorMessage(error.message || 'No se pudo reenviar el código. Inténtalo de nuevo.');
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