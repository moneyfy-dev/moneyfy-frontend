import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedLayoutFlatList } from '@/components/ThemedLayoutFlatList';
import { ThemedText } from '@/components/ThemedText';
import { ThemedButton } from '@/components/ThemedButton';
import { useThemeColor } from '@/hooks/useThemeColor';
import { CreditCardIcon } from '@/components/images/CreditCardIcon';
import { selectAccount } from '@/services/accountService';
import { useAuth } from '@/context/AuthContext';
import { Account } from '@/types/useAccounts';
import { AccountListScreen } from '@/components/AccountListScreen';

export default function PaymentConfigScreen() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const themeColors = useThemeColor();
    const router = useRouter();
    const { user, updateUserData } = useAuth();

    useEffect(() => {
        if (user && user.accounts) {
            setAccounts(user.accounts);
        }
    }, [user]);

    const handleSelectAccount = async (accountId: string) => {
        try {
            const updatedAccounts = await selectAccount(accountId);
            setAccounts(updatedAccounts);
            await updateUserData({ accounts: updatedAccounts });
        } catch (error) {
            console.error('Error al seleccionar la cuenta:', error);
            Alert.alert('Error', 'No se pudo seleccionar la cuenta');
        }
    };

    const handleAddAccount = () => {
        router.push('/add-account');
    };

    return (
        <ThemedLayoutFlatList padding={[0, 40]}>
            {accounts.length === 0 ? (
                <View style={styles.emptyState}>
                    <CreditCardIcon width={117} height={107} style={styles.iconImage}/>
                    <ThemedText variant="title" textAlign='center' marginBottom={8}>No hay cuentas registradas</ThemedText>
                    <ThemedText variant="paragraph" textAlign='center'>
                        Aún no has agregado una cuenta para recibir tus pagos por referidos, selecciona agregar cuenta
                    </ThemedText>
                </View>
            ) : (
                <AccountListScreen accounts={accounts} onSelectAccount={handleSelectAccount} />
            )}
            <ThemedButton
                text="Agregar cuenta"
                onPress={handleAddAccount}
                icon={{ name: "add", position: "left" }}
                style={styles.Button}
            />
        </ThemedLayoutFlatList>
    );
}

const styles = StyleSheet.create({
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    accountItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    selectedAccount: {
        backgroundColor: '#e6e6e6',
    },
    Button: {
        marginTop: 24,
    },
    iconImage: {
        marginBottom: 40,
    },
});
