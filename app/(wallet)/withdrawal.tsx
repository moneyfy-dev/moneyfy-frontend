import React, { useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity, Dimensions, Animated, View } from 'react-native';
import { useThemeColor } from '@/shared/hooks';
import { ThemedView, ThemedLayoutFlatList, ThemedText, TabSelector, AccountListScreen, PaymentHistory } from '@/shared/components';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import { useUser } from '@/core/context';
import { Ionicons } from '@expo/vector-icons';

const { height: screenHeight } = Dimensions.get('window');

type TabType = 'account' | 'history';

export default function WithdrawalScreen() {
    const themeColors = useThemeColor();
    const [isFormVisible, setIsFormVisible] = useState(false);
    const { user } = useUser();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('history');
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
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
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
                        <PaymentHistory horizontalPadding={0} />
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
    backButton: {
        paddingVertical: 12,
        paddingRight: 24
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
        paddingVertical: 28,
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
        paddingVertical: 12,
    },
    card: {
        flex: 1,
        paddingBottom: 40,
        paddingHorizontal: 24,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        alignItems: 'center',
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
        marginBottom: 30,
        marginTop: 10,
        alignSelf: 'center',
    },
});
