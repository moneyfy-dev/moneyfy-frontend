import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Animated, Dimensions, Alert } from 'react-native';
import { Link } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedInput } from '@/components/ThemedInput';
import { useAuth } from '@/context/AuthContext';
import { BackgroundCircles } from '@/components/images/BackgroundCircles';
import { Logo } from '@/components/Logo';
import { validateEmail, validatePassword } from '@/utils/validations';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useRouter } from 'expo-router';
import { ThemedButton } from '@/components/ThemedButton';
import { MessageModal } from '@/components/MessageModal';

const { height } = Dimensions.get('window');

export default function LoginScreen() {
    const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
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
    const [touchedFields, setTouchedFields] = useState({ email: false, password: false });
    const [errorMessage, setErrorMessage] = useState('');

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
        setEmailError('');
    };

    const handlePasswordChange = (text: string) => {
        setPassword(text);
        setPasswordError('');
    };

    const validateField = (field: 'email' | 'password') => {
        if (field === 'email' && touchedFields.email) {
            if (!validateEmail(email)) {
                setEmailError('Email inválido');
            } else {
                setEmailError('');
            }
        }
        if (field === 'password' && touchedFields.password) {
            if (!validatePassword(password)) {
                setPasswordError('La contraseña debe tener al menos 8 caracteres');
            } else {
                setPasswordError('');
            }
        }
    };

    const handleLogin = async () => {
        setTouchedFields({ email: true, password: true });
        validateField('email');
        validateField('password');

        if (!validateEmail(email) || !validatePassword(password)) {
            setErrorMessage('Por favor, corrija los errores en el formulario.');
            setIsErrorModalVisible(true);
            return;
        }

        try {
            const userData = await loginContext(email, password);
            router.replace('/(tabs)');
        } catch (error: any) {
            if (error.response?.status === 226) {
                router.push({
                    pathname: '/confirmation-code',
                    params: {
                        email: email,
                        flow: 'device-change'
                    }
                });
            } else if (error.response?.status === 403) {
                setErrorMessage('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
                setIsErrorModalVisible(true);
            } else {
                setErrorMessage('Hubo un problema con el inicio de sesión. Inténtalo de nuevo.');
                setIsErrorModalVisible(true);
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
                <ThemedText variant='jumboTitle' textAlign='center' marginBottom={16}>Lorem Ipsum Nesum magiore</ThemedText>
                <ThemedText variant='jumboSubTitle' textAlign='center'>Lorem Ipsum Nesum magiore</ThemedText>
            </ThemedView>

            <ThemedView style={[styles.initialContainer, { backgroundColor: themeColors.backgroundCardColor }]}>
                <ThemedButton
                    text="Ingresar"
                    onPress={showLoginForm}
                />
                <ThemedView style={styles.registerContainer}>
                    <ThemedText variant='paragraph'>¿No estás registrado? </ThemedText>
                    <Link href={{ pathname: "/registerScreen" }} asChild>
                        <TouchableOpacity>
                            <ThemedText variant='textLink'>Registrate ahora</ThemedText>
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
                    <ThemedView style={styles.logoContainerCard}>
                        <Logo />
                        <ThemedText variant='superTitle' textAlign='left' marginBottom={24}>Bienvenido</ThemedText>
                    </ThemedView>

                    <ThemedInput
                        placeholder="Usuario o email"
                        value={email}
                        onChangeText={handleEmailChange}
                        onBlur={() => {
                            setTouchedFields(prev => ({ ...prev, email: true }));
                            validateField('email');
                        }}
                        error={emailError}
                    />
                    <ThemedInput
                        placeholder="Contraseña"
                        value={password}
                        onChangeText={handlePasswordChange}
                        onBlur={() => {
                            setTouchedFields(prev => ({ ...prev, password: true }));
                            validateField('password');
                        }}
                        secureTextEntry
                        error={passwordError}
                    />

                    <TouchableOpacity style={styles.forgotPasswordContainer}>
                        <ThemedText variant='textLink' marginBottom={16} linkConfig={{ route: '/forgot-password' }}>¿Olvidaste tu contraseña?</ThemedText>
                    </TouchableOpacity>

                    <ThemedButton
                        text="Ingresar"
                        onPress={handleLogin}
                        disabled={!email || !password}
                    />

                    <ThemedView style={styles.registerContainer}>
                        <ThemedText variant='paragraph'>¿No estás registrado? </ThemedText>
                        <Link href={{ pathname: "/registerScreen" }} asChild>
                            <TouchableOpacity>
                                <ThemedText variant='textLink'>Registrate ahora</ThemedText>
                            </TouchableOpacity>
                        </Link>
                    </ThemedView>

                    <ThemedView style={[styles.divider, { backgroundColor: themeColors.borderBackgroundColor }]} />

                    <ThemedText variant='paragraph' marginBottom={16}>O continua con</ThemedText>

                    <ThemedButton
                        text="Google"
                        icon={{ name: 'logo-google', position: 'left' }}
                        size='sm'
                        width='auto'
                        onPress={handleLogin}
                        backgroundColor={themeColors.status.error}
                    />

                </ThemedView>
            </Animated.View>

            <MessageModal
                isVisible={isErrorModalVisible}
                onClose={() => setIsErrorModalVisible(false)}
                title="Error de inicio de sesión"
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
    forgotPasswordContainer: {
        marginRight: 'auto',
    },
    registerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        backgroundColor: 'transparent',
    },
    divider: {
        height: 1,
        width: '100%',
        marginVertical: 20,
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
    backgroundImageTest: {
        position: 'absolute',
        top: 60,
        left: 60,
        bottom: 0,
    },
    logoContainer: {
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'transparent',
        marginBottom: 24,
    },
    logoContainerCard: {
        width: '100%',
        gap: 16,
        flexDirection: 'column',
        alignItems: 'flex-start',
        backgroundColor: 'transparent',
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
});