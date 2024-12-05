import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedLayout } from '@/components/ThemedLayout';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { AccountListScreen } from '@/components/AccountListScreen';
import { useAuth } from '@/context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { TabSelector } from '@/components/TabSelector';
import WithdrawalHistory  from '@/app/(withdrawal)/withdrawal-history';
import { ThemedButton } from '@/components/ThemedButton';

type TabType = 'account' | 'history';

export default function WithdrawalTest() {
    const [amount, setAmount] = useState('40.000');
    const [activeTab, setActiveTab] = useState<TabType>('account');
    const themeColors = useThemeColor();
    const { user } = useAuth();
    const router = useRouter();

    const tabs = [
        { type: 'account', label: 'Seleccionar', title: 'Cuenta', icon: 'card-outline' },
        { type: 'history', label: 'Historial', title: 'Retiros', icon: 'time-outline' }
    ];

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
                        <ThemedText variant="title">Cuanto deseas retirar?</ThemedText>
                        <ThemedText
                            variant="superTitle"
                            style={[styles.amountInput, { color: themeColors.textColorAccent }]}
                        >
                            ${amount}
                        </ThemedText>
                        <ThemedText variant="paragraph" color={themeColors.textColor}>
                            Disponible para retiro $72.000
                        </ThemedText>
                    </View>

                    <ThemedButton
                        text="Siguiente"
                        onPress={() => {/* Manejar siguiente */ }}
                        style={styles.nextButton}
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
                            onSelectAccount={(accountId) => {/* Manejar selección */ }}
                            onAccountUpdated={() => {/* Manejar actualización */ }}
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
        flex: 0.3,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
        width: '100%',
        position: 'relative',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 20,
    },
    cardContainer: {
        flex: 0.7,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 24,
    },
    amountInput: {
        fontSize: 48,
        lineHeight: 56,
        marginVertical: 16,
    },
    nextButton: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    tabContainer: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 24,
    },
    tabButton: {
        flex: 1,
    },
    tabButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        gap: 12,
    },
    tabButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        gap: 12,
    },
    tabIcon: {
        borderRadius: 8,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backButton: {
        position: 'absolute',
        left: 0,
        top: 0,
        padding: 8,
    },
});