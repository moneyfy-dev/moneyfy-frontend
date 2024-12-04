import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ThemedLayout } from '@/components/ThemedLayout';
import { ThemedText } from '@/components/ThemedText';
import { ThemedInput } from '@/components/ThemedInput';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedButton } from '@/components/ThemedButton';
import { addAccount, updateAccount } from '@/services/accountService';
import { useAuth } from '@/context/AuthContext';
import { validateName, validateEmail, validateRUT } from '@/utils/validations';
import axios from 'axios';
import { ThemedCheckGroup } from '@/components/ThemedCheckGroup';

const BANKS = [
  "Banco Scotiabank", "Banco BBVA", "Banco Itau", "Banco BICE", "Banco HSBC",
  "Banco Consorcio", "Banco Corpbanca", "Banco BCI/Mach", "Banco Estado", "Banco Falabella",
  "Banco Internacional", "Banco Paris", "Banco Ripley", "Banco Santander", "Banco Security",
  "Banco Chile", "Banco del Desarrollo", "Banco Brasil", "Banco Rabobank", "Banco J.P. Morgan Chase",
  "Transbank", "Coopeuch / Dale", "Tenpo Prepago", "Prepago Los Heroes", "Mercado Pago",
  "TAPP Caja los Andes", "Copec Pay", "La Polar Prepago", "Global66", "Prex"
];

export default function AddAccountScreen() {
    const { accountId } = useLocalSearchParams<{ accountId: string }>();
    const [personalId, setPersonalId] = useState('');
    const [holderName, setHolderName] = useState('');
    const [alias, setAlias] = useState('');
    const [email, setEmail] = useState('');
    const [bank, setBank] = useState('');
    const [accountType, setAccountType] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [errors, setErrors] = useState({
        personalId: '',
        holderName: '',
        email: '',
    });

    const themeColors = useThemeColor();
    const router = useRouter();
    const { user, updateUserData } = useAuth();

    useEffect(() => {
        if (accountId && user) {
            const account = user.accounts.find(acc => acc.accountId === accountId);
            if (account) {
                setPersonalId(account.personalId);
                setHolderName(account.holderName);
                setAlias(account.alias);
                setEmail(account.email);
                setBank(account.bank);
                setAccountType(account.accountType.toUpperCase());
                setAccountNumber(account.accountNumber);
            }
        }
    }, [accountId, user]);

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            personalId: '',
            holderName: '',
            email: '',
        };

        if (!validateName(holderName)) {
            newErrors.holderName = 'Nombre inválido';
            isValid = false;
        }

        if (!validateEmail(email)) {
            newErrors.email = 'Correo electrónico inválido';
            isValid = false;
        }

        if (!validateRUT(personalId)) {
            newErrors.personalId = 'RUT inválido';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            Alert.alert('Error', 'Por favor, corrija los errores en el formulario.');
            return;
        }

        try {
            const accountData = {
                personalId,
                holderName,
                alias,
                email,
                bank,
                accountType,
                accountNumber
            };
            
            let response;
            if (accountId) {
                response = await updateAccount(accountId, accountData);
            } else {
                response = await addAccount(accountData);
            }

            if (response && response.data && response.data.user) {
                await updateUserData(response.data.user);
                Alert.alert('Éxito', accountId ? 'Cuenta actualizada correctamente' : 'Cuenta agregada correctamente');
                router.back();
            } else {
                throw new Error('Respuesta inesperada del servidor');
            }
        } catch (error) {
            console.error('Error al procesar la cuenta:', error);
            if (axios.isAxiosError(error)) {
                console.error('Error response:', error);
            }
            Alert.alert('Error', accountId ? 'No se pudo actualizar la cuenta' : 'No se pudo agregar la cuenta');
        }
    };

    const accountTypeOptions = [
        { key: 'CORRIENTE', label: 'CORRIENTE' },
        { key: 'AHORRO', label: 'AHORRO' },
        { key: 'VISTA', label: 'VISTA' }
    ];

    return (
        <ThemedLayout padding={[0 ,40]}>
            <ThemedInput
                label="RUT"
                value={personalId}
                onChangeText={setPersonalId}
                placeholder="Ingrese su RUT"
                error={errors.personalId}
                isRUT={true}
            />

            <ThemedInput
                label="Nombre"
                value={holderName}
                onChangeText={setHolderName}
                placeholder="Ingrese su nombre"
                error={errors.holderName}
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
                error={errors.email}
            />

            <ThemedText variant="title" marginBottom={16}>Detalles de la cuenta</ThemedText>

            <ThemedInput
                label="Banco"
                value={bank}
                onChangeText={setBank}
                placeholder="Seleccione su banco"
                isSelect={true}
                options={BANKS}
            />

            <ThemedText variant="title" marginBottom={16}>Tipo de cuenta</ThemedText>

            <ThemedCheckGroup
                options={accountTypeOptions}
                selectedValue={accountType}
                onSelect={setAccountType}
                containerStyle={styles.accountTypeContainer}
            />

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
    Button: {
        marginTop: 24,
    }
});
