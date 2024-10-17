import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedLayout } from '@/components/ThemedLayout';
import { ThemedText } from '@/components/ThemedText';
import { ThemedInput } from '@/components/ThemedInput';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedButton } from '@/components/ThemedButton';
import { addAccount } from '@/services/accountService';
import { useAuth } from '@/context/AuthContext';

export default function AddAccountScreen() {
    const [personalId, setPersonalId] = useState('');
    const [holderName, setHolderName] = useState('');
    const [alias, setAlias] = useState('');
    const [email, setEmail] = useState('');
    const [bank, setBank] = useState('');
    const [accountType, setAccountType] = useState('');
    const [accountNumber, setAccountNumber] = useState('');

    const themeColors = useThemeColor();
    const router = useRouter();
    const { updateUserData } = useAuth();

    const handleSave = async () => {
        try {
            const newAccountData = {
                personalId,
                holderName,
                alias,
                email,
                bank,
                accountType,
                accountNumber
            };

            const updatedAccounts = await addAccount(newAccountData);
            await updateUserData({ accounts: updatedAccounts });
            Alert.alert('Éxito', 'Cuenta agregada correctamente');
            router.back();
        } catch (error) {
            console.error('Error al agregar la cuenta:', error);
            Alert.alert('Error', 'No se pudo agregar la cuenta');
        }
    };

    return (
        <ThemedLayout padding={[0 ,40]}>
            <ThemedInput
                label="RUT"
                value={personalId}
                onChangeText={setPersonalId}
                placeholder="Ingrese su RUT"
            />

            <ThemedInput
                label="Nombre"
                value={holderName}
                onChangeText={setHolderName}
                placeholder="Ingrese su nombre"
            />

            <ThemedInput
                label="Alias"
                value={alias}
                onChangeText={setAlias}
                placeholder="Ingrese un alias para la cuenta"
            />

            <ThemedInput
                label="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                placeholder="Ingrese su correo electrónico"
                keyboardType="email-address"
            />

            <ThemedText variant="title" marginBottom={16}>Detalles de la cuenta</ThemedText>

            <ThemedInput
                label="Banco"
                value={bank}
                onChangeText={setBank}
                placeholder="Seleccione su banco"
            />

            <ThemedText variant="title" marginBottom={16}>Tipo de cuenta</ThemedText>

            <View style={styles.accountTypeContainer}>
                {[
                    { key: 'CHECKING', label: 'CORRIENTE' },
                    { key: 'SAVINGS', label: 'AHORRO' },
                    { key: 'VISTA', label: 'VISTA' }
                ].map(({ key, label }) => (
                    <TouchableOpacity
                        key={key}
                        style={[
                            styles.accountTypeButton,
                            { backgroundColor: themeColors.extremeContrastGray },
                            accountType === key && { backgroundColor: themeColors.buttonBackgroundColor }
                        ]}
                        onPress={() => setAccountType(key)}
                    >
                        <ThemedText
                            variant="textLink"
                            textAlign="center"
                            color={accountType === key ? themeColors.backgroundColor : themeColors.textColorAccent}
                        >
                            {label}
                        </ThemedText>
                    </TouchableOpacity>
                ))}
            </View>

            <ThemedInput
                label="Número de cuenta"
                value={accountNumber}
                onChangeText={setAccountNumber}
                placeholder="Ingrese el número de cuenta"
                keyboardType="numeric"
            />

            <ThemedButton
                text="Guardar"
                onPress={handleSave}
                style={styles.Button}
            />
        </ThemedLayout>
    );
}

const styles = StyleSheet.create({
    accountTypeContainer: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 20,
    },
    accountTypeButton: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderRadius: 16,
        borderWidth: 1,
    },
    Button: {
        marginTop: 24,
    }
});
