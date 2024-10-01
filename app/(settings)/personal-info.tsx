import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedSafeAreaView } from '@/components/ThemedSafeAreaView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedInput } from '@/components/ThemedInput';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function PersonalInfoScreen() {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [email, setEmail] = useState('');
    const [telefono, setTelefono] = useState('');
    const [direccion, setDireccion] = useState('');

    const themeColors = useThemeColor();
    const router = useRouter();
    const { userEmail } = useAuth();

    useEffect(() => {
        setEmail(userEmail || '');
    }, [userEmail]);

    const handleSave = () => {
        console.log('Guardando cambios...');
    };

    return (
        <ThemedSafeAreaView style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.container}>

                    <ThemedInput
                        label="Nombre"
                        value={nombre}
                        onChangeText={setNombre}
                        placeholder="Ingrese su nombre"
                    />

                    <ThemedInput
                        label="Apellido"
                        value={apellido}
                        onChangeText={setApellido}
                        placeholder="Ingrese su apellido"
                    />

                    <ThemedInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Ingrese su email"
                        keyboardType="email-address"
                    />

                    <ThemedInput
                        label="Teléfono"
                        value={telefono}
                        onChangeText={setTelefono}
                        placeholder="Ingrese su teléfono"
                        keyboardType="phone-pad"
                    />

                    <ThemedInput
                        label="Dirección"
                        value={direccion}
                        onChangeText={setDireccion}
                        placeholder="Ingrese su dirección"
                    />
                </View>

                <View>
                    <TouchableOpacity
                        style={[styles.saveButton, { backgroundColor: themeColors.buttonBackgroundColor }]}
                        onPress={handleSave}
                    >
                        <ThemedText style={styles.saveButtonText}>Guardar</ThemedText>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </ThemedSafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
        padding: 24,
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
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
    },
    saveButton: {
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'semibold',
    },
});