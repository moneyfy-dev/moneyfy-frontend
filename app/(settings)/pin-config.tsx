import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert, Animated } from 'react-native';
import { ThemedLayout } from '@/components/ThemedLayout';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { sha256 } from 'js-sha256';
import { ThemedButton } from '@/components/ThemedButton';

const PIN_LENGTH = 4;
const PIN_KEY = 'user_pin_set';

export default function SetPinScreen() {
    const [pin, setPin] = useState<string>('');
    const [confirmPin, setConfirmPin] = useState<string>('');
    const [stage, setStage] = useState<'verify' | 'set' | 'confirm' | 'success'>('verify');
    const [error, setError] = useState<string>('');
    const [pinExists, setPinExists] = useState<boolean>(false);

    const themeColors = useThemeColor();
    const router = useRouter();

    useEffect(() => {
        checkExistingPin();
    }, []);

    useEffect(() => {
        console.log('Current stage:', stage);
    }, [stage]);

    const checkExistingPin = async () => {
        const exists = await SecureStore.getItemAsync(PIN_KEY);
        setPinExists(!!exists);
        setStage(exists ? 'verify' : 'set');
    };

    const handleNumberPress = useCallback((number: string) => {
        setError('');
        if (stage === 'set' || stage === 'verify') {
            setPin(prev => prev.length < PIN_LENGTH ? prev + number : prev);
        } else if (stage === 'confirm') {
            setConfirmPin(prev => prev.length < PIN_LENGTH ? prev + number : prev);
        }
    }, [stage]);

    const handleDelete = useCallback(() => {
        if (stage === 'set' || stage === 'verify') {
            setPin(prev => prev.slice(0, -1));
        } else if (stage === 'confirm') {
            setConfirmPin(prev => prev.slice(0, -1));
        }
    }, [stage]);

    useEffect(() => {
        if (pin.length === PIN_LENGTH) {
            if (stage === 'verify') {
                verifyExistingPin();
            } else if (stage === 'set') {
                setStage('confirm');
                setConfirmPin('');
            }
        }
    }, [pin, stage]);

    useEffect(() => {
        if (confirmPin.length === PIN_LENGTH && stage === 'confirm') {
            validatePin();
        }
    }, [confirmPin, stage]);

    const verifyExistingPin = async () => {
        const isCorrect = await verifyPinWithBackend(pin);
        if (isCorrect) {
            setStage('set');
            setPin('');
            setError('');
        } else {
            setError('PIN incorrecto. Intente de nuevo.');
            setPin('');
        }
    };

    const validatePin = () => {
        if (pin === confirmPin) {
            savePinToBackend(pin);
        } else {
            setError('Los PINs no coinciden. Intente de nuevo.');
            setStage('set');
            setPin('');
            setConfirmPin('');
        }
    };

    const savePinToBackend = async (newPin: string) => {
        try {
            const pinHash = sha256(newPin);
            await savePinHashToBackend(pinHash);
            await SecureStore.setItemAsync(PIN_KEY, 'true');
            console.log('Setting stage to success');
            setStage('success');
        } catch (error) {
            console.error('Error al guardar el PIN:', error);
            setError('Hubo un error al guardar el PIN. Intente de nuevo.');
        }
    };

    // Funciones simuladas para interactuar con el backend
    const verifyPinWithBackend = async (pin: string): Promise<boolean> => {
        return new Promise(resolve => setTimeout(() => resolve(true), 1000));
    };

    const savePinHashToBackend = async (pinHash: string): Promise<void> => {
        return new Promise(resolve => setTimeout(resolve, 1000));
    };

    const renderPinDots = () => {
        const currentPin = stage === 'confirm' ? confirmPin : pin;
        return (
            <View style={styles.pinContainer}>
                {[...Array(PIN_LENGTH)].map((_, index) => (
                    <View 
                        key={index} 
                        style={[
                            styles.pinDot, 
                            { backgroundColor: index < currentPin.length ? themeColors.textColorAccent : themeColors.unfocusedBorderColor }
                        ]} 
                    />
                ))}
            </View>
        );
    };

    const renderNumberPad = () => {
        const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'delete'];
        return (
            <View style={styles.numberPad}>
                {numbers.map((number, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.numberButton}
                        onPress={() => number === 'delete' ? handleDelete() : handleNumberPress(number)}
                        disabled={number === ''}
                    >
                        {number === 'delete' ? (
                            <Ionicons name="backspace-outline" size={24} color={themeColors.textColorAccent} />
                        ) : (
                            <ThemedText variant="jumboTitle">{number}</ThemedText>
                        )}
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    const SuccessAnimation = () => {
        const scaleValue = new Animated.Value(0);
        
        useEffect(() => {
            Animated.spring(scaleValue, {
                toValue: 1,
                friction: 5,
                useNativeDriver: true,
            }).start();
        }, []);

        return (
            <Animated.View style={[styles.successCircle, { transform: [{ scale: scaleValue }] }]}>
                <Ionicons name="checkmark" size={80} color={themeColors.extremeContrastGray} />
            </Animated.View>
        );
    };

    if (stage === 'success') {
        return (
            <ThemedLayout padding={[40, 40]}>
                <SuccessAnimation />
                <ThemedText variant="title" textAlign="center">
                    PIN configurado exitosamente
                </ThemedText>
                <ThemedButton
                    text="Volver"
                    onPress={() => router.back()}
                    style={styles.backButton}
                />
            </ThemedLayout>
        );
    }

    return (
        <ThemedLayout padding={[40, 40]}>
            <ThemedText variant="title" textAlign="center">
                {stage === 'verify' ? 'Ingrese su PIN actual' :
                 stage === 'set' ? 'Establezca su nuevo PIN' : 'Confirme su nuevo PIN'}
            </ThemedText>
            {renderPinDots()}
            {error ? <ThemedText variant="paragraph" color={themeColors.status.error} textAlign="center">{error}</ThemedText> : null}
            {renderNumberPad()}
        </ThemedLayout>
    );
}

const styles = StyleSheet.create({
    pinContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 40,
    },
    pinDot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginHorizontal: 10,
    },
    numberPad: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    numberButton: {
        width: '33%',
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    successContainer: {
        flex: 1,
        gap: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    successCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#4CAF50', // Color verde, puedes ajustarlo según tu tema
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButton: {
        marginTop: 24,
    },
});