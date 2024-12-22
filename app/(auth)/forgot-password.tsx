import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ROUTES } from '@/core/types';
import { useThemeColor } from '@/shared/hooks';
import { ThemedLayout, ThemedText, ThemedInput, ThemedButton, MessageModal } from '@/shared/components';
import { validateEmail } from '@/shared/utils/validations';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/core/context';

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [touchedFields, setTouchedFields] = useState({
        email: false,
    });
    const themeColors = useThemeColor();
    const router = useRouter();
    const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { requestPasswordReset } = useAuth();

    const handleEmailChange = (text: string) => {
        setEmail(text);
        setEmailError('');
    };

    const validateField = () => {
        if (!touchedFields.email) return;

        if (!validateEmail(email)) {
            setEmailError('Formato de email inválido');
        } else {
            setEmailError('');
        }
    };

    const handleResetPassword = async () => {
        setTouchedFields({ email: true });
        validateField();

        if (!validateEmail(email)) {
            setErrorMessage('Por favor, ingresa un email válido.');
            setIsErrorModalVisible(true);
            return;
        }

        try {
            const response = await requestPasswordReset(email);
            
            if (response.status === 200) {
                // Navegar a la pantalla de reset con el email
                router.push({
                    pathname: ROUTES.AUTH.RESET_PASSWORD,
                    params: { email }
                });
            }
        } catch (error: any) {
            setErrorMessage(error.message || 'Error al enviar el código de recuperación');
            setIsErrorModalVisible(true);
        }
    };

    return (
        <ThemedLayout>
            <View style={styles.content}>
                <ThemedText variant='title' textAlign='center' marginBottom={4}>
                    Recuperar contraseña
                </ThemedText>
                
                <ThemedText 
                    variant='paragraph' 
                    marginBottom={24}
                    textAlign="center"
                >
                    Ingresa tu correo electrónico y te enviaremos instrucciones para restablecer tu contraseña
                </ThemedText>

                <View style={styles.iconContainer}>
                    <Ionicons
                        name="lock-closed-outline"
                        size={64}
                        color={themeColors.textColorAccent}
                    />
                </View>

                <ThemedInput
                    placeholder="Email"
                    value={email}
                    onChangeText={handleEmailChange}
                    keyboardType="email-address"
                    onBlur={() => {
                        setTouchedFields(prev => ({ ...prev, email: true }));
                        validateField();
                    }}
                    error={emailError}
                />

                <View style={styles.infoContainer}>
                    <Ionicons
                        name="information-circle-outline"
                        size={20}
                        color={themeColors.textParagraph}
                        style={styles.infoIcon}
                    />
                    <ThemedText 
                        variant='paragraph' 
                        color={themeColors.textParagraph}
                        style={styles.infoText}
                    >
                        Te enviaremos un código de verificación a tu correo electrónico para confirmar tu identidad
                    </ThemedText>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <ThemedButton
                    text="Enviar instrucciones"
                    onPress={handleResetPassword}
                    disabled={!email}
                />

                <View style={styles.loginContainer}>
                    <ThemedText variant='paragraph'>¿Recordaste tu contraseña? </ThemedText>
                    <TouchableOpacity onPress={() => router.back()}>
                        <ThemedText variant='textLink'>
                            Volver al login
                        </ThemedText>
                    </TouchableOpacity>
                </View>
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
        </ThemedLayout>
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
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 16,
    },
    infoIcon: {
        marginRight: 8,
        marginTop: 2,
    },
    infoText: {
        flex: 1,
        textAlign: 'left',
    },
    buttonContainer: {
        marginTop: 20,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
    },
}); 