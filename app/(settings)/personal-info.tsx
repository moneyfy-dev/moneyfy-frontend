import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Alert, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ThemedLayout } from '@/components/ThemedLayout';
import { ThemedInput } from '@/components/ThemedInput';
import { AvatarIcon } from '@/components/images/AvatarIcon';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAuth } from '@/context/AuthContext';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';
import { PersonalInfo } from '@/types/PersonalInfo';
import { UserData } from '@/types/userData';
import { ThemedDatePicker } from '@/components/ThemedDatePicker';

export default function PersonalInfoScreen() {
    const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
        nombre: '',
        apellido: '',
        telefono: '',
        direccion: '',
        fechaNacimiento: new Date(),
    });
    const [showDatePicker, setShowDatePicker] = useState(false);

    const themeColors = useThemeColor();
    const router = useRouter();
    const { userData, updateUserData } = useAuth();

    useEffect(() => {
        if (userData) {
            setPersonalInfo({
                nombre: userData.name || '',
                apellido: userData.surname || '',
                telefono: userData.phone || '',
                direccion: userData.address || '',
                fechaNacimiento: userData.dateOfBirth ? new Date(userData.dateOfBirth) : new Date(),
            });
        }
    }, [userData]);

    const handleSave = async () => {
        try {
            await updateUserData({
                name: personalInfo.nombre,
                surname: personalInfo.apellido,
                phone: personalInfo.telefono,
                address: personalInfo.direccion,
                dateOfBirth: personalInfo.fechaNacimiento.toISOString().split('T')[0],
            });
            Alert.alert('Éxito', 'Información personal actualizada correctamente');
        } catch (error) {
            console.error('Error al actualizar información personal:', error);
            Alert.alert('Error', 'No se pudo actualizar la información personal');
        }
    };
    const handleEdit = () => {
        console.log('Editando información personal');
    };

    return (
        <ThemedLayout padding={[0, 40]}>

            <View style={styles.content}>
                <View style={styles.profileSection}>
                    <View style={styles.profileImageContainer}>
                        <AvatarIcon width={80} height={80} style={styles.profileImage} />
                        <TouchableOpacity style={[styles.editButton, { backgroundColor: themeColors.buttonBackgroundColor }]}>
                            <Ionicons name="pencil" size={10} color={themeColors.white} />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <ThemedText variant="title" textAlign="center" marginBottom={4}>{personalInfo.nombre} {personalInfo.apellido}</ThemedText>
                        <ThemedText variant="paragraph" textAlign="center">{userData?.email || 'No email'}</ThemedText>
                    </View>
                </View>
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

                <ThemedDatePicker
                    label="Fecha de Nacimiento"
                    value={personalInfo.fechaNacimiento}
                    onChange={(date) => setPersonalInfo({ ...personalInfo, fechaNacimiento: date })}
                    placeholder="Seleccione su fecha de nacimiento"
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
    },
    profileSection: {
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 30,
        textAlign: 'center',
    },
    profileImageContainer: {
        position: 'relative',
        width: 80,
        height: 80,
        marginBottom: 16,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    editButton: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 24,
        height: 24,
        borderRadius: 12,
        position: 'absolute',
        right: 0,
        bottom: 0,
    },
});