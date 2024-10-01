import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { useRouter, Href } from 'expo-router';
import { ThemedSafeAreaView } from '@/components/ThemedSafeAreaView';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { AccountListScreen } from '@/components/AccountListScreen';
import { CreditCardIcon } from '@/components/images/CreditCardIcon';

export default function PaymentConfigScreen() {
    const [accounts, setAccounts] = useState([]);
    const themeColors = useThemeColor();
    const router = useRouter();

    useEffect(() => {
        // Aquí cargaríamos las cuentas del usuario desde el backend
        // Por ahora, usaremos un array vacío
    }, []);

    const handleAddAccount = () => {
        router.push('/add-account' as Href<string>);
    };

    return (
        <ThemedSafeAreaView style={styles.container}>

            {accounts.length === 0 ? (
                <View style={styles.emptyState}>
                    <CreditCardIcon width={117} height={107} />
                    <ThemedText style={[styles.emptyStateTitle, { color: themeColors.textColor }]}>No hay cuentas registradas</ThemedText>
                    <ThemedText style={[styles.emptyStateSubtitle, { color: themeColors.textParagraph }]}>
                        Aún no has agregado una cuenta para recibir tus pagos por referidos, selecciona agregar cuenta
                    </ThemedText>
                </View>
            ) : (
                <AccountListScreen accounts={accounts} />
            )}

            <TouchableOpacity
                style={[styles.addButton, { backgroundColor: themeColors.buttonBackgroundColor }]}
                onPress={handleAddAccount}
            >
                <Ionicons name="add" size={24} color="white" />
                <ThemedText style={styles.addButtonText}>Agregar cuenta</ThemedText>
            </TouchableOpacity>
        </ThemedSafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    emptyStateIcon: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    emptyStateTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 40,
    },
    emptyStateSubtitle: {
        fontSize: 12,
        lineHeight: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    addButton: {
        display: 'flex',
        flexDirection: 'row',
        gap: 8,
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'semibold',
    },
});