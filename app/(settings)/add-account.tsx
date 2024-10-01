import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedSafeAreaView } from '@/components/ThemedSafeAreaView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedInput } from '@/components/ThemedInput';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';

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
        <ThemedSafeAreaView style={styles.container}>
            <ScrollView>

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

                <ThemedText style={[styles.sectionTitle, { color: themeColors.textColor }]}>Datos de la cuenta</ThemedText>

                <ThemedInput
                    label="Banco"
                    value={banco}
                    onChangeText={setBanco}
                    placeholder="Seleccione su banco"
                />

                <View style={styles.accountTypeContainer}>
                    {['CORRIENTE', 'VISTA', 'AHORRO'].map((type) => (
                        <TouchableOpacity
                            key={type}
                            style={[
                                styles.accountTypeButton,
                                tipoCuenta === type && { backgroundColor: themeColors.buttonBackgroundColor }
                            ]}
                            onPress={() => setTipoCuenta(type)}
                        >
                            <ThemedText
                                style={[
                                    styles.accountTypeText,
                                    tipoCuenta === type && { color: 'white' }
                                ]}
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

                <TouchableOpacity
                    style={[styles.saveButton, { backgroundColor: themeColors.buttonBackgroundColor }]}
                    onPress={handleSave}
                >
                    <ThemedText style={styles.saveButtonText}>Guardar</ThemedText>
                </TouchableOpacity>
            </ScrollView>
        </ThemedSafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    accountTypeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    accountTypeButton: {
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
    },
    accountTypeText: {
        fontSize: 14,
    },
    saveButton: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        marginTop: 20,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});