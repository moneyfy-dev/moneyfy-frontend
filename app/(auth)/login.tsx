import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Animated, Dimensions, Alert } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedInput } from '@/components/ThemedInput';
import { useAuth } from '@/context/AuthContext';
import { BackgroundCircles } from '@/components/BackgroundCircles';
import { Logo } from '@/components/Logo';
import { login } from '@/services/authService';
import { validateEmail, validatePassword } from '@/utils/validations';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useRouter } from 'expo-router';

const { height } = Dimensions.get('window');

export default function LoginScreen() {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login: loginContext } = useAuth();
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const formAnimation = useRef(new Animated.Value(height)).current;
    const themeColors = useThemeColor();
    const router = useRouter();

    const showLoginForm = () => {
        setIsFormVisible(true);
        Animated.spring(formAnimation, {
            toValue: 0,
            useNativeDriver: true,
        }).start();
    };

    const hideLoginForm = () => {
        Animated.spring(formAnimation, {
            toValue: height,
            useNativeDriver: true,
        }).start(() => {
            setIsFormVisible(false);
        });
    };

    useEffect(() => {
        const isValid = validateEmail(email) && validatePassword(password);
        setIsFormValid(isValid);
    }, [email, password]);

    const handleEmailChange = (text: string) => {
        setEmail(text);
        if (!validateEmail(text)) {
            setEmailError('Email inválido');
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

    const handleLogin = async () => {
        if (!isFormValid) {
            Alert.alert('Error', 'Por favor, corrija los errores en el formulario.');
            return;
        }

        try {
            const response = await login(email, password);
            console.log('Inicio de sesión exitoso:', response);
            await loginContext(response);
            Alert.alert('Éxito', response.message);
            router.replace('/(tabs)');
        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                Alert.alert('Error', 'Credenciales incorrectas. Por favor, inténtalo de nuevo.');
            } else {
                Alert.alert('Error', 'Hubo un problema con el inicio de sesión. Inténtalo de nuevo.');
            }
        }
    };

    return (
        <ThemedView darkColor={themeColors.backgroundColor} lightColor={themeColors.backgroundColor} style={styles.container}>
            <TouchableOpacity
                style={styles.backgroundTouchable}
                onPress={hideLoginForm}
                activeOpacity={1}
            >
                <BackgroundCircles style={styles.backgroundImage} />
            </TouchableOpacity>

            <ThemedView style={styles.logoContainer}>
                <Logo style={styles.loginLogo} />
                <ThemedText style={[styles.loginTextTitle, { color: themeColors.textColor }]}>Lorem Ipsum Nesum magiore</ThemedText>
                <ThemedText style={[styles.LoginTextParagraph, { color: themeColors.textParagraph }]}>Lorem Ipsum Nesum magiore</ThemedText>
            </ThemedView>

            <ThemedView style={[styles.initialContainer, { backgroundColor: themeColors.backgroundCardColor }]}>
                <TouchableOpacity style={[styles.initialLoginButton, { backgroundColor: themeColors.buttonBackgroundColor }]} onPress={showLoginForm}>
                    <ThemedText style={[styles.loginButtonText, { color: themeColors.buttonTextColor }]}>Ingresar</ThemedText>
                </TouchableOpacity>
                <ThemedView style={styles.registerContainer}>
                    <ThemedText style={[styles.registerText, { color: themeColors.textParagraph }]}>¿No estás registrado? </ThemedText>
                    <Link href={{ pathname: "/registerScreen" }} asChild>
                        <TouchableOpacity>
                            <ThemedText style={[styles.registerLink, { color: themeColors.textColorAccent }]}>Registrate ahora</ThemedText>
                        </TouchableOpacity>
                    </Link>
                </ThemedView>
            </ThemedView>

            <Animated.View
                style={[
                    styles.formContainer,
                    {
                        transform: [{ translateY: formAnimation }]
                    }
                ]}
            >
                <ThemedView style={[styles.card, { backgroundColor: themeColors.backgroundCardColor }]}>
                    <ThemedView style={styles.logoContainer}>
                        <Logo />
                    </ThemedView>
                    <ThemedText style={[styles.welcomeText, { color: themeColors.textColor }]}>Bienvenido</ThemedText>

                    <ThemedInput
                        placeholder="Usuario o email"
                        value={email}
                        onChangeText={handleEmailChange}
                        error={emailError}
                    />
                    <ThemedInput
                        placeholder="Contraseña"
                        value={password}
                        onChangeText={handlePasswordChange}
                        secureTextEntry
                        error={passwordError}
                    />

                    <TouchableOpacity style={styles.forgotPasswordContainer}>
                        <ThemedText style={[styles.forgotPassword, { color: themeColors.textColorAccent }]}>¿Olvidaste tu contraseña?</ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.loginButton, !isFormValid ? { backgroundColor: themeColors.disabledColor } : { backgroundColor: themeColors.buttonBackgroundColor }]}
                        onPress={handleLogin}
                        disabled={!isFormValid}
                    >
                        <ThemedText style={[styles.loginButtonText, { color: themeColors.buttonTextColor }]}>Ingresar</ThemedText>
                    </TouchableOpacity>

                    <ThemedView style={styles.registerContainer}>
                        <ThemedText style={[styles.registerText, { color: themeColors.textParagraph }]}>¿No estás registrado? </ThemedText>
                        <Link href={{ pathname: "/registerScreen" }} asChild>
                            <TouchableOpacity>
                                <ThemedText style={[styles.registerLink, { color: themeColors.textColorAccent }]}>Registrate ahora</ThemedText>
                            </TouchableOpacity>
                        </Link>
                    </ThemedView>

                    <ThemedView style={[styles.divider, { backgroundColor: themeColors.borderBackgroundColor }]} />

                    <ThemedText style={[styles.continueWithText, { color: themeColors.textParagraph }]}>O continua con</ThemedText>

                    <TouchableOpacity style={[styles.googleButton, { backgroundColor: themeColors.status.error }]}>
                        <Ionicons name="logo-google" size={12} color="#fff" />
                        <ThemedText style={styles.googleButtonText}>Google</ThemedText>
                    </TouchableOpacity>

                </ThemedView>
            </Animated.View>

        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    initialContainer: {
        paddingVertical: 40,
        paddingHorizontal: 24,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        alignItems: 'center',
    },
    formContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
    },
    card: {
        paddingVertical: 40,
        paddingHorizontal: 24,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        alignItems: 'center'
    },
    cardTitle: {
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginTop: 16,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
    },
    input: {
        flex: 1,
        paddingVertical: 12,
    },
    loginButton: {
        padding: 15,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
        marginTop: 20,
    },
    loginButtonText: {
        fontWeight: 'semibold',
        fontSize: 12,
    },
    forgotPasswordContainer: {
        marginRight: 'auto',
    },
    forgotPassword: {
        alignSelf: 'flex-start',
        marginBottom: 16,
        fontSize: 12,
        fontWeight: 'semibold',
    },
    registerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        backgroundColor: 'transparent',
    },
    registerText: {
        fontSize: 12,
    },
    registerLink: {
        fontSize: 12,
    },
    divider: {
        height: 1,
        width: '100%',
        marginVertical: 20,
    },
    continueWithText: {
        fontSize: 12,
        marginBottom: 16,
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 50,
    },
    googleButtonText: {
        color: '#fff',
        marginLeft: 8,
        fontSize: 12,
    },
    backgroundImage: {
        position: 'absolute',
        top: 60,
        left: -60,
        bottom: 0,
    },
    logoContainer: {
        paddingBottom: 20,
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 24,
        marginRight: 'auto',
        backgroundColor: 'transparent',
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        marginRight: 'auto',
    },
    initialLoginButton: {
        padding: 15,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
    },
    backgroundTouchable: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    loginLogo: {
        marginBottom: 24,
    },
    loginTextTitle: {
        fontSize: 36,
        lineHeight: 40,
        fontWeight: 'bold',
        marginBottom: 20,
        marginHorizontal: 'auto',
        textAlign: 'center',
        paddingHorizontal: 24,
    },
    LoginTextParagraph: {
        fontSize: 20,
        fontWeight: '300',
        marginHorizontal: 'auto',
        textAlign: 'center',
        paddingHorizontal: 24,
    },
});