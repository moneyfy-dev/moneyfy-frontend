import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Dimensions, ScrollView, Animated } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { ROUTES, User } from '@/core/types';
import { ThemedView, ThemedText, ThemedInput, ThemedButton, MessageModal, Logo, BackgroundCircles, LoadingScreen } from '@/shared/components';
import { validateEmail, validatePassword } from '@/shared/utils/validations';
import { useThemeColor, useCardVisibility } from '@/shared/hooks';
import { useAuth } from '@/core/context';
import { AnimatedCard } from '@/shared/components/composite/AnimatedCard';

const { height } = Dimensions.get('window');

export default function LoginScreen() {
    const [isLoading, setIsLoading] = useState(false);
    const themeColors = useThemeColor();
    //const { isVisible, showCard, hideCard } = useCardVisibility();
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const formAnimation = useRef(new Animated.Value(height)).current;
    const [touchedFields, setTouchedFields] = useState({ email: false, password: false });
    const [errorMessage, setErrorMessage] = useState('');

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
            setEmailError(validateEmail(email) ? '' : 'Email inválido');
        }
        if (field === 'password' && touchedFields.password) {
            setPasswordError(validatePassword(password) ? '' : 'La contraseña debe tener al menos 8 caracteres');
        }
    };

    const handleLogin = async () => {
        try {
            setTouchedFields({ email: true, password: true });
            validateField('email');
            validateField('password');

            if (!validateEmail(email) || !validatePassword(password)) {
                setErrorMessage('Por favor, corrija los errores en el formulario.');
                setIsErrorModalVisible(true);
                return;
            }

            setIsLoading(true);
            
            await login(email, password);
        } catch (error: any) {
                setErrorMessage('Por favor, verifica tus credenciales');
                setIsErrorModalVisible(true);
        } finally {
            setIsLoading(false);
        }
    };

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
                <Logo style={styles.loginLogo} width={280} height={60} />
                <ThemedText variant='jumboTitle' textAlign='center' marginBottom={16}>
                    Transforma tus redes en ingresos
                </ThemedText>
                <ThemedText variant='jumboSubTitle' textAlign='center'>
                    Comparte, recomienda y genera lucas con
                    <ThemedText variant='jumboSubTitle' style={{ color: themeColors.textColorAccent }}> MoneyFy </ThemedText>
                </ThemedText>
            </ThemedView>

            <ThemedView style={[styles.initialContainer, { backgroundColor: themeColors.backgroundCardColor }]}>
                <ThemedButton
                    text="Ingresar"
                    onPress={showLoginForm}
                />
                <ThemedView style={styles.registerContainer}>
                    <ThemedText variant='paragraph'>¿No estás registrado? </ThemedText>
                    <Link href={{ pathname: ROUTES.AUTH.REGISTER }} asChild>
                        <TouchableOpacity>
                            <ThemedText variant='textLink'>Registrate ahora</ThemedText>
                        </TouchableOpacity>
                    </Link>
                </ThemedView>
            </ThemedView>

            {/*<AnimatedCard
                isVisible={isVisible}
                hideCard={hideCard}
                style={styles.formContainer}
            >*/}
            <Animated.View
                style={[
                    styles.formContainer,
                    {
                        transform: [{ translateY: formAnimation }]
                    }
                ]}
            >
                <ScrollView contentContainerStyle={[styles.card, { backgroundColor: themeColors.backgroundCardColor }]}>
                    <ThemedView style={styles.logoContainerCard}>
                        <ThemedText variant='superTitle' textAlign='left'>
                            <ThemedText variant='superTitle' style={{ color: themeColors.textColorAccent }}>B</ThemedText>
                            ienvenido a
                        </ThemedText>
                        <Logo width={200} height={48} />
                    </ThemedView>

                    <ThemedView style={styles.inputContainer}>
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
                    </ThemedView>

                    <TouchableOpacity style={styles.forgotPasswordContainer}>
                        <ThemedText variant='textLink' marginBottom={16} linkConfig={{ route: ROUTES.AUTH.FORGOT_PASSWORD }}>¿Olvidaste tu contraseña?</ThemedText>
                    </TouchableOpacity>

                    <ThemedButton
                        text="Ingresar"
                        onPress={handleLogin}
                        disabled={!email || !password}
                    />

                    <ThemedView style={styles.registerContainer}>
                        <ThemedText variant='paragraph'>¿No estás registrado? </ThemedText>
                        <Link href={{ pathname: ROUTES.AUTH.REGISTER }} asChild>
                            <TouchableOpacity>
                                <ThemedText variant='textLink'>Registrate ahora</ThemedText>
                            </TouchableOpacity>
                        </Link>
                    </ThemedView>

                    <ThemedView style={[styles.divider, { backgroundColor: themeColors.borderBackgroundColor }]} />

                    {/*<ThemedText variant='paragraph' marginBottom={16}>O continua con</ThemedText>

                <ThemedButton
                    text="Google"
                    icon={{ name: 'logo-google', position: 'left' }}
                    size='sm'
                    width='auto'
                    onPress={handleLogin}
                    backgroundColor={themeColors.status.error}
                />*/}
                </ScrollView>
                </Animated.View>
            {/*</AnimatedCard>*/}

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

            {isLoading && <LoadingScreen />}
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
        flex: 1,
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
        width: '100%',
        backgroundColor: 'transparent',
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
        alignSelf: 'center',
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
        top: -93,
        left: -93,
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
        paddingHorizontal: 24,
    },
    logoContainerCard: {
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'transparent',
        marginBottom: 40,
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
        marginBottom: 64,
    },
    logContainer: {
        height: 300,
        width: '100%',
        marginVertical: 10,
        paddingVertical: 0,
        paddingHorizontal: 10,
        backgroundColor: '#ffffff',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd'
    }
});
