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
import axios from 'axios';

export default function PaymentConfigScreen() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const themeColors = useThemeColor();
    const router = useRouter();
    const { user, updateUserData, hydrateUserData } = useAuth();

    useEffect(() => {
        if (user && user.accounts) {
            setAccounts(user.accounts);
        }
    }, [user]);

    const handleSelectAccount = async (accountId: string) => {
        try {
            const response = await selectAccount(accountId);
            setAccounts(response.data.user.accounts);

            if (response && response.data && response.data.user) {
                await updateUserData(response.data.user);
                Alert.alert('Éxito', 'Cuenta Seleccionada');
            } else {
                throw new Error('Respuesta inesperada del servidor');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
            }
            Alert.alert('Error', 'No se pudo seleccionar la cuenta');
        }
    };

    const handleAddAccount = () => {
        router.push('/add-account');
    };

    const handleAccountUpdated = async () => {
        // Forzar actualización de datos del usuario
        await hydrateUserData(true);
        
        // La lista se actualizará automáticamente por el useEffect
        // cuando el contexto de usuario se actualice
    };

    return (
        <ThemedLayoutFlatList padding={[0, 40]}>
            {accounts.length === 0 ? (
                <View style={styles.emptyState}>
                    <CreditCardIcon width={117} height={107} style={styles.iconImage} />
                    <ThemedText variant="title" textAlign='center' marginBottom={8}>No hay cuentas registradas</ThemedText>
                    <ThemedText variant="paragraph" textAlign='center'>
                        Aún no has agregado una cuenta para recibir tus pagos por referidos, selecciona agregar cuenta
                    </ThemedText>
                </View>
            ) : (
                <AccountListScreen 
                    accounts={accounts} 
                    onSelectAccount={handleSelectAccount} 
                    onAccountUpdated={handleAccountUpdated}
                />
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
