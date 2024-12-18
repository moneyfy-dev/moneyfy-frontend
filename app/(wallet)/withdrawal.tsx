import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { ThemedText } from '@/shared/components/ThemedText';
import { useThemeColor } from '@/shared/hooks/useThemeColor';
import { AccountListScreen } from '@/shared/components/AccountListScreen';
import { useAuth } from '@/core/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { TabSelector } from '@/shared/components/TabSelector';
import { AnimatedCard } from '@/shared/components/AnimatedCard';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useCardVisibility } from '@/shared/hooks/useCardVisibility';
import { ThemedView } from '@/shared/components/ThemedView';
import { ThemedLayoutFlatList } from '@/shared/components/ThemedLayoutFlatList';
import { IconContainer } from '@/shared/components/IconContainer';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

type TabType = 'account' | 'history';

type WithdrawalRecord = {
    id: string;
    bank: string;
    accountNumber: string;
    amount: number;
    date: string;
    remaining: number;
};

// Mock data
const mockWithdrawals: WithdrawalRecord[] = [
    {
        id: '1',
        bank: 'Banco Falabella',
        accountNumber: '17286536',
        amount: 45000,
        date: '2024-03-15',
        remaining: 155000
    },
    {
        id: '2',
        bank: 'Banco Falabella',
        accountNumber: '17286536',
        amount: 35000,
        date: '2024-02-15',
        remaining: 200000
    },
    {
        id: '3',
        bank: 'Banco Falabella',
        accountNumber: '17286536',
        amount: 50000,
        date: '2024-01-15',
        remaining: 235000
    },
    {
        id: '4',
        bank: 'Banco Falabella',
        accountNumber: '17286536',
        amount: 40000,
        date: '2023-12-15',
        remaining: 285000
    },
    {
        id: '5',
        bank: 'Banco Estado',
        accountNumber: '23451789',
        amount: 55000,
        date: '2023-11-15',
        remaining: 325000
    }
];

export default function WithdrawalScreen() {
    const themeColors = useThemeColor();
    const { user } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('account');
    const { isVisible, showCard, hideCard } = useCardVisibility();
    const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>(mockWithdrawals);

    const nextPayment = {
        amount: user?.wallet?.availableBalance || 0,
        date: new Date(2024, 3, 15),
    };

    const tabs = [
        { type: 'account', label: 'Cuentas', title: 'Mis Cuentas', icon: 'card-outline' },
        { type: 'history', label: 'Historial', title: 'Mis Pagos', icon: 'time-outline' }
    ];

    const WithdrawalItem = ({ item, index, isLast }: { item: WithdrawalRecord, index: number, isLast: boolean }) => (
        <View style={[styles.withdrawalItem, {
            borderBottomWidth: isLast ? 0 : 1,
            borderBottomColor: themeColors.borderBackgroundColor
        }]}>
            <View style={styles.leftContent}>
                <IconContainer
                    icon="card-outline"
                    size={24}
                    backgroundColor={themeColors.textColorAccent}
                />
                <View>
                    <ThemedText variant="subTitleBold">{item.bank}</ThemedText>
                    <ThemedText variant="paragraph">{item.accountNumber}</ThemedText>
                    <ThemedText variant="paragraph" color={themeColors.textParagraph}>
                        Fecha de retiro: {format(new Date(item.date), 'dd/MM/yyyy')}
                    </ThemedText>
                </View>
            </View>
            <View style={styles.rightContent}>
                <ThemedText variant="subTitleBold" color={themeColors.status.error}>
                    -${item.amount.toLocaleString()}
                </ThemedText>
                <ThemedText variant="paragraph">
                    restante ${item.remaining.toLocaleString()}
                </ThemedText>
            </View>
        </View>
    );


    return (
        <ThemedLayoutFlatList padding={[0, 0]}
        >
            <View style={styles.container}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons
                            name="chevron-back"
                            size={24}
                            color={themeColors.accentInDarkMode}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.headerSection}>
                    <View style={styles.header}>
                        <ThemedText variant="title" color={themeColors.white}>Próximo Pago</ThemedText>
                        <View style={styles.amountContainer}>
                            <View style={styles.inputContainer}>
                                <ThemedText
                                    variant="gigaTitle"
                                    style={[styles.currencySymbol, { color: themeColors.textColorAccent }]}
                                >
                                    $
                                </ThemedText>
                                <ThemedText
                                    variant="gigaTitle"
                                    style={{ color: themeColors.textColorAccent }}
                                >
                                    {nextPayment.amount.toLocaleString('es-CL')}
                                </ThemedText>
                            </View>
                        </View>
                        <ThemedText variant="paragraph" color={themeColors.textParagraph}>
                            {format(nextPayment.date, "d 'de' MMMM, yyyy", { locale: es })}
                        </ThemedText>
                    </View>

                    <ThemedView style={[styles.buttonContainer, { backgroundColor: themeColors.backgroundCardColor }]}>
                        <TouchableOpacity
                            style={styles.detailsButton}
                            onPress={showCard}
                            activeOpacity={0.7}
                        >
                            <ThemedText variant="paragraph">Ver detalles y cuentas</ThemedText>
                            <Ionicons
                                name="chevron-up"
                                size={24}
                                color={themeColors.textColorAccent}
                            />
                        </TouchableOpacity>
                    </ThemedView>
                </View>

            </View>

            <AnimatedCard
                isVisible={isVisible}
                hideCard={hideCard}
                style={styles.formContainer}
                openPercentage={80}
            >
                <View style={styles.cardContent}>
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
                        <FlatList
                            data={withdrawals}
                            renderItem={({ item, index }) => (
                                <WithdrawalItem
                                    item={item}
                                    index={index}
                                    isLast={index === withdrawals.length - 1}
                                />
                            )}
                            keyExtractor={(item) => item.id}
                            style={[styles.list, { borderTopColor: themeColors.borderBackgroundColor }]}
                            contentContainerStyle={styles.listContent}
                        />
                    )}
                </View>
            </AnimatedCard>
        </ThemedLayoutFlatList>
    );
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    container: {
        flex: 1,
        marginBottom: 60,
    },
    formContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 20,
    },
    headerSection: {
        padding: 24,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        gap: 10,
        width: '100%',
        marginBottom: 24,
    },
    amountContainer: {
        marginVertical: 16,
        alignItems: 'center',
        width: '100%',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 80,
    },
    currencySymbol: {
        marginRight: 4,
    },
    buttonContainer: {
        borderRadius: 30,
        paddingVertical: 24,
        paddingHorizontal: 24,
    },
    detailsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    cardContent: {
        flex: 1,
        width: '100%',
    },
    list: {
        flex: 1,
        borderTopWidth: 1,
    },
    listContent: {
        paddingBottom: 16,
    },
    withdrawalItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 16,
    },
    leftContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    rightContent: {
        alignItems: 'flex-end',
        justifyContent: 'center',
    }
});