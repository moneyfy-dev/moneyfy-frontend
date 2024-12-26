import React, { useState, useRef } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ROUTES, ConfirmationFlowType } from '@/core/types';
import { View, StyleSheet, TextInput } from 'react-native';
import { useThemeColor } from '@/shared/hooks';
import { ThemedLayout, ThemedText, ThemedButton, MessageModal, VerificationCode, ResendCode } from '@/shared/components';
import { useAuth, useUser } from '@/core/context';

export default function ConfirmationCodeScreen() {
    const route = useLocalSearchParams();
    const { email, flow } = route;
    const { confirmCode, resendCode, handleRegistrationSuccess } = useAuth();
    const { syncWithAuth } = useUser();
    const router = useRouter();
    const [code, setCode] = useState('');
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

    const handleConfirmCode = async (code: string) => {
        try {
            const response = await confirmCode(
                email as string, 
                code, 
                flow as ConfirmationFlowType,
            );

            setSuccessMessage('Verificación exitosa');
            setSuccessModalVisible(true);

            if (flow === 'registerUser' && response.status === 201) {
                await handleRegistrationSuccess(response);
                await syncWithAuth(response.data.user);
                router.replace(ROUTES.TABS.INDEX);
            } else if (flow === 'restorePassword' && response.status === 200) {
                setSuccessMessage('Contraseña restaurada exitosamente');
                setSuccessModalVisible(true);
                setTimeout(() => {
                    router.replace(ROUTES.AUTH.LOGIN);
                }, 1500);
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