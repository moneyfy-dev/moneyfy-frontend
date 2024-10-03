import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedLayout } from '@/components/ThemedLayout';
import { ThemedText } from '@/components/ThemedText';
import { ThemedInput } from '@/components/ThemedInput';
import { register } from '@/services/authService';
import { validateEmail, validatePassword, validateName } from '@/utils/validations';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useRouter, Href } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { ThemedButton } from '@/components/ThemedButton';

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
    const router = useRouter();
    const { login: loginContext, setTempEmail } = useAuth();

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
            setTempEmail(email); // Establece el email temporalmente
            Alert.alert('Éxito', response.message);
            router.replace('/confirmation-code' as Href<string>);
        } catch (error: any) {
            console.error('Error en el registro:', error);
            if (error.response && error.response.status === 406) {
                Alert.alert('Error', 'Datos no aceptables. Por favor, verifica la información ingresada.');
            } else {
                Alert.alert('Error', 'Hubo un problema con el registro. Inténtalo de nuevo.');
            }
        }
    };

    return (
        <ThemedLayout>
                    <View style={styles.content}>
                        <ThemedText variant='title' marginBottom={4}>Registrarse</ThemedText>
                        <ThemedText variant='paragraph' marginBottom={24}>Crea una cuenta y comienza a vender ahora</ThemedText>

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
                            <ThemedText variant='paragraph' style={styles.termsText}>
                                He leído y estoy de acuerdo con los{' '}
                                <ThemedText variant='textLink'>
                                    Términos y condiciones
                                </ThemedText>{' '}
                                y la{' '}
                                <ThemedText variant='textLink'>
                                    Política de privacidad
                                </ThemedText>
                                .
                            </ThemedText>
                        </View>
                    </View>

                    <View style={styles.buttonContainer}>
                        <ThemedButton
                            text="Crear cuenta"
                            onPress={handleRegister}
                            disabled={!isFormValid}
                        />

                        <View style={styles.loginContainer}>
                            <ThemedText variant='paragraph'>¿Ya tienes cuenta? </ThemedText>
                            <Link href="/login" asChild>
                                <TouchableOpacity>
                                    <ThemedText variant='textLink'>
                                        Inicia sesión ahora
                                    </ThemedText>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>
        </ThemedLayout>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    buttonContainer: {
        marginTop: 20,
    },
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    termsText: {
        flex: 1,
        marginLeft: 12,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
    },
});