import React, { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { ConfirmationFlowType, ROUTES } from '@/core/types';
import { useMessageConfig, useThemeColor } from '@/shared/hooks';
import {
    LoadingScreen,
    MessageModal,
    ResendCode,
    ThemedButton,
    ThemedLayout,
    ThemedText,
    VerificationCode,
} from '@/shared/components';
import { useAuth, useOnboarding } from '@/core/context';

export default function ConfirmationCodeScreen() {
    const { email, flow } = useLocalSearchParams<{
        email: string;
        flow: ConfirmationFlowType;
    }>();
    const { confirmCode, resendCode, isLoading } = useAuth();
    const {
        setHasSeenOnboarding,
        setShouldShowOnboarding,
    } = useOnboarding();
    const router = useRouter();
    const themeColors = useThemeColor();
    const [code, setCode] = useState('');
    const [localError, setLocalError] = useState('');

    useMessageConfig([
        '/auth/resend/code',
        '/auth/confirm/registration',
        '/auth/confirm/device/change',
    ]);

    const handleConfirmCode = async () => {
        if (code.length !== 6) {
            setLocalError('Ingresa el código de 6 dígitos.');
            return;
        }

        try {
            const response = await confirmCode(email, code, flow);

            if (
                flow === 'registerUser' &&
                (response.status === 200 || response.status === 201)
            ) {
                const registeredUserId = response.data?.user?.userId;
                await setHasSeenOnboarding(false, registeredUserId);
                setShouldShowOnboarding(true);
                router.replace(ROUTES.TABS.INDEX);
            } else if (flow === 'changeDevice' && response.status === 200) {
                setTimeout(() => {
                    router.replace(ROUTES.TABS.INDEX);
                }, 3000);
            }
        } catch (error: any) {
            // HTTP errors are displayed by the global Moneyfy message provider.
            if (!error?.response) {
                setLocalError(error?.message || 'No fue posible validar el código.');
            }
        }
    };

    const handleResendCode = async () => {
        try {
            await resendCode(email, flow);
        } catch {
            // API errors are displayed by the global Moneyfy message provider.
        }
    };

    return (
        <>
            {isLoading ? (
                <LoadingScreen />
            ) : (
                <ThemedLayout>
                    <View style={styles.pageContainer}>
                        <ThemedText variant="title" textAlign="center" marginBottom={8}>
                            Ingresa el código de confirmación
                        </ThemedText>
                        <ThemedText variant="paragraph" textAlign="center" marginBottom={10}>
                            Un código de 6 dígitos fue enviado a
                        </ThemedText>
                        <ThemedText
                            variant="paragraph"
                            color={themeColors.textColorAccent}
                            textAlign="center"
                            marginBottom={40}
                        >
                            {email}
                        </ThemedText>

                        <VerificationCode onCodeComplete={setCode} />
                    </View>

                    <View style={styles.buttonContainer}>
                        <ResendCode onResend={handleResendCode} />
                        <ThemedButton text="Continuar" onPress={handleConfirmCode} />
                    </View>
                </ThemedLayout>
            )}

            <MessageModal
                isVisible={!!localError}
                onClose={() => setLocalError('')}
                title="Código no válido"
                message={localError}
                icon={{
                    name: 'alert-circle-outline',
                    color: themeColors.status.error,
                }}
                primaryButton={{
                    text: 'Entendido',
                    onPress: () => setLocalError(''),
                }}
            />
        </>
    );
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    buttonContainer: {
        width: '100%',
        marginTop: 24,
    },
});
