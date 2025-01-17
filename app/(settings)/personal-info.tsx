import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { useThemeColor } from '@/shared/hooks';
import { ThemedLayout, ThemedDatePicker, ThemedInput, ThemedButton, ProfilePictureModal, AvatarIcon, MessageModal, ThemedText } from '@/shared/components';
import { validateName, validatePhoneNumber, validateAddress } from '@/shared/utils/validations';
import { useSettings } from '@/core/context';
import { PersonalData, ROUTES } from '@/core/types';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMessageConfig } from '@/shared/hooks';

interface FormData extends Omit<PersonalData, 'dateOfBirth' | 'email'> {
    dateOfBirth: Date | null;
    profilePicture: string;
}

interface FormErrors {
    name: string;
    surname: string;
    phone: string;
    address: string;
}

export default function PersonalInfoScreen() {
    const { personalInfo, updatePersonalInfo } = useSettings();
    const themeColors = useThemeColor();
    const [isModalVisible, setModalVisible] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        name: personalInfo.name || '',
        surname: personalInfo.surname || '',
        phone: personalInfo.phone || '',
        address: personalInfo.address || '',
        dateOfBirth: personalInfo.dateOfBirth ? new Date(personalInfo.dateOfBirth) : null,
        profilePicture: personalInfo.profilePicture ? `data:image/jpeg;base64,${personalInfo.profilePicture}` : '',
    });
    const [errors, setErrors] = useState<FormErrors>({
        name: '',
        surname: '',
        phone: '',
        address: '',
    });

    useMessageConfig(['/users/update']);

    useEffect(() => {
        if (personalInfo) {
            setFormData({
                name: personalInfo.name || '',
                surname: personalInfo.surname || '',
                phone: personalInfo.phone || '',
                address: personalInfo.address || '',
                dateOfBirth: personalInfo.dateOfBirth ? new Date(personalInfo.dateOfBirth) : null,
                profilePicture: personalInfo.profilePicture ? `data:image/jpeg;base64,${personalInfo.profilePicture}` : '',
            });
        }
    }, [personalInfo]);

    const thereIsProfilePicture = () => {
        if (formData.profilePicture !== '') {
            setModalVisible(true);
        } else {
            handleImagePicker();
        }
    };

    const handleImagePicker = async () => {
        setModalVisible(false);
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
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

                setFormData(prev => ({ ...prev, profilePicture: manipResult.uri }));
            }
        } catch (error) {
            console.error('Error al procesar la imagen:', error);
        }
    };

    const handleSave = async () => {
        try {
            let profilePictureToSend = formData.profilePicture;

            // Si la imagen está en base64 (imagen existente del usuario)
            if (formData.profilePicture && formData.profilePicture.startsWith('data:image')) {
                const base64Data = formData.profilePicture.split(',')[1];
                const filePath = `${FileSystem.documentDirectory}profilePicture.jpg`;
                await FileSystem.writeAsStringAsync(filePath, base64Data, { encoding: FileSystem.EncodingType.Base64 });
                profilePictureToSend = filePath;
            } else if (!formData.profilePicture) {
                // Si el usuario ha eliminado la imagen
                profilePictureToSend = '';
            }
            // Si no, es una nueva imagen seleccionada (ya está en formato URI)

            const updateData: Partial<PersonalData> = {
                name: formData.name,
                surname: formData.surname,
                phone: formData.phone,
                address: formData.address,
                dateOfBirth: formData.dateOfBirth?.toISOString().split('T')[0] || '',
            };

            if (profilePictureToSend !== '') {
                updateData.profilePicture = profilePictureToSend;
            }

            await updatePersonalInfo(updateData);
            
            // Esperar un momento para que el mensaje se muestre antes de navegar
            setTimeout(() => {
                router.replace(ROUTES.TABS.INDEX);
            }, 1500);
            
        } catch (error) {
            console.error('Error al actualizar información:', error);
        }
    };

    const handleDeleteImage = () => {
        setFormData((prev: FormData) => ({
            ...prev,
            profilePicture: ''
        }));
        setModalVisible(false);
    };


    return (
        <ThemedLayout padding={[0, 40]}>
            <View style={styles.content}>
                <View style={styles.profileSection}>
                    <TouchableOpacity onPress={thereIsProfilePicture} style={styles.profileImageContainer}>
                        {formData.profilePicture ? (
                            <Image source={{ uri: formData.profilePicture }} style={styles.profileImage} />
                        ) : (
                            <AvatarIcon width={120} height={120} style={styles.profileImage} />
                        )}
                        <View style={[styles.editButton, { backgroundColor: themeColors.buttonBackgroundColor }]}>
                            <Ionicons name="camera-outline" size={22} color={themeColors.white} />
                        </View>
                    </TouchableOpacity>
                    <View>
                        <ThemedText variant="title" textAlign="center" marginBottom={4}>{personalInfo.name} {personalInfo.surname}</ThemedText>
                        <ThemedText variant="paragraph" textAlign="center">{personalInfo.email || 'No email'}</ThemedText>
                    </View>
                </View>

                <ThemedInput
                    label="Nombre"
                    value={formData.name}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                    placeholder="Ingrese su nombre"
                    error={errors.name}
                />

                <ThemedInput
                    label="Apellido"
                    value={formData.surname}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, surname: text }))}
                    placeholder="Ingrese su apellido"
                    error={errors.surname}
                />

                <ThemedInput
                    label="Teléfono"
                    value={formData.phone}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
                    placeholder="Ingrese su teléfono"
                    error={errors.phone}
                    keyboardType="phone-pad"
                />

                <ThemedInput
                    label="Dirección"
                    value={formData.address}
                    onChangeText={(text) => setFormData(prev => ({ ...prev, address: text }))}
                    placeholder="Ingrese su dirección"
                    error={errors.address}
                />

                <ThemedDatePicker
                    label="Fecha de nacimiento"
                    value={formData.dateOfBirth}
                    onChange={(date) => setFormData(prev => ({ ...prev, dateOfBirth: date }))}
                    placeholder="Seleccione su fecha de nacimiento"
                />

            </View>
            <ThemedButton
                text="Guardar cambios"
                onPress={handleSave}
                style={styles.button}
            />

            <ProfilePictureModal
                isVisible={isModalVisible}
                onClose={() => setModalVisible(false)}
                onDelete={handleDeleteImage}
                onChange={handleImagePicker}
            />

        </ThemedLayout>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
        marginBottom: 48,
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
    button: {
        marginTop: 24,
    },
});
