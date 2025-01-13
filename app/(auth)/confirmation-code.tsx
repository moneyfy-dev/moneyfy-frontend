import React, { useState, useRef } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ROUTES, ConfirmationFlowType } from '@/core/types';
import { View, StyleSheet, TextInput } from 'react-native';
import { useThemeColor } from '@/shared/hooks';
import { ThemedLayout, ThemedText, ThemedButton, MessageModal, VerificationCode, ResendCode } from '@/shared/components';
import { useAuth } from '@/core/context';

export default function ConfirmationCodeScreen() {
    const route = useLocalSearchParams();
    const { email, flow } = route;
    const { confirmCode, resendCode } = useAuth();
    const router = useRouter();
    const [code, setCode] = useState('');
    const themeColors = useThemeColor();
    const [isResendDisabled, setIsResendDisabled] = useState(false);
    const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleConfirmCode = async (code: string) => {
        try {
            const response = await confirmCode(
                email as string, 
                code, 
                flow as ConfirmationFlowType,
            );

            if (flow === 'registerUser' && response.status === 201) {
                router.replace(ROUTES.TABS.INDEX);
            } else if (flow === 'changeDevice' && response.status === 200) {
                setSuccessMessage('Dispositivo cambiado exitosamente');
                setSuccessModalVisible(true);
                setTimeout(() => {
                    router.replace(ROUTES.TABS.INDEX);
                }, 3000);
            }
        } catch (error: any) {
            let errorMessage;
            switch (error.response.status) {
                case 410:
                    errorMessage = 'El código ha expirado o no es correcto.';
                    break;
                case 424:
                    errorMessage = 'Error al confirmar el código. Por favor intente nuevamente.';
                    break;
                default:
                    errorMessage = 'No es posible confirmar el código.';
            }
            setErrorMessage(errorMessage);
            setIsErrorModalVisible(true);
        }
    };

    const handleResendCode = async () => {
        if (isResendDisabled) return;

        setIsResendDisabled(true);
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

                <VerificationCode onCodeComplete={setCode} />
            </View>

            <View style={styles.buttonContainer}>

            <ResendCode onResend={handleResendCode} />

                <ThemedButton
                    text="Continuar"
                    onPress={() => handleConfirmCode(code)}
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