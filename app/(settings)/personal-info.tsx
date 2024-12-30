import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { useThemeColor } from '@/shared/hooks';
import { ThemedLayout, ThemedDatePicker, ThemedInput, ThemedButton, ProfilePictureModal, AvatarIcon, MessageModal, ThemedText } from '@/shared/components';
import { validateName, validatePhoneNumber, validateAddress } from '@/shared/utils/validations';
import { useSettings } from '@/core/context';
import { PersonalData } from '@/core/types';
import { Ionicons } from '@expo/vector-icons';

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
    const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [successModalVisible, setSuccessModalVisible] = useState(false);
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
            setErrorMessage('Error al procesar la imagen');
            setIsErrorModalVisible(true);
        }
    };

    const handleSave = async () => {
        console.log('🔄 Iniciando guardado de información personal');
        const newErrors: FormErrors = {
            name: '',
            surname: '',
            phone: '',
            address: '',
        };

        let hasErrors = false;

        if (!validateName(formData.name)) {
            newErrors.name = 'Nombre inválido';
            hasErrors = true;
        }

        if (!validateName(formData.surname)) {
            newErrors.surname = 'Apellido inválido';
            hasErrors = true;
        }

        if (!validatePhoneNumber(formData.phone)) {
            newErrors.phone = 'Teléfono inválido';
            hasErrors = true;
        }

        if (!validateAddress(formData.address)) {
            newErrors.address = 'Dirección inválida';
            hasErrors = true;
        }

        setErrors(newErrors);

        if (hasErrors) {
            return;
        }

        try {
            const updateData: Partial<PersonalData> = {
                name: formData.name,
                surname: formData.surname,
                phone: formData.phone,
                address: formData.address,
                dateOfBirth: formData.dateOfBirth?.toISOString().split('T')[0] || '',
            };

            if (formData.profilePicture && !formData.profilePicture.startsWith('data:image')) {
                updateData.profilePicture = formData.profilePicture;
            }

            console.log('📤 Enviando datos:', updateData);
            await updatePersonalInfo(updateData);
            
            console.log('✅ Información actualizada exitosamente');
            setSuccessMessage('Información personal actualizada correctamente');
            setSuccessModalVisible(true);
        } catch (error) {
            console.error('❌ Error al actualizar información:', error);
            setErrorMessage('No se pudo actualizar la información personal');
            setIsErrorModalVisible(true);
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
                    style={styles.Button}
                />

            <ProfilePictureModal
                isVisible={isModalVisible}
                onClose={() => setModalVisible(false)}
                onDelete={handleDeleteImage}
                onChange={handleImagePicker}
            />

            <MessageModal
                isVisible={successModalVisible}
                onClose={() => setSuccessModalVisible(false)}
                title="Éxito"
                message={successMessage}
                icon={{
                    name: "checkmark-circle-outline",
                    color: themeColors.status.success
                }}
                primaryButton={{
                    text: "Entendido",
                    onPress: () => setSuccessModalVisible(false)
                }}
            />

            <MessageModal
                isVisible={isErrorModalVisible}
                onClose={() => setIsErrorModalVisible(false)}
                title="Error"
                message={errorMessage}
                icon={{
                    name: "alert-circle-outline",
                    color: themeColors.status.error
                }}
                primaryButton={{
                    text: "Entendido",
                    onPress: () => setIsErrorModalVisible(false)
                }}
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
    Button: {
        marginTop: 24,
    },
});
