import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
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
import { useCardVisibility } from '@/hooks/useCardVisibility';
import { AnimatedCard } from '@/components/AnimatedCard';
import { login } from '@/services/authService';
import { LoadingScreen } from '@/components/LoadingScreen';
import getEnvVars from '../../config';
import axios from 'axios';

const { apiUrl } = getEnvVars();

const { height } = Dimensions.get('window');

export default function LoginScreen() {
    const [isLoading, setIsLoading] = useState(false);
    const { isVisible, showCard, hideCard } = useCardVisibility();
    const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { loginContext } = useAuth();
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isFormValid, setIsFormValid] = useState(false);
    const themeColors = useThemeColor();
    const router = useRouter();
    const [touchedFields, setTouchedFields] = useState({ email: false, password: false });
    const [errorMessage, setErrorMessage] = useState('');
    const [serviceLog, setServiceLog] = useState<string>('');

    useEffect(() => {
        const isValid = validateEmail(email) && validatePassword(password);
        setIsFormValid(isValid);
    }, [email, password]);

    useEffect(() => {
        const testConnection = async () => {
            try {
                const { apiUrl } = getEnvVars();
                setServiceLog(prev => prev + '\nIntentando conexión a: ' + apiUrl);
                
                const response = await axios.post(`${apiUrl}/auth/log-in`, {
                    email: 'alejandro.osses.r@gmail.com',
                    pwd: 'Lololanda'
                });
                
                setServiceLog(prev => prev + '\nRespuesta exitosa: ' + JSON.stringify(response.data));
            } catch (error: any) {
                setServiceLog(prev => {
                    let errorLog = '\n=== Error de Conexión ===';
                    errorLog += '\nTipo de error: ' + (error.name || 'Desconocido');
                    
                    // Información específica de la respuesta del servidor
                    if (error.response) {
                        errorLog += '\nEstado: ' + error.response.status;
                        errorLog += '\nMensaje: ' + JSON.stringify(error.response.data);
                        errorLog += '\nHeaders: ' + JSON.stringify(error.response.headers);
                    }
                    
                    // Información de la solicitud
                    if (error.config) {
                        errorLog += '\nMétodo: ' + error.config.method;
                        errorLog += '\nURL: ' + error.config.url;
                        errorLog += '\nHeaders de solicitud: ' + JSON.stringify(error.config.headers);
                        errorLog += '\nDatos enviados: ' + JSON.stringify(error.config.data);
                    }
                    
                    // Error de red o timeout
                    if (error.code) {
                        errorLog += '\nCódigo de error: ' + error.code;
                    }
                    
                    errorLog += '\nMensaje completo: ' + error.message;
                    
                    return prev + errorLog;
                });
            }
        };
    
        testConnection();
    }, []);

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
            setIsLoading(true);
            const response = await login(email, password);
            if (response && response.data) {
                
                await loginContext(response.data);
                router.replace('/(tabs)');
            } else {
                throw new Error('Respuesta inesperada del servidor');
            }
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
                setErrorMessage(error.response.status + ' ' + error.message);
                setIsErrorModalVisible(true);
            } else if (error.response?.status === 404) {
                setErrorMessage(error.response.status + ' ' + error.message);
                setIsErrorModalVisible(true);
            } else if (error.response?.status === 400) {
                setErrorMessage(error.response.status + ' ' + error.message);
                setIsErrorModalVisible(true);
            } else {
                setErrorMessage(error.response.status + ' ' + error.message);
                setIsErrorModalVisible(true);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ThemedView darkColor={themeColors.backgroundColor} lightColor={themeColors.backgroundColor} style={styles.container}>
            <ThemedView
                style={styles.backgroundTouchable}
            >
                <BackgroundCircles style={styles.backgroundImage} />
            </ThemedView>

            <ThemedView style={styles.logoContainer}>
                <Logo style={styles.loginLogo} width={280} height={60} />
                <ThemedText variant='paragraph' textAlign='center'>
                    API URL: {apiUrl}
                </ThemedText>
                <ScrollView style={styles.logContainer}>
                    <ThemedText variant='paragraph' textAlign='left'>
                        {serviceLog}
                    </ThemedText>
                </ScrollView>
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
                    onPress={showCard}
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

            <AnimatedCard
                isVisible={isVisible}
                hideCard={hideCard}
                style={styles.formContainer}
            >

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

                {/*<ThemedText variant='paragraph' marginBottom={16}>O continua con</ThemedText>

                <ThemedButton
                    text="Google"
                    icon={{ name: 'logo-google', position: 'left' }}
                    size='sm'
                    width='auto'
                    onPress={handleLogin}
                    backgroundColor={themeColors.status.error}
                />*/}
            </AnimatedCard>

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
        maxHeight: 200,
        width: '100%',
        marginVertical: 10,
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 8
    }
});
