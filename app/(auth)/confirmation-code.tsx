import React, { useState, useRef, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ROUTES, ConfirmationFlowType } from '@/core/types';
import { Alert, View, StyleSheet } from 'react-native';
import { useMessageConfig, useThemeColor } from '@/shared/hooks';
import { ThemedLayout, ThemedText, ThemedButton, VerificationCode, ResendCode, LoadingScreen } from '@/shared/components';
import { useAuth } from '@/core/context';

export default function ConfirmationCodeScreen() {
    const route = useLocalSearchParams();
    const { email, flow } = route;
    const { confirmCode, resendCode, isLoading } = useAuth();
    const router = useRouter();
    const [code, setCode] = useState('');
    const themeColors = useThemeColor();

    useMessageConfig(['/auth/resend/code', '/auth/confirm/registration']);

    const handleConfirmCode = async (code: string) => {
        try {
            if (!code || code.length !== 6) {
                Alert.alert('Error', 'Ingresa el código de 6 dígitos.');
                return;
            }
            const response = await confirmCode(
                email as string,
                code,
                flow as ConfirmationFlowType,
            );

            if (flow === 'registerUser' && response.status === 201) {
                router.replace(ROUTES.TABS.INDEX);
            } else if (flow === 'changeDevice' && response.status === 200) {
                setTimeout(() => {
                    router.replace(ROUTES.TABS.INDEX);
                }, 3000);
            }
        } catch (error: any) {
            console.warn('[ConfirmationCode] error', {
                message: error?.message,
                httpStatus: error?.response?.status,
                apiData: error?.response?.data,
            });
            const apiMessage =
                error?.response?.data?.message ||
                (typeof error?.response?.data === 'string' ? error.response.data : null);
            Alert.alert('Error', apiMessage || error?.message || 'Error de conexión');
        }
    };

    const handleResendCode = async () => {
        try {
            await resendCode(
                email as string,
                flow as ConfirmationFlowType
            );
        } catch (error: any) {
        }
    };

    return (
        <>
            {isLoading ? <LoadingScreen /> : (
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

                </ThemedLayout>
            )}
        </>
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
