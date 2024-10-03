import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedLayout } from '@/components/ThemedLayout';
import { ThemedText } from '@/components/ThemedText';
import { ThemedInput } from '@/components/ThemedInput';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedButton } from '@/components/ThemedButton';

export default function AddAccountScreen() {
    const [rut, setRut] = useState('');
    const [nombre, setNombre] = useState('');
    const [alias, setAlias] = useState('');
    const [email, setEmail] = useState('');
    const [banco, setBanco] = useState('');
    const [tipoCuenta, setTipoCuenta] = useState('');
    const [numeroCuenta, setNumeroCuenta] = useState('');

    const themeColors = useThemeColor();
    const router = useRouter();

    const handleSave = () => {
        // Aquí iría la lógica para guardar la cuenta en el backend
        console.log('Guardando cuenta...');
        router.back();
    };

    return (
        <ThemedLayout padding={[0 ,40]}>

            <ThemedInput
                label="Rut"
                value={rut}
                onChangeText={setRut}
                placeholder="Ingrese su RUT"
            />

            <ThemedInput
                label="Nombre"
                value={nombre}
                onChangeText={setNombre}
                placeholder="Ingrese su nombre"
            />

            <ThemedInput
                label="Alias"
                value={alias}
                onChangeText={setAlias}
                placeholder="Ingrese un alias para la cuenta"
            />

            <ThemedInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="Ingrese su email"
                keyboardType="email-address"
            />

            <ThemedText variant="title" marginBottom={16}>Datos de la cuenta</ThemedText>

            <ThemedInput
                label="Banco"
                value={banco}
                onChangeText={setBanco}
                placeholder="Seleccione su banco"
            />

            <ThemedText variant="title" marginBottom={16}>Tipo de cuenta</ThemedText>

            <View style={styles.accountTypeContainer}>
                {['CORRIENTE', 'VISTA', 'AHORRO'].map((type) => (
                    <TouchableOpacity
                        key={type}
                        style={[
                            styles.accountTypeButton, { backgroundColor: themeColors.extremeContrastGray },
                            tipoCuenta === type && { backgroundColor: themeColors.buttonBackgroundColor }
                        ]}
                        onPress={() => setTipoCuenta(type)}
                    >
                        <ThemedText
                            variant="textLink"
                            textAlign="center"
                            color={tipoCuenta === type ? themeColors.backgroundColor : themeColors.textColorAccent}
                        >
                            {type}
                        </ThemedText>
                    </TouchableOpacity>
                ))}
            </View>

            <ThemedInput
                label="N° Cuenta"
                value={numeroCuenta}
                onChangeText={setNumeroCuenta}
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