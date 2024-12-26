import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { useThemeColor } from '@/shared/hooks';
import { ThemedLayout, ThemedDatePicker, ThemedInput, ThemedButton, ProfilePictureModal, AvatarIcon, MessageModal, ThemedText } from '@/shared/components';
import { validateName, validatePhoneNumber, validateAddress } from '@/shared/utils/validations';
import { useSettings } from '@/core/context';
import { PersonalData } from '@/core/types';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

interface FormData extends Omit<PersonalData, 'dateOfBirth' | 'email' | 'enable'> {
    dateOfBirth: Date | null;
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
        profilePicture: personalInfo.profilePicture || '',
    });

    const [errors, setErrors] = useState<FormErrors>({
        name: '',
        surname: '',
        phone: '',
        address: '',
    });

    const handleSave = async () => {
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
            await updatePersonalInfo({
                ...formData,
                dateOfBirth: formData.dateOfBirth?.toISOString() || '',
                email: personalInfo.email,
                enable: personalInfo.enable,
            });
            
            setSuccessMessage('Información personal actualizada correctamente');
            setSuccessModalVisible(true);
        } catch (error) {
            setErrorMessage('No se pudo actualizar la información personal');
            setIsErrorModalVisible(true);
        }
    };

    const handleImagePicker = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.5,
            });

            if (!result.canceled) {
                const manipulatedImage = await ImageManipulator.manipulateAsync(
                    result.assets[0].uri,
                    [{ resize: { width: 300, height: 300 } }],
                    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
                );

                setFormData(prev => ({
                    ...prev,
                    profilePicture: manipulatedImage.uri
                }));
                setModalVisible(false);
            }
        } catch (error) {
            setErrorMessage('Error al procesar la imagen');
            setIsErrorModalVisible(true);
        }
    };

    const handleDeleteImage = () => {
        setFormData(prev => ({
            ...prev,
            profilePicture: ''
        }));
        setModalVisible(false);
    };

    return (
        <ThemedLayout padding={[0, 40]}>
            <View style={styles.content}>
                <View style={styles.profileSection}>
                    <TouchableOpacity 
                        style={styles.profileImageContainer}
                        onPress={() => setModalVisible(true)}
                    >
                        {formData.profilePicture ? (
                            <Image
                                source={{ uri: formData.profilePicture }}
                                style={styles.profileImage}
                            />
                        ) : (
                            <AvatarIcon width={120} height={120} style={styles.profileImage} />
                        )}
                        <View style={[styles.editButton, { backgroundColor: Colors.common.green2 }]}>
                            <Ionicons name="camera" size={20} color={Colors.common.white} />
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
