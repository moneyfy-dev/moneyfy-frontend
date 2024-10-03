import React from 'react';
import { StyleSheet, TouchableOpacity, View, FlatList } from 'react-native';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { Account } from '@/services/paymentConfigService';

interface AccountListScreenProps {
    accounts: Account[];
}

export function AccountListScreen({ accounts }: AccountListScreenProps) {
    const themeColors = useThemeColor();

    const renderAccount = ({ item }: { item: Account }) => (
        <TouchableOpacity style={styles.accountItem}>
            <View style={styles.accountInfo}>
                <View style={[styles.accountIcon, { backgroundColor: themeColors.buttonBackgroundColor }]}>
                    <Ionicons name="card-outline" size={24} color="white" />
                </View>
                <View>
                    <ThemedText style={styles.bankName}>{item.bankName}</ThemedText>
                    <ThemedText style={styles.accountNumber}>{item.accountNumber}</ThemedText>
                </View>
            </View>
            <Ionicons name="chevron-forward" size={24} color={themeColors.textColor} />
        </TouchableOpacity>
    );

    return (
        <FlatList
            data={accounts}
            renderItem={renderAccount}
            keyExtractor={(item) => item.id}
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
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    accountInfo: {
        flexDirection: 'row',
        alignItems: 'center',
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
});