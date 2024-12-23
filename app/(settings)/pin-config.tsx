import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedLayout, ThemedText, PinInput, MessageModal, LottieAnimation, ThemedButton } from '@/shared/components';
import { useThemeColor } from '@/shared/hooks';
import { storage } from '@/shared/utils/storage';
import { STORAGE_KEYS } from '@/core/types';

const PIN_KEY = STORAGE_KEYS.AUTH.PIN;
const PIN_LENGTH = 4;

export default function PinConfigScreen() {
    const router = useRouter();
    const themeColors = useThemeColor();
    const [pin, setPin] = useState<string>('');
    const [confirmPin, setConfirmPin] = useState<string>('');
    const [stage, setStage] = useState<'verify' | 'set' | 'confirm' | 'success'>('verify');
    const [error, setError] = useState<string>('');
    const [isErrorVisible, setIsErrorVisible] = useState(false);

    useEffect(() => {
        checkExistingPin();
    }, []);

    const checkExistingPin = async () => {
        const existingPin = await storage.getSecure(PIN_KEY);
        setStage(existingPin ? 'verify' : 'set');
    };

    const handleNumberPress = (number: string) => {
        setError('');
        if (stage === 'set' || stage === 'verify') {
            setPin(prev => prev.length < PIN_LENGTH ? prev + number : prev);
        } else if (stage === 'confirm') {
            setConfirmPin(prev => prev.length < PIN_LENGTH ? prev + number : prev);
        }
    };

    const handleDelete = () => {
        if (stage === 'set' || stage === 'verify') {
            setPin(prev => prev.slice(0, -1));
        } else if (stage === 'confirm') {
            setConfirmPin(prev => prev.slice(0, -1));
        }
    };

    useEffect(() => {
        const verifyPin = async () => {
            if (pin.length === PIN_LENGTH) {
                if (stage === 'verify') {
                    const storedPin = await storage.getSecure(PIN_KEY);
                    if (pin === storedPin) {
                        setStage('set');
                        setPin('');
                    } else {
                        setError('PIN incorrecto');
                        setIsErrorVisible(true);
                        setPin('');
                    }
                } else if (stage === 'set') {
                    setStage('confirm');
                }
            }
        };
        verifyPin();
    }, [pin, stage]);

    useEffect(() => {
        const confirmPinInput = async () => {
            if (confirmPin.length === PIN_LENGTH && stage === 'confirm') {
                if (pin === confirmPin) {
                    try {
                        await storage.setSecure(PIN_KEY, pin);
                        setStage('success');
                    } catch (error) {
                        setError('Error al guardar el PIN');
                        setIsErrorVisible(true);
                    }
                } else {
                    setError('Los PINs no coinciden');
                    setIsErrorVisible(true);
                    setStage('set');
                    setPin('');
                    setConfirmPin('');
                }
            }
        };
        confirmPinInput();
    }, [confirmPin, pin, stage]);

    if (stage === 'success') {
        return (
            <ThemedLayout padding={[40, 40]}>
                <View style={styles.successContainer}>
                    <LottieAnimation 
                        style={styles.successCircle} 
                        name="Success" 
                        loop={false} 
                    />
                    <ThemedText variant="title" textAlign="center">
                        PIN configurado exitosamente
                    </ThemedText>
                    <ThemedButton
                        text="Volver"
                        onPress={() => router.back()}
                        style={styles.backButton}
                    />
                </View>
            </ThemedLayout>
        );
    }

    return (
        <ThemedLayout padding={[40, 40]}>
            <ThemedText variant="title" textAlign="center" marginBottom={20}>
                {stage === 'verify' ? 'Ingrese su PIN actual' :
                 stage === 'set' ? 'Establezca su nuevo PIN' : 
                 'Confirme su nuevo PIN'}
            </ThemedText>

            <PinInput
                value={stage === 'confirm' ? confirmPin : pin}
                maxLength={PIN_LENGTH}
                onNumberPress={handleNumberPress}
                onDelete={handleDelete}
            />

            <MessageModal
                isVisible={isErrorVisible}
                onClose={() => setIsErrorVisible(false)}
                title="Error"
                message={error}
                icon={{
                    name: "alert-circle-outline",
                    color: themeColors.status.error
                }}
                primaryButton={{
                    text: "Entendido",
                    onPress: () => setIsErrorVisible(false)
                }}
            />
        </ThemedLayout>
    );
}

const styles = StyleSheet.create({
    successContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 40,
    },
    successCircle: {
        width: 260,
        height: 260,
    },
    backButton: {
        marginTop: 24,
    },
});