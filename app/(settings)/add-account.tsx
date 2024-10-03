import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedLayout } from '@/components/ThemedLayout';
import { ThemedText } from '@/components/ThemedText';
import { ThemedInput } from '@/components/ThemedInput';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedButton } from '@/components/ThemedButton';
import { addAccount } from '@/services/paymentConfigService';

export default function AddAccountScreen() {
    const [rut, setRut] = useState('');
    const [name, setName] = useState('');
    const [alias, setAlias] = useState('');
    const [email, setEmail] = useState('');
    const [bankName, setBankName] = useState('');
    const [accountType, setAccountType] = useState('');
    const [accountNumber, setAccountNumber] = useState('');

    const themeColors = useThemeColor();
    const router = useRouter();

    const handleSave = async () => {
        try {
            const newAccount = await addAccount({
                rut,
                name,
                alias,
                email,
                bankName,
                accountType,
                accountNumber,
            });
            Alert.alert('Success', 'Account added successfully');
            router.back();
        } catch (error) {
            console.error('Error adding account:', error);
            Alert.alert('Error', 'Could not add the account');
        }
    };

    return (
        <ThemedLayout padding={[0 ,40]}>
            <ThemedInput
                label="RUT"
                value={rut}
                onChangeText={setRut}
                placeholder="Enter your RUT"
            />

            <ThemedInput
                label="Name"
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
            />

            <ThemedInput
                label="Alias"
                value={alias}
                onChangeText={setAlias}
                placeholder="Enter an alias for the account"
            />

            <ThemedInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
            />

            <ThemedText variant="title" marginBottom={16}>Account Details</ThemedText>

            <ThemedInput
                label="Bank"
                value={bankName}
                onChangeText={setBankName}
                placeholder="Select your bank"
            />

            <ThemedText variant="title" marginBottom={16}>Account Type</ThemedText>

            <View style={styles.accountTypeContainer}>
                {['CHECKING', 'SAVINGS', 'VISTA'].map((type) => (
                    <TouchableOpacity
                        key={type}
                        style={[
                            styles.accountTypeButton,
                            { backgroundColor: themeColors.extremeContrastGray },
                            accountType === type && { backgroundColor: themeColors.buttonBackgroundColor }
                        ]}
                        onPress={() => setAccountType(type)}
                    >
                        <ThemedText
                            variant="textLink"
                            textAlign="center"
                            color={accountType === type ? themeColors.backgroundColor : themeColors.textColorAccent}
                        >
                            {type}
                        </ThemedText>
                    </TouchableOpacity>
                ))}
            </View>

            <ThemedInput
                label="Account Number"
                value={accountNumber}
                onChangeText={setAccountNumber}
                placeholder="Enter the account number"
                keyboardType="numeric"
            />

            <ThemedButton
                text="Save"
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