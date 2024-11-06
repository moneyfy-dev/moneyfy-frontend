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
import { validateName, validatePhoneNumber, validateAddress } from '@/utils/validations';
import axios from 'axios';
import { updateUserProfile } from '@/services/userService';
import * as FileSystem from 'expo-file-system';
import { ProfilePictureModal } from '@/components/ProfilePictureModal';

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
    const [errors, setErrors] = useState({
        nombre: '',
        apellido: '',
        telefono: '',
        direccion: '',
    });
    const [isModalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        if (user) {
            setPersonalInfo({
                nombre: user.personalData.name || '',
                apellido: user.personalData.surname || '',
                telefono: user.personalData.phone || '',
                direccion: user.personalData.address || '',
                fechaNacimiento: user.personalData.dateOfBirth ? new Date(user.personalData.dateOfBirth) : new Date(),
                profilePicture: user.personalData.profilePicture ? `data:image/jpeg;base64,${user.personalData.profilePicture}` : '',
            });
        }
    }, [user]);

    const pickImage = async () => {
        setModalVisible(false);
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

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            nombre: '',
            apellido: '',
            telefono: '',
            direccion: '',
        };

        if (!validateName(personalInfo.nombre)) {
            newErrors.nombre = 'Nombre inválido';
            isValid = false;
        }

        if (!validateName(personalInfo.apellido)) {
            newErrors.apellido = 'Apellido inválido';
            isValid = false;
        }

        if (!validatePhoneNumber(personalInfo.telefono)) {
            newErrors.telefono = 'Número de teléfono inválido';
            isValid = false;
        }

        if (!validateAddress(personalInfo.direccion)) {
            newErrors.direccion = 'La dirección solo puede contener letras, números, espacios, comas y puntos';
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
            let profilePicture = personalInfo.profilePicture;

            // Si la imagen de perfil no ha cambiado y está en base64, convertirla a un archivo JPEG
            if (profilePicture.startsWith('data:image')) {
                const base64Data = profilePicture.split(',')[1];
                const filePath = `${FileSystem.documentDirectory}profilePicture.jpg`;
                await FileSystem.writeAsStringAsync(filePath, base64Data, { encoding: FileSystem.EncodingType.Base64 });
                profilePicture = filePath;
            } else if (!profilePicture) {
                // Si el usuario ha eliminado la imagen, enviar una cadena vacía
                profilePicture = '';
            }

            const userData: {
                name: string;
                surname: string;
                phone: string;
                address: string;
                dateOfBirth: string;
                profilePicture?: string;
            } = {
                name: personalInfo.nombre,
                surname: personalInfo.apellido,
                phone: personalInfo.telefono,
                address: personalInfo.direccion,
                dateOfBirth: personalInfo.fechaNacimiento.toISOString().split('T')[0],
            };
            
            if (profilePicture !== '') {
                userData.profilePicture = profilePicture;
            }

            const response = await updateUserProfile(userData);
            
            if (response && response.data && response.data.user) {
                // Actualizar los datos del usuario en el contexto de autenticación
                await updateUserData(response.data.user);
                Alert.alert('Éxito', 'Información personal actualizada correctamente');
            } else {
                throw new Error('Respuesta inesperada del servidor');
            }
        } catch (error) {
            console.error('Error al actualizar la información personal:', error);
            if (axios.isAxiosError(error)) {
                console.error('Error response:', error.response?.data);
                console.error('Error status:', error.response?.status);
                console.error('Error headers:', error.response?.headers);
            }
            Alert.alert('Error', 'No se pudo actualizar la información personal');
        }
    };

    const handleDeleteProfilePicture = () => {
        setPersonalInfo(prev => ({ ...prev, profilePicture: '' }));
        setModalVisible(false); // Cierra el modal después de la acción
    };

    const thereIsprofilePicture = () => {
        if (personalInfo.profilePicture !== '') {
            setModalVisible(true);
        } else {
            pickImage();
        }
    }

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    return (
        <ThemedLayout padding={[0, 40]}>
            <View style={styles.content}>
                <View style={styles.profileSection}>
                    <TouchableOpacity onPress={thereIsprofilePicture} style={styles.profileImageContainer}>
                        {personalInfo.profilePicture ? (
                            <Image source={{ uri: personalInfo.profilePicture }} style={styles.profileImage} />
                        ) : (
                            <AvatarIcon width={120} height={120} style={styles.profileImage} />
                        )}
                        <View style={[styles.editButton, { backgroundColor: themeColors.buttonBackgroundColor }]}>
                            <Ionicons name="camera-outline" size={22} color={themeColors.white} />
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
                    error={errors.nombre}
                />

                <ThemedInput
                    label="Apellido"
                    value={personalInfo.apellido}
                    onChangeText={(value) => setPersonalInfo({ ...personalInfo, apellido: value })}
                    placeholder="Ingrese su apellido"
                    error={errors.apellido}
                />

                <ThemedInput
                    label="Teléfono"
                    value={personalInfo.telefono}
                    onChangeText={(value) => setPersonalInfo({ ...personalInfo, telefono: value })}
                    placeholder="+56912345678"
                    keyboardType="phone-pad"
                    error={errors.telefono}
                />

                <ThemedInput
                    label="Dirección"
                    value={personalInfo.direccion}
                    onChangeText={(value) => {
                        setPersonalInfo({ ...personalInfo, direccion: value });
                        if (value && !validateAddress(value)) {
                            setErrors(prev => ({ ...prev, direccion: 'La dirección solo puede contener letras, números, espacios, comas y puntos' }));
                        } else {
                            setErrors(prev => ({ ...prev, direccion: '' }));
                        }
                    }}
                    placeholder="Ingrese su dirección"
                    error={errors.direccion}
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
            <ProfilePictureModal
                isVisible={isModalVisible}
                onClose={handleCloseModal}
                onDelete={handleDeleteProfilePicture}
                onChange={pickImage}
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
        width: 120,
        height: 120,
        marginBottom: 16,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
    },
    editButton: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 36,
        height: 36,
        borderRadius: 18,
        position: 'absolute',
        right: 0,
        bottom: 0,
    },
});
