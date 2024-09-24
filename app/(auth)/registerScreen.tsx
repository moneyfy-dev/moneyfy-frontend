import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Alert } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedInput } from '@/components/ThemedInput';
import { register } from '@/services/authService';
import { validateEmail, validatePassword, validateName } from '@/utils/validations';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function RegisterScreen() {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nombreError, setNombreError] = useState('');
    const [apellidoError, setApellidoError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const themeColors = useThemeColor();

    useEffect(() => {
        const isValid = validateName(nombre) && validateName(apellido) &&
            validateEmail(email) && validatePassword(password) &&
            password === confirmPassword && termsAccepted;
        setIsFormValid(isValid);
    }, [nombre, apellido, email, password, confirmPassword, termsAccepted]);

    const handleNombreChange = (text: string) => {
        setNombre(text);
        if (!validateName(text)) {
            setNombreError('El nombre debe tener al menos 2 letras');
        } else {
            setNombreError('');
        }
    };

    const handleApellidoChange = (text: string) => {
        setApellido(text);
        if (!validateName(text)) {
            setApellidoError('El apellido debe tener al menos 2 letras');
        } else {
            setApellidoError('');
        }
    };

    const handleEmailChange = (text: string) => {
        setEmail(text);
        if (!validateEmail(text)) {
            setEmailError('Formato de email inválido');
        } else {
            setEmailError('');
        }
    };

    const handlePasswordChange = (text: string) => {
        setPassword(text);
        if (!validatePassword(text)) {
            setPasswordError('La contraseña debe tener al menos 8 caracteres');
        } else {
            setPasswordError('');
        }
    };

    const handleConfirmPasswordChange = (text: string) => {
        setConfirmPassword(text);
        if (text !== password) {
            setConfirmPasswordError('Las contraseñas no coinciden');
        } else {
            setConfirmPasswordError('');
        }
    };

    const handleRegister = async () => {
        if (!isFormValid) {
            Alert.alert('Error', 'Por favor, corrija los errores en el formulario.');
            return;
        }

        try {
            const response = await register(nombre, apellido, email, password);
            console.log('Registro exitoso:', response);
            // Navegar a la pantalla de verificación de código o a la pantalla de inicio de sesión
        } catch (error) {
            Alert.alert('Error', 'Hubo un problema con el registro. Inténtalo de nuevo.');
        }
    };

    return (
        <ThemedView darkColor={themeColors.backgroundColor} lightColor={themeColors.backgroundColor} style={styles.container}>
            <ThemedText style={[styles.title, { color: themeColors.textColor }]}>Registrarse</ThemedText>
            <ThemedText style={[styles.subtitle, { color: themeColors.textParagraph }]}>Crea una cuenta y comienza a vender ahora</ThemedText>

            <ThemedInput
                placeholder="Nombre"
                value={nombre}
                onChangeText={handleNombreChange}
                error={nombreError}
            />
            <ThemedInput
                placeholder="Apellido"
                value={apellido}
                onChangeText={handleApellidoChange}
                error={apellidoError}
            />
            <ThemedInput
                placeholder="Email"
                value={email}
                onChangeText={handleEmailChange}
                keyboardType="email-address"
                error={emailError}
            />
            <ThemedInput
                placeholder="Crear contraseña"
                value={password}
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

            <View style={styles.termsContainer}>
                <TouchableOpacity onPress={() => setTermsAccepted(!termsAccepted)}>
                    <Ionicons
                        name={termsAccepted ? "checkbox-outline" : "square-outline"}
                        size={24}
                        color={themeColors.textColorAccent}
                    />
                </TouchableOpacity>
                <ThemedText style={[styles.termsText, { color: themeColors.textParagraph }]}>
                    He leído y estoy de acuerdo con los{' '}
                    <ThemedText style={[styles.termsLink, { color: themeColors.textColorAccent }]}>
                        Términos y condiciones
                    </ThemedText>{' '}
                    y la{' '}
                    <ThemedText style={[styles.termsLink, { color: themeColors.textColorAccent }]}>
                        Política de privacidad
                    </ThemedText>
                    .
                </ThemedText>
            </View>

            <ThemedView style={styles.registerContainer}>

                <TouchableOpacity
                    style={[styles.registerButton, !isFormValid && { backgroundColor: themeColors.disabledColor }]}
                    onPress={handleRegister}
                    disabled={!isFormValid}
                >
                    <ThemedText style={styles.registerButtonText}>Crear cuenta</ThemedText>
                </TouchableOpacity>

                <View style={styles.loginContainer}>
                    <ThemedText style={[styles.loginText, { color: themeColors.textParagraph }]}>¿Ya tienes cuenta? </ThemedText>
                    <Link href="/login" asChild>
                        <TouchableOpacity>
                            <ThemedText style={[styles.loginLink, { color: themeColors.textColorAccent }]}>
                                Inicia sesión ahora
                            </ThemedText>
                        </TouchableOpacity>
                    </Link>
                </View>
            </ThemedView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 68,
        paddingBottom: 24,
        justifyContent: 'flex-start',
    },
    registerContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'transparent',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 12,
        marginBottom: 20,
    },
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    termsText: {
        marginLeft: 10,
        fontSize: 12,
        lineHeight: 16,
        flex: 1,
    },
    termsLink: {
        fontSize: 12,
        lineHeight: 16,
        fontWeight: 'semibold',
    },
    registerButton: {
        backgroundColor: '#10BF0A',
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    registerButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'semibold',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    loginText: {
        fontSize: 12,
        fontWeight: 'regular',
    },
    loginLink: {
        fontSize: 12,
        fontWeight: 'semibold',
    },
});