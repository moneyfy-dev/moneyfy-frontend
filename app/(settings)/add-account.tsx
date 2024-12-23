import React, { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';
import { useThemeColor } from '@/shared/hooks';
import { ThemedLayout, ThemedText, ThemedInput, ThemedButton, ThemedCheckGroup, MessageModal } from '@/shared/components';
import { validateName, validateEmail, validateRUT } from '@/shared/utils/validations';
import { useSettings } from '@/core/context';
import { BankAccount } from '@/core/types';

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
    const router = useRouter();
    const themeColors = useThemeColor();
    const { accounts, addAccount, updateAccount } = useSettings();

    const [formData, setFormData] = useState<Omit<BankAccount, 'accountId' | 'selected'>>({
        personalId: '',
        holderName: '',
        alias: '',
        email: '',
        bank: '',
        accountType: '',
        accountNumber: '',
    });

    const [errors, setErrors] = useState({
        personalId: '',
        holderName: '',
        email: '',
    });

    const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [successModalVisible, setSuccessModalVisible] = useState(false);

    useEffect(() => {
        if (accountId) {
            const account = accounts.find(acc => acc.accountId === accountId);
            if (account) {
                setFormData({
                    personalId: account.personalId,
                    holderName: account.holderName,
                    alias: account.alias,
                    email: account.email,
                    bank: account.bank,
                    accountType: account.accountType.toUpperCase(),
                    accountNumber: account.accountNumber,
                });
            }
        }
    }, [accountId, accounts]);

    const validateForm = () => {
        const newErrors = {
            personalId: '',
            holderName: '',
            email: '',
        };
        let isValid = true;

        if (!validateRUT(formData.personalId)) {
            newErrors.personalId = 'RUT inválido';
            isValid = false;
        }

        if (!validateName(formData.holderName)) {
            newErrors.holderName = 'Nombre inválido';
            isValid = false;
        }

        if (!validateEmail(formData.email)) {
            newErrors.email = 'Correo electrónico inválido';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            setErrorMessage('Por favor, corrija los errores en el formulario.');
            setIsErrorModalVisible(true);
            return;
        }

        try {
            if (accountId) {
                await updateAccount(accountId, formData);
                setSuccessMessage('Cuenta actualizada correctamente');
            } else {
                await addAccount({...formData, selected: false});
                setSuccessMessage('Cuenta agregada correctamente');
            }
            setSuccessModalVisible(true);
            router.back();
        } catch (error) {
            console.error('Error al procesar la cuenta:', error);
            setErrorMessage(accountId ? 'No se pudo actualizar la cuenta' : 'No se pudo agregar la cuenta');
            setIsErrorModalVisible(true);
        }
    };

    const accountTypeOptions = [
        { key: 'CORRIENTE', label: 'CORRIENTE' },
        { key: 'AHORRO', label: 'AHORRO' },
        { key: 'VISTA', label: 'VISTA' }
    ];

    return (
        <ThemedLayout padding={[0, 40]}>
            <ThemedInput
                label="RUT"
                value={formData.personalId}
                onChangeText={(text) => setFormData(prev => ({ ...prev, personalId: text }))}
                placeholder="Ingrese su RUT"
                error={errors.personalId}
                isRUT={true}
            />

            <ThemedInput
                label="Nombre"
                value={formData.holderName}
                onChangeText={(text) => setFormData(prev => ({ ...prev, holderName: text }))}
                placeholder="Ingrese su nombre"
                error={errors.holderName}
            />

            <ThemedInput
                label="Alias"
                value={formData.alias}
                onChangeText={(text) => setFormData(prev => ({ ...prev, alias: text }))}
                placeholder="Ingrese un alias para la cuenta"
            />

            <ThemedInput
                label="Correo electrónico"
                value={formData.email}
                onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
                placeholder="Ingrese su correo electrónico"
                keyboardType="email-address"
                error={errors.email}
            />

            <ThemedText variant="title" marginBottom={16}>Detalles de la cuenta</ThemedText>

            <ThemedInput
                label="Banco"
                value={formData.bank}
                onChangeText={(text) => setFormData(prev => ({ ...prev, bank: text }))}
                placeholder="Seleccione su banco"
                isSelect={true}
                options={BANKS}
            />

            <ThemedText variant="title" marginBottom={16}>Tipo de cuenta</ThemedText>

            <ThemedCheckGroup
                options={accountTypeOptions}
                selectedValue={formData.accountType}
                onSelect={(value) => setFormData(prev => ({ ...prev, accountType: value }))}
                containerStyle={styles.accountTypeContainer}
            />

            <ThemedInput
                label="Número de cuenta"
                value={formData.accountNumber}
                onChangeText={(text) => setFormData(prev => ({ ...prev, accountNumber: text }))}
                placeholder="Ingrese el número de cuenta"
                keyboardType="numeric"
            />

            <ThemedButton
                text="Guardar"
                onPress={handleSave}
                style={styles.button}
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
        </ThemedLayout>
    );
}

const styles = StyleSheet.create({
    accountTypeContainer: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 20,
    },
    button: {
        marginTop: 24,
    }
});
