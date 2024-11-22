import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Alert } from 'react-native';
import { ThemedLayout } from '@/components/ThemedLayout';
import { ThemedText } from '@/components/ThemedText';
import { ThemedInput } from '@/components/ThemedInput';
import { validateEmail } from '@/utils/validations';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useRouter } from 'expo-router';
import { ThemedButton } from '@/components/ThemedButton';
import { Ionicons } from '@expo/vector-icons';

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [touchedFields, setTouchedFields] = useState({
        email: false,
    });
    const themeColors = useThemeColor();
    const router = useRouter();

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
            Alert.alert('Error', 'Por favor, ingresa un email válido.');
            return;
        }

        // Aquí irá la lógica de recuperación de contraseña
    };

    return (
        <ThemedLayout>
            <View style={styles.content}>
                <ThemedText variant='title' marginBottom={4}>
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
                        name="lock-open-outline"
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
        </ThemedLayout>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: 32,
        alignItems: 'center',
    },
    infoContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 16,
        paddingHorizontal: 16,
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