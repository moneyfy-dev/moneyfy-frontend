import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedLayout } from '@/components/ThemedLayout';
import { ThemedInput } from '@/components/ThemedInput';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAuth } from '@/context/AuthContext';
import { ThemedButton } from '@/components/ThemedButton';
import { getPersonalInfo, updatePersonalInfo, PersonalInfo } from '@/services/personalInfoService';

export default function PersonalInfoScreen() {
    const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        direccion: '',
    });

    const themeColors = useThemeColor();
    const router = useRouter();
    const { userEmail } = useAuth();

    useEffect(() => {
        const fetchPersonalInfo = async () => {
            try {
                const info = await getPersonalInfo();
                setPersonalInfo(info);
            } catch (error) {
                console.error('Error al obtener información personal:', error);
                // Manejar el error (mostrar un mensaje al usuario, etc.)
            }
        };

        fetchPersonalInfo();
    }, []);

    const handleSave = async () => {
        try {
            const updatedInfo = await updatePersonalInfo(personalInfo);
            setPersonalInfo(updatedInfo);
            Alert.alert('Éxito', 'Información personal actualizada correctamente');
        } catch (error) {
            console.error('Error al actualizar información personal:', error);
            Alert.alert('Error', 'No se pudo actualizar la información personal');
        }
    };

    return (
        <ThemedLayout padding={[0, 40]}>

            <View style={styles.content}>
                <ThemedInput
                    label="Nombre"
                    value={personalInfo.nombre}
                    onChangeText={(value) => setPersonalInfo({ ...personalInfo, nombre: value })}
                    placeholder="Ingrese su nombre"
                />

                <ThemedInput
                    label="Apellido"
                    value={personalInfo.apellido}
                    onChangeText={(value) => setPersonalInfo({ ...personalInfo, apellido: value })}
                    placeholder="Ingrese su apellido"
                />

                <ThemedInput
                    label="Email"
                    value={personalInfo.email}
                    onChangeText={(value) => setPersonalInfo({ ...personalInfo, email: value })}
                    placeholder="Ingrese su email"
                    keyboardType="email-address"
                />

                <ThemedInput
                    label="Teléfono"
                    value={personalInfo.telefono}
                    onChangeText={(value) => setPersonalInfo({ ...personalInfo, telefono: value })}
                    placeholder="Ingrese su teléfono"
                    keyboardType="phone-pad"
                />

                <ThemedInput
                    label="Dirección"
                    value={personalInfo.direccion}
                    onChangeText={(value) => setPersonalInfo({ ...personalInfo, direccion: value })}
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