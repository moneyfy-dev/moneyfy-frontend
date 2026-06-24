import React, { useEffect, useMemo, useState } from 'react';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSettings } from '@/core/context';
import { PersonalData, ROUTES } from '@/core/types';
import { useMessageConfig, useThemeColor } from '@/shared/hooks';
import {
  AvatarIcon,
  ProfilePictureModal,
  ThemedButton,
  ThemedDatePicker,
  ThemedInput,
  ThemedLayout,
  ThemedText,
} from '@/shared/components';
import {
  sanitizeAddress,
  validateAddress,
  validateName,
  validatePhoneNumber,
} from '@/shared/utils/validations';

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

const createFormData = (personalInfo: Partial<PersonalData>): FormData => ({
  name: personalInfo.name || '',
  surname: personalInfo.surname || '',
  phone: personalInfo.phone || '',
  address: personalInfo.address || '',
  dateOfBirth: personalInfo.dateOfBirth ? new Date(personalInfo.dateOfBirth) : null,
  profilePicture: personalInfo.profilePicture
    ? `data:image/jpeg;base64,${personalInfo.profilePicture}`
    : '',
});

const createEmptyErrors = (): FormErrors => ({
  name: '',
  surname: '',
  phone: '',
  address: '',
});

const normalizeComparableForm = (formData: FormData) => ({
  name: formData.name.trim(),
  surname: formData.surname.trim(),
  phone: formData.phone.trim(),
  address: formData.address.trim(),
  dateOfBirth: formData.dateOfBirth ? formData.dateOfBirth.toISOString().split('T')[0] : '',
  profilePicture: formData.profilePicture,
});

