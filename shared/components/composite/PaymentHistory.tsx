import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Payment } from '@/core/types';
import { userService } from '@/core/services';
import { useThemeColor } from '@/shared/hooks';
import { IconContainer } from '../ui/IconContainer';
import { ThemedInput } from '../ui/ThemedInput';
import { ThemedText } from '../ui/ThemedText';

interface PaymentHistoryProps {
    horizontalPadding?: number;
}

const formatPaymentDate = (value: string) => {
    try {
        return format(parseISO(value), "d 'de' MMMM, yyyy", { locale: es });
    } catch {
        return value;
    }
};

export function PaymentHistory({ horizontalPadding = 24 }: PaymentHistoryProps) {
    const themeColors = useThemeColor();
    const [searchQuery, setSearchQuery] = useState('');
    const [payments, setPayments] = useState<Payment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState('');

    useEffect(() => {
        const loadPayments = async () => {
            try {
                const response = await userService.getPayments();
                const userPayments = response.data?.userPayments ?? [];

                setPayments(
                    [...userPayments].sort((a, b) =>
                        (b.createdDate || b.paymentDate).localeCompare(a.createdDate || a.paymentDate)
                    )
                );
            } catch {
                setLoadError('No fue posible cargar el historial de pagos.');
            } finally {
                setIsLoading(false);
            }
        };

        void loadPayments();
    }, []);

    const filteredPayments = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        if (!query) {
            return payments;
        }

        return payments.filter((payment) =>
            payment.account?.bank?.toLowerCase().includes(query) ||
            payment.account?.accountNumber?.includes(query) ||
            payment.paymentId?.toLowerCase().includes(query)
        );
    }, [payments, searchQuery]);

    if (isLoading) {
        return (
            <View style={styles.loadingState}>
                <ActivityIndicator size="large" color={themeColors.textColorAccent} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={{ paddingHorizontal: horizontalPadding }}>
                <ThemedInput
                    type="search"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Buscar por banco o cuenta"
                />
                <ThemedText variant="paragraph" marginBottom={16}>
                    {filteredPayments.length} pagos
                </ThemedText>
            </View>

            {loadError || filteredPayments.length === 0 ? (
                <View style={[styles.emptyState, { paddingHorizontal: horizontalPadding + 8 }]}>
                    <IconContainer
                        icon={loadError ? 'alert-circle-outline' : 'receipt-outline'}
                        size={28}
                        backgroundColor={themeColors.extremeContrastGray}
                        style={styles.emptyStateIcon}
                    />
                    <ThemedText variant="subTitle" textAlign="center">
                        {loadError ? 'Historial no disponible' : 'Aún no tienes pagos registrados'}
                    </ThemedText>
                    <ThemedText
                        variant="paragraph"
                        textAlign="center"
                        color={themeColors.textParagraph}
                    >
                        {loadError || 'Los pagos aparecerán aquí cuando las comisiones aprobadas sean procesadas.'}
                    </ThemedText>
                </View>
            ) : (
                <FlatList
                    data={filteredPayments}
                    keyExtractor={(item) => item.paymentId}
                    style={[
                        styles.list,
                        {
                            borderTopColor: themeColors.borderBackgroundColor,
                            marginHorizontal: horizontalPadding,
                        },
                    ]}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item, index }) => (
                        <View
                            style={[
                                styles.paymentItem,
                                {
                                    borderBottomWidth: index === filteredPayments.length - 1 ? 0 : 1,
                                    borderBottomColor: themeColors.borderBackgroundColor,
                                },
                            ]}
                        >
                            <View style={styles.paymentMain}>
                                <IconContainer
                                    icon="card-outline"
                                    size={24}
                                    backgroundColor={themeColors.textColorAccent}
                                />
                                <View style={styles.paymentInfo}>
                                    <ThemedText variant="subTitleBold">
                                        {item.account?.bank || 'Cuenta bancaria'}
                                    </ThemedText>
                                    <ThemedText variant="paragraph">
                                        {item.account?.accountType} {item.account?.accountNumber}
                                    </ThemedText>
                                    <ThemedText variant="notes" color={themeColors.textParagraph}>
                                        Pagado el {formatPaymentDate(item.paymentDate)}
                                    </ThemedText>
                                    <ThemedText variant="notes" color={themeColors.textParagraph}>
                                        {item.transactionIds?.length ?? 0} comisiones incluidas
                                    </ThemedText>
                                </View>
                            </View>
                            <ThemedText variant="subTitleBold" color={themeColors.textColorAccent}>
                                ${item.payment.toLocaleString('es-CL')}
                            </ThemedText>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    loadingState: {
        flex: 1,
        minHeight: 240,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyState: {
        flex: 1,
        minHeight: 320,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    emptyStateIcon: {
        width: 56,
        height: 56,
        alignSelf: 'center',
        borderRadius: 14,
    },
    list: {
        flex: 1,
        borderTopWidth: 1,
    },
    listContent: {
        paddingBottom: 24,
    },
    paymentItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 16,
        paddingVertical: 16,
    },
    paymentMain: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    paymentInfo: {
        flex: 1,
        gap: 2,
    },
});
