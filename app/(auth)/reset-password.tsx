import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ROUTES } from '@/core/types';
import { useMessageConfig, useThemeColor } from '@/shared/hooks';
import { ThemedLayout, ThemedText, ThemedInput, ThemedButton, ResendCode, LoadingScreen } from '@/shared/components';
import { VerificationCode } from '@/shared/components';
import { useAuth } from '@/core/context';
import { validatePassword, getPasswordErrors } from '@/shared/utils/validations';
import { Ionicons } from '@expo/vector-icons';

export default function ResetPasswordScreen() {
    const { email } = useLocalSearchParams();
    const { confirmPasswordReset, resendCode, isLoading } = useAuth();
    const router = useRouter();
    const themeColors = useThemeColor();
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    useMessageConfig(['/auth/resend/code', '/auth/confirm/password/reset']);

    const handlePasswordChange = (text: string) => {
        setNewPassword(text);
        setPasswordError('');
    };

    const handleConfirmPasswordChange = (text: string) => {
        setConfirmPassword(text);
        setConfirmPasswordError('');
    };

    const handleResendCode = async () => {
        try {
            await resendCode(email as string, 'restorePassword');

        } catch (error: any) {
        }
    };

    const validateFields = () => {
        let isValid = true;

        if (!validatePassword(newPassword)) {
            const errors = getPasswordErrors(newPassword);
            setPasswordError(`La contraseña debe contener ${errors.join(', ')}`);
            isValid = false;
        }

        if (newPassword !== confirmPassword) {
            setConfirmPasswordError('Las contraseñas no coinciden');
            isValid = false;
        }

        return isValid;
    };

    const handleSubmit = async () => {
        if (!validateFields()) return;

        try {
            await confirmPasswordReset(
                email as string,
                code,
                newPassword,
                confirmPassword
            );

            router.replace(ROUTES.TABS.INDEX);
        } catch (error: any) {
        }
    };

    return (
        <>
            {isLoading ? <LoadingScreen /> : (
                <ThemedLayout>
                    <View style={styles.content}>
                        <ThemedText variant="title" textAlign='center' marginBottom={4}>
                            Restablecer contraseña
                        </ThemedText>

                        <ThemedText variant="paragraph" textAlign='center' marginBottom={24}>
                            Ingresa el código de verificación enviado a
                        </ThemedText>

                        <ThemedText variant="paragraph" style={{ color: themeColors.textColorAccent }} textAlign='center' marginBottom={40}>
                            {email}
                        </ThemedText>

                        <View style={styles.iconContainer}>
                            <Ionicons
                                name="lock-open-outline"
                                size={64}
                                color={themeColors.textColorAccent}
                            />
                        </View>

                        <VerificationCode onCodeComplete={setCode} />

                        <View style={styles.passwordContainer}>
                            <ThemedInput
                                placeholder="Nueva contraseña"
                                value={newPassword}
                                onChangeText={handlePasswordChange}
                                secureTextEntry
                                error={passwordError}
                            />

                            <ThemedInput
                                placeholder="Confirmar contraseña"
                                value={confirmPassword}
                                onChangeText={handleConfirmPasswordChange}
                                secureTextEntry
                                error={confirmPasswordError}
                            />
                        </View>

                    </View>

                    <View style={styles.buttonContainer}>
                        <ResendCode onResend={handleResendCode} />
                        <ThemedButton
                            text="Restablecer contraseña"
                            onPress={handleSubmit}
                            disabled={!code || !newPassword || !confirmPassword}
                        />
                        <View style={styles.restorePasswordContainer}>
                            <TouchableOpacity onPress={() => router.back()}>
                                <ThemedText variant='textLink'>
                                    Volver atrás
                                </ThemedText>
                            </TouchableOpacity>
                        </View>
                    </View>

                </ThemedLayout>
            )}
        </>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    iconContainer: {
        marginBottom: 32,
        alignItems: 'center',
    },
    passwordContainer: {
        marginTop: 24,
        marginBottom: 32,
    },
    buttonContainer: {
        width: '100%',
        marginTop: 24,
    },
    restorePasswordContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
}); 