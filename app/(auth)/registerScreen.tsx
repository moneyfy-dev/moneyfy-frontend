import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, TextInput, Dimensions, View } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

const { width } = Dimensions.get('window');

export default function RegisterScreen() {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const colorScheme = useColorScheme();

    const getThemeColors = () => {
        return {
            backgroundColor: colorScheme === 'dark' ? '#272727' : '#FFFFFF',
            textColor: colorScheme === 'dark' ? '#0FF107' : '#10BF0A',
            inputBackground: colorScheme === 'dark' ? '#1C1C1B' : '#FFFFFF',
        };
    };

    const themeColors = getThemeColors();

    const handleRegister = () => {
        // Implementar lógica de registro aquí
        console.log('Registro iniciado');
    };

    return (
        <ThemedView darkColor="#1C1C1B" lightColor="#FFFFFF" style={styles.container}>
            <ThemedText style={styles.title}>Registrarse</ThemedText>
            <ThemedText style={styles.subtitle}>Crea una cuenta y comienza a vender ahora</ThemedText>

            <ThemedView style={[styles.inputContainer, { backgroundColor: themeColors.inputBackground }]}>
                <TextInput
                    style={styles.input}
                    placeholder="Nombre"
                    value={nombre}
                    onChangeText={setNombre}
                    placeholderTextColor="#999999"
                />
            </ThemedView>

            <ThemedView style={[styles.inputContainer, { backgroundColor: themeColors.inputBackground }]}>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    placeholderTextColor="#999999"
                />
            </ThemedView>

            <ThemedView style={[styles.inputContainer, { backgroundColor: themeColors.inputBackground }]}>
                <TextInput
                    style={styles.input}
                    placeholder="Crear contraseña"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholderTextColor="#999999"
                />
                <Ionicons name="eye-off-outline" size={16} color="#10BF0A" />
            </ThemedView>

            <ThemedView style={[styles.inputContainer, { backgroundColor: themeColors.inputBackground }]}>
                <TextInput
                    style={styles.input}
                    placeholder="Confirmar contraseña"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    placeholderTextColor="#999999"
                />
                <Ionicons name="eye-off-outline" size={16} color="#10BF0A" />
            </ThemedView>

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
                    style={styles.registerButton}
                    onPress={handleRegister}
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
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#BBBBBB',
        borderRadius: 12,
        paddingHorizontal: 16,
    },
    input: {
        flex: 1,
        color: '#fff',
        paddingVertical: 12,
    },
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
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