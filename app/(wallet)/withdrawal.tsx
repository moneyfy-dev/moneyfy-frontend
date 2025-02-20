import React, { useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity, Dimensions, FlatList, Animated, View } from 'react-native';
import { useThemeColor } from '@/shared/hooks';
import { ThemedView, ThemedLayoutFlatList, ThemedText, IconContainer, TabSelector, AccountListScreen, AnimatedCard } from '@/shared/components';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import { useUser } from '@/core/context';
import { Ionicons } from '@expo/vector-icons';

const { height: screenHeight } = Dimensions.get('window');

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
    },
    {
        id: '6',
        bank: 'Banco Falabella',
        accountNumber: '17286536',
        amount: 45000,
        date: '2024-03-15',
        remaining: 155000
    },
    {
        id: '7',
        bank: 'Banco Falabella',
        accountNumber: '17286536',
        amount: 35000,
        date: '2024-02-15',
        remaining: 200000
    },
    {
        id: '8',
        bank: 'Banco Falabella',
        accountNumber: '17286536',
        amount: 50000,
        date: '2024-01-15',
        remaining: 235000
    },
    {
        id: '9',
        bank: 'Banco Falabella',
        accountNumber: '17286536',
        amount: 40000,
        date: '2023-12-15',
        remaining: 285000
    },
    {
        id: '10',
        bank: 'Banco Estado',
        accountNumber: '23451789',
        amount: 55000,
        date: '2023-11-15',
        remaining: 325000
    }
];

export default function WithdrawalScreen() {
    const themeColors = useThemeColor();
    const [isFormVisible, setIsFormVisible] = useState(false);
    const { user } = useUser();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('history');
    const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>(mockWithdrawals);
    const formAnimation = useRef(new Animated.Value(screenHeight)).current;

    function calcularProximoPago(): Date {
        const hoy = new Date();
        const diaActual = hoy.getDate();
        const mesActual = hoy.getMonth();
        const añoActual = hoy.getFullYear();

        let mesPago = mesActual;
        let añoPago = añoActual;

        if (diaActual > 15) {
            mesPago += 1;
            if (mesPago > 11) { // Si el mes es diciembre, pasamos al siguiente año
                mesPago = 0;
                añoPago += 1;
            }
        }

        return new Date(añoPago, mesPago, 15);
    }

    const nextPayment = {
        amount: user?.wallet?.availableBalance || 0,
        date: calcularProximoPago(),
    };

    const tabs = [
        { type: 'history', label: 'Últimos', title: 'Pagos', icon: 'time-outline' },
        { type: 'account', label: 'Cuentas', title: 'Mis Cuentas', icon: 'card-outline' },
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
                    backgroundColor={themeColors.buttonBackgroundColor}
                />
                <View>
                    <ThemedText variant="subTitleBold">{item.bank}</ThemedText>
                    <ThemedText variant="paragraph">{item.accountNumber}</ThemedText>
                    <ThemedText variant="paragraph" color={themeColors.textParagraph}>
                        Fecha de pago: {format(new Date(item.date), 'dd/MM/yyyy')}
                    </ThemedText>
                </View>
            </View>
            <View style={styles.rightContent}>
                <ThemedText variant="subTitleBold" color={themeColors.status.error}>
                    -${item.amount.toLocaleString()}
                </ThemedText>
                <ThemedText variant="paragraph">
                    Retenido ${item.remaining.toLocaleString()}
                </ThemedText>
            </View>
        </View>
    );

    const showDetails = () => {
        setIsFormVisible(true);
        Animated.spring(formAnimation, {
            toValue: 0,
            useNativeDriver: true,
        }).start();
    };

    const hideDetails = () => {
        Animated.spring(formAnimation, {
            toValue: screenHeight,
            useNativeDriver: true,
        }).start(() => {
            setIsFormVisible(false);
        });
    };

    return (
        <ThemedLayoutFlatList padding={[0, 0]}
        >
            <ThemedView style={styles.container}>
                <ThemedView style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons
                            name="chevron-back"
                            size={24}
                            color={themeColors.accentInDarkMode}
                        />
                    </TouchableOpacity>
                </ThemedView>

                <TouchableOpacity onPress={hideDetails} activeOpacity={1} style={styles.headerSection}>
                    <ThemedView style={styles.header}>
                        <ThemedText variant="title" textAlign="center" color={themeColors.textColor}>Disponible para el {'\n'}próximo pago</ThemedText>
                        <ThemedView style={styles.amountContainer}>
                            <ThemedView style={styles.inputContainer}>
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
                            </ThemedView>
                        </ThemedView>
                        <ThemedText variant="paragraph" color={themeColors.textParagraph}>
                            El pago se realizará el{' '}
                            <ThemedText variant="paragraph" color={themeColors.textColorAccent}>
                                {format(nextPayment.date, "d 'de' MMMM, yyyy", { locale: es })}
                            </ThemedText>
                        </ThemedText>
                    </ThemedView>
                </TouchableOpacity>
                <ThemedView style={[styles.buttonContainer, { backgroundColor: themeColors.backgroundCardColor }]}>
                    <TouchableOpacity
                        style={styles.detailsButton}
                        onPress={showDetails}
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
                    <TouchableOpacity onPress={hideDetails}>
                        <ThemedView style={[styles.bar, { backgroundColor: themeColors.extremeContrastGray }]} />
                    </TouchableOpacity>

                    <TabSelector
                        tabs={tabs}
                        activeTab={activeTab}
                        onTabChange={(type) => setActiveTab(type as TabType)}
                    />
                    {activeTab === 'account' ? (
                        <View style={styles.accountListContainer}>
                            <AccountListScreen
                                accounts={user?.accounts || []}
                                onSelectAccount={(accountId) => {/* Manejar selección */ }}
                                onAccountUpdated={() => {/* Manejar actualización */ }}
                            />
                        </View>
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
                            scrollEnabled={true}
                        />
                    )}
                </ThemedView>
            </Animated.View>
        </ThemedLayoutFlatList>
    );
}

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    formContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: screenHeight * 0.8,
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
        paddingVertical: 40,
        paddingHorizontal: 24,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        alignItems: 'center',
    },
    detailsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    card: {
        flex: 1,
        paddingBottom: 40,
        paddingTop: 20,
        paddingHorizontal: 24,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        alignItems: 'center',
    },
    list: {
        flex: 1,
        width: '100%',
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
    },
    accountListContainer: {
        flex: 1,
        width: '100%',
        maxHeight: screenHeight * 0.8,
    },
    bar: {
        width: 60,
        height: 8,
        borderRadius: 4,
        marginBottom: 20,
        alignSelf: 'center',
    },
});