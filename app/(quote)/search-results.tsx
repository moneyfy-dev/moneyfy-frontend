import React, { useEffect, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuote } from '@/core/context';
import { OWNER_OPTIONS_MAP, ROUTES } from '@/core/types';
import { useMessageConfig, useThemeColor } from '@/shared/hooks';
import {
  LoadingScreen,
  MessageModal,
  ThemedButton,
  ThemedInput,
  ThemedLayout,
  ThemedText,
  ThemedView,
  VehicleCard,
} from '@/shared/components';
import {
  formatRUT,
  validateEmail,
  validateName,
  validatePhoneNumber,
  validateRUT,
} from '@/shared/utils/validations';
import { getQuoteErrorMessage } from '@/shared/utils/quoteErrors';

export default function SearchResultsScreen() {
  const { value } = useLocalSearchParams();
  const themeColors = useThemeColor();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const rutInputRef = useRef<TextInput>(null);
  const { startQuotationFlow, isLoading, vehicle, quoterId } = useQuote();
  const [quoteError, setQuoteError] = useState('');
  const [rutErrorVisible, setRutErrorVisible] = useState(false);
  const [rutInputY, setRutInputY] = useState(0);
  const [formData, setFormData] = useState({
    purchaserId: '',
    purchaserName: '',
    purchaserPaternalSur: '',
    purchaserMaternalSur: '',
    purchaserEmail: '',
    purchaserPhone: '',
    isOwner: 'Sí, soy el dueño del vehículo',
  });
  const [errors, setErrors] = useState({
    purchaserId: '',
    purchaserName: '',
    purchaserPaternalSur: '',
    purchaserMaternalSur: '',
    purchaserEmail: '',
    purchaserPhone: '',
  });

  useMessageConfig(['/quoter/vehicle/quote']);

  const focusRutInput = () => {
    scrollRef.current?.scrollTo({ y: Math.max(rutInputY - 24, 0), animated: true });
    setTimeout(() => {
      rutInputRef.current?.focus();
    }, 250);
  };

  const closeRutError = () => {
    setRutErrorVisible(false);
    focusRutInput();
  };

  useEffect(() => {
    if (!vehicle || !quoterId) {
      router.replace(ROUTES.TABS.QUOTE);
    }
  }, [vehicle, quoterId, router]);

  const validateForm = () => {
    let isValid = true;
    const nextErrors = {
      purchaserId: '',
      purchaserName: '',
      purchaserPaternalSur: '',
      purchaserMaternalSur: '',
      purchaserEmail: '',
      purchaserPhone: '',
    };

    if (formData.purchaserId && !validateRUT(formData.purchaserId)) {
      nextErrors.purchaserId = 'RUT inválido';
      isValid = false;
    }

    if (formData.purchaserName && !validateName(formData.purchaserName)) {
      nextErrors.purchaserName = 'Nombre inválido';
      isValid = false;
    }

    if (formData.purchaserPaternalSur && !validateName(formData.purchaserPaternalSur)) {
      nextErrors.purchaserPaternalSur = 'Apellido paterno inválido';
      isValid = false;
    }

    if (formData.purchaserMaternalSur && !validateName(formData.purchaserMaternalSur)) {
      nextErrors.purchaserMaternalSur = 'Apellido materno inválido';
      isValid = false;
    }

    if (formData.purchaserEmail && !validateEmail(formData.purchaserEmail)) {
      nextErrors.purchaserEmail = 'Email inválido';
      isValid = false;
    }

    if (formData.purchaserPhone && !validatePhoneNumber(formData.purchaserPhone)) {
      nextErrors.purchaserPhone = 'Teléfono inválido';
      isValid = false;
    }

    setErrors(nextErrors);
    return isValid;
  };

  const handleQuote = async () => {
    if (!validateForm()) {
      if (formData.purchaserId && !validateRUT(formData.purchaserId)) {
        focusRutInput();
        setRutErrorVisible(true);
      }
      return;
    }

    if (
      !formData.purchaserId.trim() &&
      !formData.purchaserName.trim() &&
      !formData.purchaserPaternalSur.trim() &&
      !formData.purchaserMaternalSur.trim() &&
      !formData.purchaserEmail.trim() &&
      !formData.purchaserPhone.trim()
    ) {
      setErrors({
        purchaserId: 'Ingrese el RUT del propietario',
        purchaserName: 'Ingrese el nombre del propietario',
        purchaserPaternalSur: 'Ingrese el apellido paterno del propietario',
        purchaserMaternalSur: 'Ingrese el apellido materno del propietario',
        purchaserEmail: 'Ingrese el email del propietario',
        purchaserPhone: 'Ingrese el teléfono del propietario',
      });
      return;
    }

    if (
      !vehicle ||
      !formData.purchaserId ||
      !formData.purchaserName ||
      !formData.purchaserPaternalSur ||
      !formData.purchaserMaternalSur ||
      !formData.purchaserEmail ||
      !formData.purchaserPhone ||
      !formData.isOwner ||
      !quoterId
    ) {
      setErrors({
        purchaserId: !formData.purchaserId ? 'Ingrese el RUT del comprador' : '',
        purchaserName: !formData.purchaserName ? 'Ingrese el nombre del comprador' : '',
        purchaserPaternalSur: !formData.purchaserPaternalSur ? 'Ingrese el apellido paterno del comprador' : '',
        purchaserMaternalSur: !formData.purchaserMaternalSur ? 'Ingrese el apellido materno del comprador' : '',
        purchaserEmail: !formData.purchaserEmail ? 'Ingrese el email del comprador' : '',
        purchaserPhone: !formData.purchaserPhone ? 'Ingrese el teléfono del comprador' : '',
      });
      return;
    }

    const formattedPurchaserId = formatRUT(formData.purchaserId);

    try {
      setFormData((prev) => ({ ...prev, purchaserId: formattedPurchaserId }));
      await startQuotationFlow({
        quoterId,
        ppu: vehicle.ppu,
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        requestType: 'Auto',
        purchaserId: formattedPurchaserId,
        purchaserName: formData.purchaserName,
        purchaserPaternalSur: formData.purchaserPaternalSur,
        purchaserMaternalSur: formData.purchaserMaternalSur,
        purchaserEmail: formData.purchaserEmail,
        purchaserPhone: formData.purchaserPhone,
        ownerRelationOption:
          OWNER_OPTIONS_MAP[formData.isOwner as keyof typeof OWNER_OPTIONS_MAP],
      });
      router.push(ROUTES.QUOTE.QUOTE_RESULTS);
    } catch (error) {
      setQuoteError(
        getQuoteErrorMessage(error, {
          emptyPlansMessage:
            'No encontramos planes vigentes para este vehículo. Intenta con otra patente o vuelve a cotizar más tarde.',
          genericMessage:
            'No fue posible consultar las aseguradoras en este momento. Inténtalo nuevamente en unos minutos.',
          invalidJwtMessage:
            'Tu sesión ya no es válida para continuar con esta cotización. Cierra sesión e ingresa nuevamente.',
        })
      );
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
    } catch {
      return null;
    }
  };

  return (
    <>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <ThemedLayout
          padding={[0, Math.max(120, insets.bottom + 96)]}
          scrollRef={scrollRef}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <ThemedText variant="superTitle">Resultados de búsqueda</ThemedText>
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
                isSelected
              />
            )}

            <ThemedView
              style={[
                styles.divider,
                { backgroundColor: themeColors.borderBackgroundColor },
              ]}
            />

            <View style={styles.searchValueContainer}>
              <ThemedText variant="subTitle" textAlign="center">
                Datos del comprador
              </ThemedText>
            </View>

            <View onLayout={(event) => setRutInputY(event.nativeEvent.layout.y)}>
              <ThemedInput
                ref={rutInputRef}
                label="RUT del comprador"
                value={formData.purchaserId}
                onChangeText={(nextValue) =>
                  setFormData({ ...formData, purchaserId: nextValue })
                }
                error={errors.purchaserId}
                placeholder="RUT"
                isRUT
              />
            </View>

            <ThemedInput
              label="Nombre"
              placeholder="Nombre"
              value={formData.purchaserName}
              onChangeText={(nextValue) =>
                setFormData({ ...formData, purchaserName: nextValue })
              }
              error={errors.purchaserName}
            />
            <ThemedInput
              label="Apellido Paterno"
              placeholder="Apellido Paterno"
              value={formData.purchaserPaternalSur}
              onChangeText={(nextValue) =>
                setFormData({ ...formData, purchaserPaternalSur: nextValue })
              }
              error={errors.purchaserPaternalSur}
            />
            <ThemedInput
              label="Apellido Materno"
              placeholder="Apellido Materno"
              value={formData.purchaserMaternalSur}
              onChangeText={(nextValue) =>
                setFormData({ ...formData, purchaserMaternalSur: nextValue })
              }
              error={errors.purchaserMaternalSur}
            />

            <ThemedInput
              label="Email"
              placeholder="Email"
              value={formData.purchaserEmail}
              onChangeText={(nextValue) =>
                setFormData({ ...formData, purchaserEmail: nextValue })
              }
              keyboardType="email-address"
              error={errors.purchaserEmail}
            />
            <ThemedInput
              label="Teléfono"
              placeholder="Teléfono"
              value={formData.purchaserPhone}
              onChangeText={(nextValue) =>
                setFormData({ ...formData, purchaserPhone: nextValue })
              }
              keyboardType="phone-pad"
              error={errors.purchaserPhone}
            />

            <ThemedInput
              style={{ marginBottom: 48 }}
              label="¿Es el dueño del vehículo?"
              value={formData.isOwner}
              onChangeText={(nextValue) =>
                setFormData({ ...formData, isOwner: nextValue })
              }
              placeholder="Sí, soy el dueño del vehículo"
              isSelect
              options={Object.keys(OWNER_OPTIONS_MAP)}
            />
          </View>

          <ThemedButton
            text="Siguiente"
            onPress={handleQuote}
            disabled={
              !vehicle ||
              !formData.purchaserId ||
              !formData.purchaserName ||
              !formData.purchaserPaternalSur ||
              !formData.purchaserMaternalSur ||
              !formData.purchaserEmail ||
              !formData.purchaserPhone ||
              !formData.isOwner
            }
            style={styles.button}
          />
        </ThemedLayout>
      )}
      <MessageModal
        isVisible={!!quoteError}
        onClose={() => setQuoteError('')}
        title="No se pudo cotizar"
        message={quoteError}
        icon={{
          name: 'alert-circle-outline',
          color: themeColors.status.warning,
        }}
        primaryButton={{
          text: 'Entendido',
          onPress: () => setQuoteError(''),
        }}
      />
      <MessageModal
        isVisible={rutErrorVisible}
        onClose={closeRutError}
        title="RUT inválido"
        message="Revisa el RUT ingresado. Debe tener un formato válido y dígito verificador correcto."
        icon={{
          name: 'alert-circle-outline',
          color: themeColors.status.warning,
        }}
        primaryButton={{
          text: 'Entendido',
          onPress: closeRutError,
        }}
      />
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
