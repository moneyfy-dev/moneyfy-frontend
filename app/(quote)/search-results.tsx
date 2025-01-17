import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { OWNER_OPTIONS_MAP, ROUTES } from '@/core/types';
import { View, StyleSheet } from 'react-native';
import { useMessageConfig, useThemeColor } from '@/shared/hooks';
import {
  ThemedText,
  ThemedLayout,
  ThemedInput,
  ThemedButton,
  ThemedView,
  VehicleCard,
  LoadingScreen
} from '@/shared/components';
import { useQuote } from '@/core/context';
import { Ionicons } from '@expo/vector-icons';
import { validateRUT, validateName, validateEmail, validatePhoneNumber } from '@/shared/utils/validations';

export default function SearchResultsScreen() {
  const { value } = useLocalSearchParams();
  const themeColors = useThemeColor();
  const router = useRouter();
  const { startQuotationFlow, isLoading, vehicle, quoterId } = useQuote();
  const [formData, setFormData] = useState({
    purchaserId: '',
    purchaserName: '',
    purchaserPaternalSur: '',
    purchaserMaternalSur: '',
    purchaserEmail: '',
    purchaserPhone: '',
    isOwner: 'Si, soy el dueño del vehículo'
  });
  const [ownerOption, setOwnerOption] = useState(Object.keys(OWNER_OPTIONS_MAP)[0]);
  const [errors, setErrors] = useState({
    purchaserId: '',
    purchaserName: '',
    purchaserPaternalSur: '',
    purchaserMaternalSur: '',
    purchaserEmail: '',
    purchaserPhone: '',
  });

  useMessageConfig(['/quoter/vehicle/quote']);

  // Verificar que tenemos los datos necesarios
  useEffect(() => {
    if (!vehicle || !quoterId) {
      router.replace(ROUTES.TABS.QUOTE);
    }
  }, [vehicle, quoterId]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      purchaserId: '',
      purchaserName: '',
      purchaserPaternalSur: '',
      purchaserMaternalSur: '',
      purchaserEmail: '',
      purchaserPhone: '',
    };

    if (formData.purchaserId && !validateRUT(formData.purchaserId)) {
      newErrors.purchaserId = 'RUT inválido';
      isValid = false;
    }

    if (formData.purchaserName && !validateName(formData.purchaserName)) {
      newErrors.purchaserName = 'Nombre inválido';
      isValid = false;
    }

    if (formData.purchaserPaternalSur && !validateName(formData.purchaserPaternalSur)) {
      newErrors.purchaserPaternalSur = 'Apellido Paterno inválido';
      isValid = false;
    }

    if (formData.purchaserMaternalSur && !validateName(formData.purchaserMaternalSur)) {
      newErrors.purchaserMaternalSur = 'Apellido Materno inválido';
      isValid = false;
    }

    if (formData.purchaserEmail && !validateEmail(formData.purchaserEmail)) {
      newErrors.purchaserEmail = 'Email inválido';
      isValid = false;
    }

    if (formData.purchaserPhone && !validatePhoneNumber(formData.purchaserPhone)) {
      newErrors.purchaserPhone = 'Teléfono inválido';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleQuote = async () => {
    
    if (!validateForm()) {
      return;
    }

    if (!formData.purchaserId.trim() && !formData.purchaserName.trim() && !formData.purchaserPaternalSur.trim() && !formData.purchaserMaternalSur.trim() && !formData.purchaserEmail.trim() && !formData.purchaserPhone.trim()) {
      setErrors({
        purchaserId: 'Ingrese el RUT del propietario',
        purchaserName: 'Ingrese el nombre del propietario',
        purchaserPaternalSur: 'Ingrese el apellido paterno del propietario',
        purchaserMaternalSur: 'Ingrese el apellido materno del propietario',
        purchaserEmail: 'Ingrese el email del propietario',
        purchaserPhone: 'Ingrese el teléfono del propietario'
      });
      return;
    }

    if (!vehicle ||
      !formData.purchaserId ||
      !formData.purchaserName ||
      !formData.purchaserPaternalSur ||
      !formData.purchaserMaternalSur ||
      !formData.purchaserEmail ||
      !formData.purchaserPhone ||
      !ownerOption ||
      !quoterId) {
      return;
    }

    try {
      const response = await startQuotationFlow({
        quoterId: quoterId,
        ppu: vehicle.ppu,
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        requestType: 'Auto',
        purchaserId: formData.purchaserId,
        purchaserName: formData.purchaserName,
        purchaserPaternalSur: formData.purchaserPaternalSur,
        purchaserMaternalSur: formData.purchaserMaternalSur,
        purchaserEmail: formData.purchaserEmail,
        purchaserPhone: formData.purchaserPhone,
        ownerRelationOption: OWNER_OPTIONS_MAP[ownerOption as keyof typeof OWNER_OPTIONS_MAP],
      });
      router.push(ROUTES.QUOTE.QUOTE_RESULTS);
    } catch (error) {
    }
  };

  const getSearchValues = () => {
    try {
      const searchParams = JSON.parse(value as string);
      return (
        <View style={styles.searchValueContainer}>
          {searchParams.ownerId && (
            <View style={styles.searchItem}>
              <Ionicons name="person-outline" size={20} color={themeColors.textColorAccent} />
              <ThemedText variant="subTitle" color={themeColors.textColorAccent}>
                {searchParams.ownerId}
              </ThemedText>
            </View>
          )}
          {searchParams.ppu && (
            <View style={styles.searchItem}>
              <Ionicons name="car-outline" size={20} color={themeColors.textColorAccent} />
              <ThemedText variant="subTitle" color={themeColors.textColorAccent}>
                {searchParams.ppu}
              </ThemedText>
            </View>
          )}
        </View>
      );
    } catch (error) {
      return null;
    }
  };

  return (
    <>
      {isLoading ? <LoadingScreen /> : (
        <ThemedLayout padding={[0, 40]}>
          <View style={styles.content}>
            <View style={styles.header}>
              <ThemedText variant="superTitle">
                Resultados de búsqueda
              </ThemedText>
              {getSearchValues()}
              <ThemedText variant="paragraph" color={themeColors.textParagraph}>
                {vehicle
                  ? 'Hemos encontrado el siguiente vehículo'
                  : 'No se encontró el vehículo'}
              </ThemedText>
            </View>

            {vehicle && (
              <VehicleCard
                brand={vehicle.brand}
                model={vehicle.model}
                ppu={vehicle.ppu}
                year={vehicle.year}
                isSelected={true}
              />
            )}

            <ThemedView style={[styles.divider, { backgroundColor: themeColors.borderBackgroundColor }]} />

            <View style={styles.searchValueContainer}>
              <ThemedText variant="subTitle" textAlign="center">
                Datos del comprador
              </ThemedText>
            </View>

            <ThemedInput
              label="RUT del comprador"
              value={formData.purchaserId}
              onChangeText={(value) => setFormData({ ...formData, purchaserId: value })}
              error={errors.purchaserId}
              placeholder="RUT"
              isRUT={true}
            />

            <ThemedInput
              label="Nombre"
              placeholder="Nombre"
              value={formData.purchaserName}
              onChangeText={(value) => setFormData({ ...formData, purchaserName: value })}
              error={errors.purchaserName}
            />
            <ThemedInput
              label='Apellido Paterno'
              placeholder="Apellido Paterno"
              value={formData.purchaserPaternalSur}
              onChangeText={(value) => setFormData({ ...formData, purchaserPaternalSur: value })}
              error={errors.purchaserPaternalSur}
            />
            <ThemedInput
              label='Apellido Materno'
              placeholder="Apellido Materno"
              value={formData.purchaserMaternalSur}
              onChangeText={(value) => setFormData({ ...formData, purchaserMaternalSur: value })}
              error={errors.purchaserMaternalSur}
            />

            <ThemedInput
              label="Email"
              placeholder="Email"
              value={formData.purchaserEmail}
              onChangeText={(value) => setFormData({ ...formData, purchaserEmail: value })}
              keyboardType="email-address"
              error={errors.purchaserEmail}
            />
            <ThemedInput
              label="Teléfono"
              placeholder="Teléfono"
              value={formData.purchaserPhone}
              onChangeText={(value) => setFormData({ ...formData, purchaserPhone: value })}
              keyboardType="phone-pad"
              error={errors.purchaserPhone}
            />

            <ThemedInput
              style={{ marginBottom: 48 }}
              label="¿Es el dueño del vehículo?"
              value={formData.isOwner}
              onChangeText={(value) => setFormData({ ...formData, isOwner: value })}
              placeholder="Si, soy el dueño del vehículo"
              isSelect={true}
              options={Object.keys(OWNER_OPTIONS_MAP)}
            />
          </View>

          <ThemedButton
            text="Siguiente"
            onPress={handleQuote}
            disabled={!vehicle || !formData.purchaserId || !formData.purchaserName || !formData.purchaserPaternalSur || !formData.purchaserMaternalSur || !ownerOption}
            style={styles.button}
          />
        </ThemedLayout>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  header: {
    marginBottom: 24,
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: 20,
  },
  searchValueContainer: {
    marginVertical: 16,
    gap: 8,
  },
  searchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  button: {
    marginTop: 24,
  },
});