import React, { useState, useEffect } from 'react';
import { useRouter, Link } from 'expo-router';
import { RegisterRequest, ROUTES } from '@/core/types';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useThemeColor } from '@/shared/hooks';
import { ThemedLayout, ThemedText, ThemedInput, ThemedButton, MessageModal } from '@/shared/components';
import { authService } from '@/core/services';
import { validateEmail, validatePassword, validateName, sanitizeName } from '@/shared/utils/validations';
import { Ionicons } from '@expo/vector-icons';

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
    const [touchedFields, setTouchedFields] = useState({
        nombre: false,
        apellido: false,
        email: false,
        password: false,
        confirmPassword: false
    });
    const [referralCode, setReferralCode] = useState('');
    const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const isValid = validateName(nombre) && validateName(apellido) &&
            validateEmail(email) && validatePassword(password) &&
            password === confirmPassword && termsAccepted;
        setIsFormValid(isValid);
    }, [nombre, apellido, email, password, confirmPassword, termsAccepted]);

    const handleNombreChange = (text: string) => {
        setNombre(text);
        setNombreError('');
    };

    const handleApellidoChange = (text: string) => {
        setApellido(text);
        setApellidoError('');
    };

    const handleEmailChange = (text: string) => {
        setEmail(text);
        setEmailError('');
    };

    const handlePasswordChange = (text: string) => {
        setPassword(text);
        setPasswordError('');
    };

    const handleConfirmPasswordChange = (text: string) => {
        setConfirmPassword(text);
        setConfirmPasswordError('');
    };

    const validateField = (field: keyof typeof touchedFields) => {
        if (!touchedFields[field]) return;

        switch (field) {
            case 'nombre':
            case 'apellido':
                const sanitizedName = sanitizeName(field === 'nombre' ? nombre : apellido);
                if (!validateName(sanitizedName)) {
                    const errorMessage = sanitizedName.length < 2
                        ? `El ${field} debe tener al menos 2 letras`
                        : `El ${field} solo puede contener letras y espacios`;
                    field === 'nombre' ? setNombreError(errorMessage) : setApellidoError(errorMessage);
                } else {
                    field === 'nombre' ? setNombreError('') : setApellidoError('');
                }
                break;
            case 'email':
                if (!validateEmail(email)) {
                    setEmailError('Formato de email inválido');
                } else {
                    setEmailError('');
                }
                break;
            case 'password':
                if (!validatePassword(password)) {
                    setPasswordError('La contraseña debe tener al menos 8 caracteres');
                } else {
                    setPasswordError('');
                }
                break;
            case 'confirmPassword':
                if (password !== confirmPassword) {
                    setConfirmPasswordError('Las contraseñas no coinciden');
                } else {
                    setConfirmPasswordError('');
                }
                break;
        }
    };

    const handleRegister = async () => {
        setTouchedFields({
            nombre: true,
            apellido: true,
            email: true,
            password: true,
            confirmPassword: true
        });

        Object.keys(touchedFields).forEach(field => validateField(field as keyof typeof touchedFields));

        const sanitizedNombre = sanitizeName(nombre);
        const sanitizedApellido = sanitizeName(apellido);

        if (!validateName(sanitizedNombre) || !validateName(sanitizedApellido) || !validateEmail(email) || !validatePassword(password) || password !== confirmPassword || !termsAccepted) {
            setErrorMessage('Por favor, corrija los errores en el formulario.');
            setIsErrorModalVisible(true);
            return;
        }

        try {
            const formData: RegisterRequest = {
                name: sanitizedNombre,
                surname: sanitizedApellido,
                email: email.trim(),
                pwd: password,
                codeToRefer: referralCode.trim() || undefined
            };

            const response = await authService.register(formData);
            
            if (response.status === 200) {
                router.push({
                    pathname: ROUTES.AUTH.CONFIRMATION,
                    params: { 
                        email: email,
                        flow: 'registerUser'
                    }
                });
            }
        } catch (error: any) {
            console.error('Error en el registro:', error);
            setErrorMessage(error.message || 'Error en el registro');
            setIsErrorModalVisible(true);
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
                    onBlur={() => {
                        setTouchedFields(prev => ({ ...prev, nombre: true }));
                        validateField('nombre');
                    }}
                    error={nombreError}
                />
                <ThemedInput
                    placeholder="Apellido"
                    value={apellido}
                    onChangeText={handleApellidoChange}
                    onBlur={() => {
                        setTouchedFields(prev => ({ ...prev, apellido: true }));
                        validateField('apellido');
                    }}
                    error={apellidoError}
                />
                <ThemedInput
                    placeholder="Email"
                    value={email}
                    onChangeText={handleEmailChange}
                    keyboardType="email-address"
                    onBlur={() => {
                        setTouchedFields(prev => ({ ...prev, email: true }));
                        validateField('email');
                    }}
                    error={emailError}
                />
                <ThemedInput
                    placeholder="Crear contraseña"
                    value={password}
                    onChangeText={handlePasswordChange}
                    secureTextEntry
                    onBlur={() => {
                        setTouchedFields(prev => ({ ...prev, password: true }));
                        validateField('password');
                    }}
                    error={passwordError}
                />
                <ThemedInput
                    placeholder="Confirmar contraseña"
                    value={confirmPassword}
                    onChangeText={handleConfirmPasswordChange}
                    secureTextEntry
                    onBlur={() => {
                        setTouchedFields(prev => ({ ...prev, confirmPassword: true }));
                        validateField('confirmPassword');
                    }}
                    error={confirmPasswordError}
                />

                <View style={styles.referralContainer}>
                    <ThemedInput
                        label="¿Tienes un código de referido?"
                        placeholder="Ingresa el código aquí"
                        value={referralCode}
                        onChangeText={setReferralCode}
                    />
                </View>

                <View style={styles.termsContainer}>
                    <TouchableOpacity onPress={() => setTermsAccepted(!termsAccepted)}>
                        <Ionicons
                            name={termsAccepted ? "checkbox-outline" : "square-outline"}
                            size={24}
                            color={themeColors.textColorAccent}
                        />
                    </TouchableOpacity>
                    <ThemedText variant='paragraph' style={styles.termsText}>
                        He leído y estoy de acuerdo con los{'\n'}
                        <ThemedText variant='textLink' style={{ lineHeight: 12, paddingTop: 28, height: 50 }} linkConfig={{ route: ROUTES.LEGAL.TERMS }}>
                            Términos y condiciones
                        </ThemedText>{' '}
                        y la{' '}
                        <ThemedText variant='textLink' style={{ lineHeight: 12, paddingTop: 28, height: 50 }} linkConfig={{ route: ROUTES.LEGAL.PRIVACY_POLICY }}>
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
                    disabled={!nombre || !apellido || !email || !password || !confirmPassword || !termsAccepted}
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
    buttonContainer: {
        marginTop: 20,
    },
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    termsText: {
        lineHeight: 18,
        marginLeft: 12,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
    },
    referralContainer: {
        marginTop: 16,
        marginBottom: 8,
    },
    referralText: {
        marginBottom: 8,
    },
});