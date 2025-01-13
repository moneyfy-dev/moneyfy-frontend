import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { OWNER_OPTIONS_MAP, ROUTES } from '@/core/types';
import { View, StyleSheet } from 'react-native';
import { useThemeColor } from '@/shared/hooks';
import {
  ThemedText,
  ThemedLayout,
  ThemedInput,
  ThemedButton,
  ThemedView,
  VehicleCard,
  MessageModal,
  LoadingScreen
} from '@/shared/components';
import { useQuote } from '@/core/context';
import { Ionicons } from '@expo/vector-icons';

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
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Verificar que tenemos los datos necesarios
  useEffect(() => {
    console.log('🔍 Verificando datos en search-results:', {
      hasVehicle: !!vehicle,
      hasQuoterId: !!quoterId,
      vehicle,
      quoterId
    });

    if (!vehicle || !quoterId) {
      console.log('⚠️ Datos faltantes, redirigiendo a búsqueda');
      setErrorMessage('No se encontraron datos del vehículo');
      setIsErrorModalVisible(true);
      router.replace(ROUTES.TABS.QUOTE);
    }
  }, [vehicle, quoterId]);

  const handleQuote = async () => {
    if (!vehicle || !formData.purchaserId || !formData.purchaserName || !formData.purchaserPaternalSur || !formData.purchaserMaternalSur || !ownerOption || !quoterId) {
      setErrorMessage('Por favor complete todos los campos requeridos');
      setIsErrorModalVisible(true);
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
      console.error('Error al iniciar cotización:', error);
      setErrorMessage('No se pudo iniciar la cotización');
      setIsErrorModalVisible(true);
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
          placeholder="RUT"
          isRUT={true}
        />

        <ThemedInput
          label="Nombre"
          placeholder="Nombre"
          value={formData.purchaserName}
          onChangeText={(value) => setFormData({ ...formData, purchaserName: value })}
        />
        <ThemedInput
          label='Apellido Paterno'
          placeholder="Apellido Paterno"
          value={formData.purchaserPaternalSur}
          onChangeText={(value) => setFormData({ ...formData, purchaserPaternalSur: value })}
        />
        <ThemedInput
          label='Apellido Materno'
          placeholder="Apellido Materno"
          value={formData.purchaserMaternalSur}
          onChangeText={(value) => setFormData({ ...formData, purchaserMaternalSur: value })}
        />

        <ThemedInput
          label="Email"
          placeholder="Email"
          value={formData.purchaserEmail}
          onChangeText={(value) => setFormData({ ...formData, purchaserEmail: value })}
          keyboardType="email-address"
        />
        <ThemedInput
          label="Teléfono"
          placeholder="Teléfono"
          value={formData.purchaserPhone}
          onChangeText={(value) => setFormData({ ...formData, purchaserPhone: value })}
          keyboardType="phone-pad"
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
      />

      {isLoading ? <LoadingScreen /> : null}

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
});  