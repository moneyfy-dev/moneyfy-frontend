import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { ThemedListLayout } from '@/components/ThemedListLayout';
import { ThemedInput } from '@/components/ThemedInput';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { IconContainer } from '@/components/IconContainer';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';

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
        bank: 'Banco estado',
        accountNumber: '17286536',
        amount: 32000,
        date: '2024-11-15',
        remaining: 23000
    },
    // Añade más datos mock aquí si necesitas
];

export default function WithdrawalHistory() {
    const themeColors = useThemeColor();
    const [searchQuery, setSearchQuery] = useState('');
    const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>(mockWithdrawals);

    const filterWithdrawals = useCallback((query: string) => {
        const filtered = mockWithdrawals.filter(withdrawal =>
            withdrawal.bank.toLowerCase().includes(query.toLowerCase()) ||
            withdrawal.accountNumber.includes(query)
        );
        setWithdrawals(filtered);
    }, []);

    const handleSearch = (text: string) => {
        setSearchQuery(text);
        filterWithdrawals(text);
    };

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

    const HeaderComponent = (
        <View style={styles.headerContainer}>
            <View style={styles.searchContainer}>
                <ThemedInput
                    type="search"
                    value={searchQuery}
                    onChangeText={handleSearch}
                    placeholder="Buscar por banco"
                    onIconPress={() => console.log('Buscar:', searchQuery)}
                    style={styles.searchInput}
                />
            </View>

            <View style={styles.resultsContainer}>
                <ThemedText variant="paragraph">
                    {withdrawals.length} resultados
                </ThemedText>
                <Pressable>
                    <Ionicons name="menu-outline" size={24} color={themeColors.textColorAccent} />
                </Pressable>
            </View>
        </View>
    );

    return (
        <ThemedListLayout
            padding={[0, 24]}
            headerComponent={HeaderComponent}
        >
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
        </ThemedListLayout>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        paddingHorizontal: 24,
    },
    searchContainer: {
        marginBottom: 16,
    },
    searchInput: {
        flex: 1,
        marginBottom: 0,
    },
    resultsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
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
        padding: 16,
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