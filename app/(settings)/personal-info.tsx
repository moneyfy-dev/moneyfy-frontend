import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { ThemedLayout } from '@/components/ThemedLayout';
import { ThemedInput } from '@/components/ThemedInput';
import { AvatarIcon } from '@/components/images/AvatarIcon';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAuth } from '@/context/AuthContext';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedDatePicker } from '@/components/ThemedDatePicker';

export default function PersonalInfoScreen() {
    const { user, updateUserData } = useAuth();
    const themeColors = useThemeColor();
    const [personalInfo, setPersonalInfo] = useState({
        nombre: '',
        apellido: '',
        telefono: '',
        direccion: '',
        fechaNacimiento: new Date(),
        profilePicture: '',
    });

    useEffect(() => {
        if (user) {
            setPersonalInfo({
                nombre: user.personalData.name || '',
                apellido: user.personalData.surname || '',
                telefono: user.personalData.phone || '',
                direccion: user.personalData.address || '',
                fechaNacimiento: user.personalData.dateOfBirth ? new Date(user.personalData.dateOfBirth) : new Date(),
                profilePicture: user.personalData.profilePicture || '',
            });
        }
    }, [user]);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const selectedAsset = result.assets[0];
            const manipResult = await ImageManipulator.manipulateAsync(
                selectedAsset.uri,
                [{ resize: { width: 300 } }],
                { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
            );

            setPersonalInfo(prev => ({ ...prev, profilePicture: manipResult.uri }));
        }
    };

    const handleSave = async () => {
        try {
            const formData = new FormData();
            formData.append('name', personalInfo.nombre);
            formData.append('surname', personalInfo.apellido);
            formData.append('phone', personalInfo.telefono);
            formData.append('address', personalInfo.direccion);
            formData.append('dateOfBirth', personalInfo.fechaNacimiento.toISOString().split('T')[0]);

            if (personalInfo.profilePicture) {
                const filename = personalInfo.profilePicture.split('/').pop();
                const match = /\.(\w+)$/.exec(filename || '');
                const type = match ? `image/${match[1]}` : `image`;
                formData.append('profilePicture', {
                    uri: personalInfo.profilePicture,
                    name: filename,
                    type,
                } as any);
            }

            await updateUserData(formData);
            Alert.alert('Éxito', 'Información personal actualizada correctamente');
        } catch (error) {
            console.error('Error al actualizar información personal:', error);
            Alert.alert('Error', 'No se pudo actualizar la información personal');
        }
    };

    return (
        <ThemedLayout padding={[0, 40]}>
            <View style={styles.content}>
                <View style={styles.profileSection}>
                    <TouchableOpacity onPress={pickImage} style={styles.profileImageContainer}>
                        {personalInfo.profilePicture ? (
                            <Image source={{ uri: personalInfo.profilePicture }} style={styles.profileImage} />
                        ) : (
                            <AvatarIcon width={80} height={80} style={styles.profileImage} />
                        )}
                        <View style={[styles.editButton, { backgroundColor: themeColors.buttonBackgroundColor }]}>
                            <Ionicons name="pencil" size={10} color={themeColors.white} />
                        </View>
                    </TouchableOpacity>
                    <View>
                        <ThemedText variant="title" textAlign="center" marginBottom={4}>{personalInfo.nombre} {personalInfo.apellido}</ThemedText>
                        <ThemedText variant="paragraph" textAlign="center">{user?.personalData.email || 'No email'}</ThemedText>
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