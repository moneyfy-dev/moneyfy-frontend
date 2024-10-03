import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { useRouter, Href } from 'expo-router';
import { ThemedLayout } from '@/components/ThemedLayout';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { AccountListScreen } from '@/components/AccountListScreen';
import { CreditCardIcon } from '@/components/images/CreditCardIcon';
import { ThemedButton } from '@/components/ThemedButton';

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
        <ThemedLayout padding={[0, 40]}>

            {accounts.length === 0 ? (
                <View style={styles.emptyState}>
                    <CreditCardIcon width={117} height={107} style={styles.iconImage}/>
                    <ThemedText variant="title" textAlign='center' marginBottom={8}>No hay cuentas registradas</ThemedText>
                    <ThemedText variant="paragraph" textAlign='center'>
                        Aún no has agregado una cuenta para recibir tus pagos por referidos, selecciona agregar cuenta
                    </ThemedText>
                </View>
            ) : (
                <AccountListScreen accounts={accounts} />
            )}
            <ThemedButton
                text="Agregar cuenta"
                onPress={handleAddAccount}
                icon={{ name: "add", position: "left" }}
                style={styles.Button}
            />
        </ThemedLayout>
    );
}

const styles = StyleSheet.create({
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    iconImage: {
        marginBottom: 40,
    },
    Button: {
        marginTop: 24,
    }
});