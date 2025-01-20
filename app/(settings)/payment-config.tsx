import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ROUTES } from '@/core/types';
import { useSettings } from '@/core/context';
import { ThemedLayoutFlatList, ThemedText, ThemedButton, AccountListScreen, CreditCardIcon, MessageModal } from '@/shared/components';
import { useMessageConfig } from '@/shared/hooks';

export default function PaymentConfigScreen() {
    const router = useRouter();
    const { accounts, selectAccount } = useSettings();
    
    useMessageConfig(['/accounts/select']);

    const handleSelectAccount = async (accountId: string) => {
        try {
            await selectAccount(accountId);
        } catch (error) {
        }
    };

    const handleAccountUpdated = () => {
        // Recargar las cuentas se maneja automáticamente por el contexto
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
                onPress={() => router.push(ROUTES.SETTINGS.ADD_ACCOUNT)}
                style={styles.button}
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
    subtitle: {
        marginTop: 8,
        marginBottom: 24,
    },
    button: {
        marginTop: 24,
    },
    iconImage: {
        marginBottom: 40,
    },
});
