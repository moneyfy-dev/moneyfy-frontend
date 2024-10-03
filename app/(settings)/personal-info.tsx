import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedLayout } from '@/components/ThemedLayout';
import { ThemedInput } from '@/components/ThemedInput';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAuth } from '@/context/AuthContext';
import { ThemedButton } from '@/components/ThemedButton';

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
        <ThemedLayout padding={[0, 40]}>

            <View style={styles.content}>
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

            <ThemedButton
                text="Guardar"
                onPress={handleSave}
            />

        </ThemedLayout>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
    }
});