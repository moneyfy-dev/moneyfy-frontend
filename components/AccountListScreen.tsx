import React from 'react';
import { StyleSheet, TouchableOpacity, View, FlatList } from 'react-native';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { Account } from '@/types/useAccounts';

interface AccountListScreenProps {
    accounts: Account[];
    onSelectAccount: (accountId: string) => void;
}

export function AccountListScreen({ accounts, onSelectAccount }: AccountListScreenProps) {
    const themeColors = useThemeColor();

    const renderAccount = ({ item }: { item: Account }) => (
        <TouchableOpacity 
            style={[styles.accountItem, { borderColor: themeColors.borderBackgroundColor }]}
            onPress={() => onSelectAccount(item.accountId)}
        >
            <View style={styles.accountInfo}>
                <View style={[styles.radioButton, item.selected && { borderColor: themeColors.textColorAccent }]}>
                    {item.selected && <View style={[styles.radioButtonInner, { backgroundColor: themeColors.textColorAccent }]} />}
                </View>
                <View>
                    <ThemedText variant="subTitleBold">{item.bank}</ThemedText>
                    <ThemedText variant="paragraph">{item.accountNumber}</ThemedText>
                </View>
            </View>
            <Ionicons name="ellipsis-vertical" size={20} color={themeColors.gray1Gray04} />
        </TouchableOpacity>
    );

    return (
        <FlatList
            data={accounts}
            renderItem={renderAccount}
            keyExtractor={(item) => item.accountId}
            style={styles.list}
        />
    );
}

const styles = StyleSheet.create({
    list: {
        flex: 1,
    },
    accountItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 16,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 16,
    },
    accountInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    accountIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    bankName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    accountNumber: {
        fontSize: 14,
    },
    radioButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#000',
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioButtonInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
    },
});
