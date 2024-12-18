import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedLayoutFlatList } from '@/shared/components/ThemedLayoutFlatList';
import { ThemedText } from '@/shared/components/ThemedText';
import { ThemedButton } from '@/shared/components/ThemedButton';
import { useThemeColor } from '@/shared/hooks/useThemeColor';
import { CreditCardIcon } from '@/shared/components/images/CreditCardIcon';
import { selectAccount } from '@/core/services/accountService';
import { useAuth } from '@/core/context/AuthContext';
import { Account } from '@/core/types/useAccounts';
import { AccountListScreen } from '@/shared/components/AccountListScreen';
import axios from 'axios';
import { MessageModal } from '@/shared/components/MessageModal';
import { ROUTES } from '@/core/types/routes';

export default function PaymentConfigScreen() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const themeColors = useThemeColor();
    const router = useRouter();
    const { user, updateUserData, hydrateUserData } = useAuth();
    const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [successModalVisible, setSuccessModalVisible] = useState(false);

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
                setSuccessMessage('Cuenta Seleccionada');
                setSuccessModalVisible(true);
            } else {
                throw new Error('Respuesta inesperada del servidor');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
            }
            setErrorMessage('No se pudo seleccionar la cuenta');
            setIsErrorModalVisible(true);
        }
    };

    const handleAddAccount = () => {
        router.push(ROUTES.SETTINGS.ADD_ACCOUNT);
    };

    const handleAccountUpdated = async () => {
        await hydrateUserData(true);
    };

    return (
        <ThemedLayoutFlatList padding={[40, 24]}>
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

            <MessageModal
                isVisible={isErrorModalVisible}
                onClose={() => setIsErrorModalVisible(false)}
                title="Error"
                message={errorMessage}
                icon={{
                    name: "alert-circle-outline",
                    color: themeColors.status.error
                }}
                primaryButton={{
                    text: "Entendido",
                    onPress: () => setIsErrorModalVisible(false)
                }}
            />

            <MessageModal
                isVisible={successModalVisible}
                onClose={() => setSuccessModalVisible(false)}
                title="Éxito"
                message={successMessage}
                icon={{
                    name: "checkmark-circle-outline",
                    color: themeColors.status.success
                }}
                primaryButton={{
                    text: "Entendido",
                    onPress: () => setSuccessModalVisible(false)
                }}
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
