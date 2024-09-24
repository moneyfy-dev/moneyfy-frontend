import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, TextInput, Dimensions, View, Alert } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { register } from '@/services/authService';
import { validateEmail, validatePassword, validateName } from '@/utils/validations';

const { width } = Dimensions.get('window');

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
    const [isNombreFocused, setIsNombreFocused] = useState(false);
    const [isApellidoFocused, setIsApellidoFocused] = useState(false);
    const [isEmailFocused, setIsEmailFocused] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] = useState(false);
    const colorScheme = useColorScheme();

    const getThemeColors = () => {
        return {
            backgroundColor: colorScheme === 'dark' ? '#272727' : '#FFFFFF',
            textColor: colorScheme === 'dark' ? '#0FF107' : '#10BF0A',
            inputBackground: colorScheme === 'dark' ? '#1C1C1B' : '#FFFFFF',
            inputColor: colorScheme === 'dark' ? '#FFFFFF' : '#1C1C1B',
            disabledColor: colorScheme === 'dark' ? '#999999' : '#E0E0E0',
            focusedBorderColor: colorScheme === 'dark' ? '#0EF205' : '#09A503',
            unfocusedBorderColor: '#BBBBBB',
        };
    };

    const themeColors = getThemeColors();

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
        <ThemedView darkColor="#1C1C1B" lightColor="#FFFFFF" style={styles.container}>
            <ThemedText style={styles.title}>Registrarse</ThemedText>
            <ThemedText style={styles.subtitle}>Crea una cuenta y comienza a vender ahora</ThemedText>

            <ThemedView
            style={[
                styles.inputContainer,
                {
                    backgroundColor: themeColors.inputBackground,
                    borderColor: isNombreFocused ? themeColors.focusedBorderColor : themeColors.unfocusedBorderColor
                }]}
            >
                <TextInput
                    style={[styles.input, { color: themeColors.inputColor }]}
                    placeholder="Nombre"
                    value={nombre}
                    onChangeText={handleNombreChange}
                    placeholderTextColor="#999999"
                    onFocus={() => setIsNombreFocused(true)}
                    onBlur={() => setIsNombreFocused(false)}
                />
            </ThemedView>
            {nombreError ? <ThemedText style={styles.errorText}>{nombreError}</ThemedText> : null}

            <ThemedView
                style={[
                    styles.inputContainer,
                    {
                        backgroundColor: themeColors.inputBackground,
                        borderColor: isApellidoFocused ? themeColors.focusedBorderColor : themeColors.unfocusedBorderColor
                    }
                ]}
            >
                <TextInput
                    style={[styles.input, { color: themeColors.inputColor }]}
                    placeholder="Apellido"
                    value={apellido}
                    onChangeText={handleApellidoChange}
                    placeholderTextColor="#999999"
                    onFocus={() => setIsApellidoFocused(true)}
                    onBlur={() => setIsApellidoFocused(false)}
                />
            </ThemedView>

            {apellidoError ? <ThemedText style={styles.errorText}>{apellidoError}</ThemedText> : null}

            <ThemedView
                style={[
                    styles.inputContainer,
                    {
                        backgroundColor: themeColors.inputBackground,
                        borderColor: isEmailFocused ? themeColors.focusedBorderColor : themeColors.unfocusedBorderColor
                    }
                ]}
            >
                <TextInput
                    style={[styles.input, { color: themeColors.inputColor }]}
                    placeholder="Email"
                    value={email}
                    onChangeText={handleEmailChange}
                    keyboardType="email-address"
                    placeholderTextColor="#999999"
                    onFocus={() => setIsEmailFocused(true)}
                    onBlur={() => setIsEmailFocused(false)}
                />
            </ThemedView>

            {emailError ? <ThemedText style={styles.errorText}>{emailError}</ThemedText> : null}

            <ThemedView
                style={[
                    styles.inputContainer,
                    {
                        backgroundColor: themeColors.inputBackground,
                        borderColor: isPasswordFocused ? themeColors.focusedBorderColor : themeColors.unfocusedBorderColor
                    }
                ]}
            >
                <TextInput
                    style={[styles.input, { color: themeColors.inputColor }]}
                    placeholder="Crear contraseña"
                    value={password}
                    onChangeText={handlePasswordChange}
                    secureTextEntry
                    placeholderTextColor="#999999"
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                />
                <Ionicons name="eye-off-outline" size={16} color="#10BF0A" />
            </ThemedView>

            {passwordError ? <ThemedText style={styles.errorText}>{passwordError}</ThemedText> : null}

            <ThemedView
                style={[
                    styles.inputContainer,
                    {
                        backgroundColor: themeColors.inputBackground,
                        borderColor: isConfirmPasswordFocused ? themeColors.focusedBorderColor : themeColors.unfocusedBorderColor
                    }
                ]}
            >
                <TextInput
                    style={[styles.input, { color: themeColors.inputColor }]}
                    placeholder="Confirmar contraseña"
                    value={confirmPassword}
                    onChangeText={handleConfirmPasswordChange}
                    secureTextEntry
                    placeholderTextColor="#999999"
                    onFocus={() => setIsConfirmPasswordFocused(true)}
                    onBlur={() => setIsConfirmPasswordFocused(false)}
                />
                <Ionicons name="eye-off-outline" size={16} color="#10BF0A" />
            </ThemedView>

            {confirmPasswordError ? <ThemedText style={styles.errorText}>{confirmPasswordError}</ThemedText> : null}

            <View style={styles.termsContainer}>
                <TouchableOpacity onPress={() => setTermsAccepted(!termsAccepted)}>
                    <Ionicons
                        name={termsAccepted ? "checkbox-outline" : "square-outline"}
                        size={24}
                        color={themeColors.textColor}
                    />
                </TouchableOpacity>
                <ThemedText style={styles.termsText}>
                    He leído y estoy de acuerdo con los{' '}
                    <ThemedText style={[styles.termsLink, { color: themeColors.textColor }]}>
                        Términos y condiciones
                    </ThemedText>{' '}
                    y la{' '}
                    <ThemedText style={[styles.termsLink, { color: themeColors.textColor }]}>
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
                    <ThemedText style={styles.loginText}>¿Ya tienes cuenta? </ThemedText>
                    <Link href="/login" asChild>
                        <TouchableOpacity>
                            <ThemedText style={[styles.loginLink, { color: themeColors.textColor }]}>
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
        color: '#999999',
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginTop: 16,
        borderWidth: 1,
        borderColor: '#BBBBBB',
        borderRadius: 12,
        paddingHorizontal: 16,
    },
    input: {
        flex: 1,
        paddingVertical: 12,
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
    errorText: {
        width: '100%',
        color: '#ED3241',
        fontSize: 12,
        lineHeight: 16,
        marginTop: 5,
        textAlign: 'left',
    },
});