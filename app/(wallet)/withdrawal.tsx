import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { ThemedLayout } from '@/components/ThemedLayout';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { AccountListScreen } from '@/components/AccountListScreen';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { TabSelector } from '@/components/TabSelector';
import WithdrawalHistory from '@/app/(wallet)/withdrawal-history';
import { ThemedButton } from '@/components/ThemedButton';

type TabType = 'account' | 'history';

export default function WithdrawalScreen() {
    const [rawAmount, setRawAmount] = useState('');
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState<TabType>('account');
    const themeColors = useThemeColor();
    const { user } = useAuth();
    const router = useRouter();

    const tabs = [
        { type: 'account', label: 'Seleccionar', title: 'Cuenta', icon: 'card-outline' },
        { type: 'history', label: 'Historial', title: 'Retiros', icon: 'time-outline' }
    ];

    const availableBalance = user?.wallet?.availableBalance || 0;
    const MAX_DIGITS = 9; // Máximo 999,999,999

    const handleAmountChange = (value: string) => {
        // Remover todos los caracteres no numéricos
        const cleanValue = value.replace(/[^0-9]/g, '');
        
        // Verificar que no exceda el límite de dígitos
        if (cleanValue.length > MAX_DIGITS) return;
        
        // Actualizar el valor raw
        setRawAmount(cleanValue);

        // Validar el monto
        const numericAmount = parseInt(cleanValue) || 0;
        if (numericAmount > availableBalance) {
            setError('El monto supera tu saldo disponible');
        } else {
            setError('');
        }
    };

    const formatDisplayAmount = (value: string): string => {
        if (!value) return '0';
        return parseInt(value).toLocaleString('es-CL');
    };

    const handleWithdrawal = () => {
        if (error) return;
        console.log('Monto a retirar:', parseInt(rawAmount));
    };

    return (
        <ThemedLayout
            variant="card"
            gradientColors={[Colors.common.green3, Colors.common.green5]}
        >
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={24} color={themeColors.accentInDarkMode} />
                    </TouchableOpacity>
                </View>

                <View style={styles.headerSection}>
                    <View style={styles.header}>
                        <ThemedText variant="title">¿Cuánto deseas retirar?</ThemedText>
                        <View style={styles.amountContainer}>
                            <View style={styles.inputContainer}>
                                <ThemedText
                                    variant="superTitle"
                                    style={[styles.currencySymbol, { color: themeColors.textColorAccent }]}
                                >
                                    $
                                </ThemedText>
                                <TextInput
                                    value={formatDisplayAmount(rawAmount)}
                                    onChangeText={handleAmountChange}
                                    keyboardType="numeric"
                                    style={[
                                        styles.amountInput,
                                        { color: themeColors.textColorAccent }
                                    ]}
                                    placeholder="0"
                                    placeholderTextColor={themeColors.textColorAccent}
                                    maxLength={12} // Considerando los puntos del formato
                                    selectTextOnFocus={true} // Selecciona todo el texto al hacer focus
                                />
                            </View>
                            {error && (
                                <ThemedText
                                    variant="paragraph"
                                    style={styles.errorText}
                                    color={Colors.status.error}
                                >
                                    {error}
                                </ThemedText>
                            )}
                        </View>
                        <ThemedText variant="paragraph" color={themeColors.textColor}>
                            Disponible para retiro ${availableBalance.toLocaleString('es-CL')}
                        </ThemedText>
                    </View>

                    <ThemedButton
                        text="Siguiente"
                        onPress={handleWithdrawal}
                        style={styles.nextButton}
                        disabled={!rawAmount || parseInt(rawAmount) === 0 || !!error}
                    />
                </View>

                <View style={[styles.cardContainer, { backgroundColor: themeColors.backgroundCardColor }]}>
                    <TabSelector
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabChange={(type) => setActiveTab(type as TabType)}
                    />

                    {activeTab === 'account' ? (
                        <AccountListScreen
                            accounts={user?.accounts || []}
                            onSelectAccount={(accountId) => {/* Manejar selección */}}
                            onAccountUpdated={() => {/* Manejar actualización */}}
                        />
                    ) : (
                        <WithdrawalHistory />
                    )}
                </View>
            </View>
        </ThemedLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerSection: {
        padding: 24,
        flex: 0.6,
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
        width: '100%',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 20,
    },
    cardContainer: {
        flex: 0.4,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 24,
    },
    amountContainer: {
        marginVertical: 16,
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 80,
        paddingHorizontal: 20,
    },
    currencySymbol: {
        fontSize: 48,
        lineHeight: 56,
        marginRight: 4,
    },
    amountInput: {
        fontSize: 48,
        lineHeight: 56,
        minWidth: 200,
        maxWidth: '80%',
        textAlign: 'center',
        padding: 0,
        includeFontPadding: false,
        textAlignVertical: 'center',
    },
    errorText: {
        marginTop: 8,
        textAlign: 'center',
    },
    nextButton: {
        marginTop: 20,
        padding: 16,
        borderRadius: 12,
        width: '100%',
    },
});