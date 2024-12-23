import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ROUTES } from '@/core/types';
import { useSettings } from '@/core/context';
import { ThemedLayout, ThemedText, ThemedButton, AccountListScreen } from '@/shared/components';

export default function PaymentConfigScreen() {
    const router = useRouter();
    const { accounts, updateAccount } = useSettings();

    const handleSelectAccount = (accountId: string) => {
        // Actualizar la cuenta seleccionada
        accounts.forEach(async (account) => {
            if (account.accountId === accountId) {
                await updateAccount(account.accountId, { selected: true });
            } else if (account.selected) {
                await updateAccount(account.accountId, { selected: false });
            }
        });
    };

    const handleAccountUpdated = () => {
        // Recargar las cuentas se maneja automáticamente por el contexto
    };

    return (
        <ThemedLayout>
            <View style={styles.container}>
                {accounts.length > 0 ? (
                    <>
                        <AccountListScreen
                            accounts={accounts}
                            onSelectAccount={handleSelectAccount}
                            onAccountUpdated={handleAccountUpdated}
                        />
                        <ThemedButton
                            text="Agregar cuenta"
                            onPress={() => router.push(ROUTES.SETTINGS.ADD_ACCOUNT)}
                            style={styles.button}
                        />
                    </>
                ) : (
                    <View style={styles.emptyState}>
                        <ThemedText variant="title" textAlign="center">
                            No tienes cuentas registradas
                        </ThemedText>
                        <ThemedText 
                            variant="paragraph" 
                            textAlign="center" 
                            style={styles.subtitle}
                        >
                            Agrega una cuenta para recibir tus pagos
                        </ThemedText>
                        <ThemedButton
                            text="Agregar cuenta"
                            onPress={() => router.push(ROUTES.SETTINGS.ADD_ACCOUNT)}
                            style={styles.button}
                        />
                    </View>
                )}
            </View>
        </ThemedLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
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
        marginTop: 'auto',
        marginBottom: 24,
    }
});