export default function PersonalInfoScreen() {
  const { personalInfo, updatePersonalInfo } = useSettings();
  const themeColors = useThemeColor();
  const insets = useSafeAreaInsets();
  const defaultBirthDate = useMemo(() => {
    const nextDate = new Date();
    nextDate.setFullYear(nextDate.getFullYear() - 20);
    return nextDate;
  }, []);
  const maximumBirthDate = useMemo(() => new Date(), []);

  const [isModalVisible, setModalVisible] = useState(false);
  const [formData, setFormData] = useState<FormData>(() => createFormData(personalInfo || {}));
  const [errors, setErrors] = useState<FormErrors>(createEmptyErrors());
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useMessageConfig(['/users/update']);

  useEffect(() => {
    if (!personalInfo) {
      return;
    }

    if (!hasInitialized || !isDirty) {
      setFormData(createFormData(personalInfo));
      setErrors(createEmptyErrors());
      setHasInitialized(true);
    }
  }, [hasInitialized, isDirty, personalInfo]);

  const initialComparableData = useMemo(
    () => normalizeComparableForm(createFormData(personalInfo || {})),
    [personalInfo],
  );

  const currentComparableData = useMemo(
    () => normalizeComparableForm(formData),
    [formData],
  );

  const hasChanges =
    JSON.stringify(initialComparableData) !== JSON.stringify(currentComparableData);

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setIsDirty(true);
    setFormData((prev) => ({ ...prev, [key]: value }));

    if (key in errors) {
      setErrors((prev) => ({
        ...prev,
        [key]: '',
      }));
    }
  };

  const thereIsProfilePicture = () => {
    if (formData.profilePicture) {
      setModalVisible(true);
      return;
    }

    void handleImagePicker();
  };

  const handleImagePicker = async () => {
    setModalVisible(false);

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (result.canceled || !result.assets?.length) {
        return;
      }

      const selectedAsset = result.assets[0];
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        selectedAsset.uri,
        [{ resize: { width: 300 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG },
      );

      setIsDirty(true);
      setFormData((prev) => ({
        ...prev,
        profilePicture: manipulatedImage.uri,
      }));
    } catch (error) {
      console.error('Error al procesar la imagen:', error);
    }
  };

  const validateForm = () => {
    const nextErrors = createEmptyErrors();
    let isValid = true;

    if (!formData.name.trim()) {
      nextErrors.name = 'Ingrese el nombre';
      isValid = false;
    } else if (!validateName(formData.name)) {
      nextErrors.name = 'Nombre invalido';
      isValid = false;
    }

    if (!formData.surname.trim()) {
      nextErrors.surname = 'Ingrese el apellido';
      isValid = false;
    } else if (!validateName(formData.surname)) {
      nextErrors.surname = 'Apellido invalido';
      isValid = false;
    }

    if (formData.phone.trim() && !validatePhoneNumber(formData.phone)) {
      nextErrors.phone = 'Telefono invalido';
      isValid = false;
    }

    if (formData.address.trim() && !validateAddress(formData.address)) {
      nextErrors.address = 'Direccion invalida';
      isValid = false;
    }

    setErrors(nextErrors);
    return isValid;
  };

  const handleSave = async () => {
    if (!hasChanges) {
      router.back();
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      let profilePictureToSend = formData.profilePicture;

      if (formData.profilePicture && formData.profilePicture.startsWith('data:image')) {
        const base64Data = formData.profilePicture.split(',')[1];
        const filePath = `${FileSystem.documentDirectory}profilePicture.jpg`;
        await FileSystem.writeAsStringAsync(filePath, base64Data, {
          encoding: FileSystem.EncodingType.Base64,
        });
        profilePictureToSend = filePath;
      } else if (!formData.profilePicture) {
        profilePictureToSend = '';
      }

      const updateData: Partial<PersonalData> = {
        name: formData.name.trim(),
        surname: formData.surname.trim(),
        phone: formData.phone.trim(),
        address: sanitizeAddress(formData.address),
        dateOfBirth: formData.dateOfBirth?.toISOString().split('T')[0] || '',
      };

      if (profilePictureToSend !== '') {
        updateData.profilePicture = profilePictureToSend;
      }

      await updatePersonalInfo(updateData);
      setIsDirty(false);

      setTimeout(() => {
        router.replace(ROUTES.TABS.INDEX);
      }, 1500);
    } catch {
    }
  };

  const handleDeleteImage = () => {
    setIsDirty(true);
    setFormData((prev) => ({
      ...prev,
      profilePicture: '',
    }));
    setModalVisible(false);
  };

  return (
    <ThemedLayout padding={[0, Math.max(120, insets.bottom + 96)]}>
      <View style={styles.content}>
        <View style={styles.profileSection}>
          <TouchableOpacity onPress={thereIsProfilePicture} style={styles.profileImageContainer}>
            {formData.profilePicture ? (
              <Image source={{ uri: formData.profilePicture }} style={styles.profileImage} />
            ) : (
              <AvatarIcon width={120} height={120} style={styles.profileImage} />
            )}
            <View
              style={[
                styles.editButton,
                { backgroundColor: themeColors.buttonBackgroundColor },
              ]}
            >
              <Ionicons name="camera-outline" size={22} color={themeColors.white} />
            </View>
          </TouchableOpacity>

          <View>
            <ThemedText variant="title" textAlign="center" marginBottom={4}>
              {formData.name || personalInfo.name} {formData.surname || personalInfo.surname}
            </ThemedText>
            <ThemedText variant="paragraph" textAlign="center">
              {personalInfo.email || 'No email'}
            </ThemedText>
          </View>
        </View>

        <ThemedInput
          label="Nombre"
          value={formData.name}
          onChangeText={(text) => updateField('name', text)}
          placeholder="Ingrese su nombre"
          error={errors.name}
        />

        <ThemedInput
          label="Apellido"
          value={formData.surname}
          onChangeText={(text) => updateField('surname', text)}
          placeholder="Ingrese su apellido"
          error={errors.surname}
        />

        <ThemedInput
          label="Teléfono"
          value={formData.phone}
          onChangeText={(text) => updateField('phone', text)}
          placeholder="Ingrese su teléfono"
          error={errors.phone}
          keyboardType="phone-pad"
        />

        <ThemedInput
          label="Dirección"
          value={formData.address}
          onChangeText={(text) => updateField('address', text)}
          placeholder="Ingrese su dirección"
          error={errors.address}
        />

        <ThemedDatePicker
          label="Fecha de nacimiento"
          value={formData.dateOfBirth}
          onChange={(date) => updateField('dateOfBirth', date)}
          placeholder="Seleccione su fecha de nacimiento"
          initialPickerDate={defaultBirthDate}
          maximumDate={maximumBirthDate}
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
    flexGrow: 0,
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
