import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Animated, TextInput, Dimensions, Alert } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { useAuth } from '@/context/AuthContext';
import { BackgroundCircles } from '@/components/BackgroundCircles';
import { Logo } from '@/components/Logo';
import { login } from '@/services/authService';
import { validateEmail, validatePassword } from '@/utils/validations';

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
    const colorScheme = useColorScheme();
    const [isEmailFocused, setIsEmailFocused] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);

    const getThemeColors = () => {
        return {
            backgroundColor: colorScheme === 'dark' ? '#272727' : '#FFFFFF',
            inputBackground: colorScheme === 'dark' ? '#1C1C1B' : '#FFFFFF',
            borderBackgroundColor: colorScheme === 'dark' ? '#575756' : '#f1f1f1',
            textColor: colorScheme === 'dark' ? '#0FF107' : '#10BF0A',
            inputColor: colorScheme === 'dark' ? '#FFFFFF' : '#1C1C1B',
            disabledColor: colorScheme === 'dark' ? '#999999' : '#E0E0E0',
            focusedBorderColor: colorScheme === 'dark' ? '#0EF205' : '#09A503',
            unfocusedBorderColor: '#BBBBBB',
        };
    };


    const themeColors = getThemeColors();

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
            loginContext(response);
        } catch (error) {
            Alert.alert('Error', 'Hubo un problema con el inicio de sesión. Inténtalo de nuevo.');
        }
    };

    return (
        <ThemedView darkColor="#1C1C1B" lightColor="#FFFFFF" style={styles.container}>
            <TouchableOpacity
                style={styles.backgroundTouchable}
                onPress={hideLoginForm}
                activeOpacity={1}
            >
                <BackgroundCircles style={styles.backgroundImage} />
            </TouchableOpacity>

            <ThemedView style={styles.logoContainer}>
                <Logo style={styles.loginLogo} />
                <ThemedText style={styles.loginTextTitle}>Lorem Ipsum Nesum magiore</ThemedText>
                <ThemedText style={styles.LoginTextParagraph}>Lorem Ipsum Nesum magiore</ThemedText>
            </ThemedView>

            <ThemedView style={[styles.initialContainer, { backgroundColor: themeColors.backgroundColor }]}>
                <TouchableOpacity style={styles.initialLoginButton} onPress={showLoginForm}>
                    <ThemedText style={styles.loginButtonText}>Ingresar</ThemedText>
                </TouchableOpacity>
                <ThemedView style={styles.registerContainer}>
                    <ThemedText style={styles.registerText}>¿No estás registrado? </ThemedText>
                    <Link href={{ pathname: "/registerScreen" }} asChild>
                        <TouchableOpacity>
                            <ThemedText style={[styles.registerLink, { color: themeColors.textColor }]}>Registrate ahora</ThemedText>
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
                <ThemedView style={[styles.card, { backgroundColor: themeColors.backgroundColor }]}>
                    <ThemedView style={styles.logoContainer}>
                        <Logo />
                    </ThemedView>
                    <ThemedText style={styles.welcomeText}>Bienvenido</ThemedText>

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
                            placeholder="Usuario o email"
                            value={email}
                            onChangeText={handleEmailChange}
                            placeholderTextColor="#bbbbbb"
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
                            placeholder="Contraseña"
                            secureTextEntry
                            value={password}
                            onChangeText={handlePasswordChange}
                            placeholderTextColor="#bbbbbb"
                            onFocus={() => setIsPasswordFocused(true)}
                            onBlur={() => setIsPasswordFocused(false)}
                        />
                        <Ionicons name="eye-off-outline" size={16} color="#10BF0A" />
                    </ThemedView>

                    {passwordError ? <ThemedText style={styles.errorText}>{passwordError}</ThemedText> : null}

                    <TouchableOpacity style={styles.forgotPasswordContainer}>
                        <ThemedText style={[styles.forgotPassword, { color: themeColors.textColor }]}>¿Olvidaste tu contraseña?</ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.loginButton, !isFormValid && { backgroundColor: themeColors.disabledColor }]}
                        onPress={handleLogin}
                        disabled={!isFormValid}
                    >
                        <ThemedText style={styles.loginButtonText}>Ingresar</ThemedText>
                    </TouchableOpacity>

                    <ThemedView style={styles.registerContainer}>
                        <ThemedText style={styles.registerText}>¿No estás registrado? </ThemedText>
                        <Link href={{ pathname: "/registerScreen" }} asChild>
                            <TouchableOpacity>
                                <ThemedText style={[styles.registerLink, { color: themeColors.textColor }]}>Registrate ahora</ThemedText>
                            </TouchableOpacity>
                        </Link>
                    </ThemedView>

                    <ThemedView style={[styles.divider, { backgroundColor: themeColors.borderBackgroundColor }]} />

                    <ThemedText style={styles.continueWithText}>O continua con</ThemedText>

                    <TouchableOpacity style={styles.googleButton}>
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
        // Sombra para iOS
        shadowColor: "#000",
        shadowOffset: {
            width: 20,
            height: 20,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        // Sombra para Android
        elevation: 20,
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
        alignItems: 'center',
        // Sombra para iOS
        shadowColor: "#000",
        shadowOffset: {
            width: 20,
            height: 20,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        // Sombra para Android
        elevation: 20,
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
        backgroundColor: '#10BF0A',
        padding: 15,
        borderRadius: 12,
        width: '100%',
        alignItems: 'center',
        marginTop: 20,
    },
    loginButtonText: {
        color: 'white',
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
        color: '#999999',
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
        color: '#999999',
        fontSize: 12,
        marginBottom: 16,
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ED3241',
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
        backgroundColor: '#10BF0A',
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
        color: '#999999',
        fontWeight: '300',
        marginHorizontal: 'auto',
        textAlign: 'center',
        paddingHorizontal: 24,
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