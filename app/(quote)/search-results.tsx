import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/shared/hooks/useThemeColor';
import { ThemedText } from '@/shared/components/ThemedText';
import { ThemedLayout } from '@/shared/components/ThemedLayout';
import { ThemedInput } from '@/shared/components/ThemedInput';
import { ThemedButton } from '@/shared/components/ThemedButton';
import { ThemedView } from '@/shared/components/ThemedView';
import { Vehicle, OWNER_OPTIONS_MAP } from '@/core/types/quote';
import { quoteVehicle } from '@/core/services/quoteService';
import { useAuth } from '@/core/context/AuthContext';
import { searchCompanies } from '@/core/services/quoteService';
import { VehicleCard } from '@/shared/components/VehicleCard';
import { startQuotationFlow } from '@/core/services/quotationFlowService';
import { LoadingScreen } from '@/shared/components/LoadingScreen';
import { MessageModal } from '@/shared/components/MessageModal';
import { ROUTES } from '@/core/types/routes';

export default function SearchResultsScreen() {
  const { type, value, vehicle: initialVehicle, referredId: initialReferredId } = useLocalSearchParams();
  const themeColors = useThemeColor();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [buyerRut, setBuyerRut] = useState('');
  const [ownerOption, setOwnerOption] = useState(Object.keys(OWNER_OPTIONS_MAP)[0]);
  const [referredId, setReferredId] = useState<string>('');
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    try {
      if (initialVehicle && initialReferredId) {
        const vehicleString = decodeURIComponent(initialVehicle as string);
        const parsedVehicle = JSON.parse(vehicleString);

        setVehicle(parsedVehicle);
        setSelectedVehicle(parsedVehicle);
        setReferredId(initialReferredId as string);
      }
    } catch (error) {
      console.error('Error al procesar el vehículo:', error);
      setErrorMessage('Hubo un problema al cargar los resultados');
      setIsErrorModalVisible(true);
    }
  }, [initialVehicle, initialReferredId]);

  const handleQuote = async () => {
    setIsLoading(true);
    if (!selectedVehicle || !buyerRut || !ownerOption || !referredId) {
      setErrorMessage('Por favor complete todos los campos requeridos');
      setIsErrorModalVisible(true);
      return;
    }

    try {
      console.log('referredId', referredId);
      const response = await startQuotationFlow({
        referredId: referredId,
        ppu: selectedVehicle.ppu,
        brand: selectedVehicle.brand,
        model: selectedVehicle.model,
        year: selectedVehicle.year,
        colour: selectedVehicle.colour,
        engineNum: selectedVehicle.engineNum,
        chassisNum: selectedVehicle.chassisNum,
        purchaserId: buyerRut,
        ownerOption: OWNER_OPTIONS_MAP[ownerOption as keyof typeof OWNER_OPTIONS_MAP],
      });
      console.log('response', response.vehicle);

      router.push({
        pathname: ROUTES.QUOTE.QUOTE_RESULTS,
        params: {
          plans: encodeURIComponent(JSON.stringify(response.plans)),
          referredId: response.referredId,
          vehicle: encodeURIComponent(JSON.stringify(response.vehicle))
        }
      });

    } catch (error) {
      console.error('Error al cotizar:', error);
      setErrorMessage('No se pudo realizar la cotización');
      setIsErrorModalVisible(true);
    } finally {
      setIsLoading(false);
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
    <ThemedLayout padding={[0, 24]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <ThemedText variant="superTitle">
            Resultado de la Búsqueda
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

        <ThemedText variant="subTitle" textAlign="center" style={{ marginVertical: 8 }}>
          Datos del comprador
        </ThemedText>

        <ThemedInput
          label="RUT del comprador"
          placeholder="RUT"
          value={buyerRut}
          onChangeText={setBuyerRut}
          isRUT
        />

        <ThemedInput
          label="¿Es el dueño del vehículo?"
          placeholder="Seleccione una opción"
          value={ownerOption}
          onChangeText={setOwnerOption}
          isSelect
          options={Object.keys(OWNER_OPTIONS_MAP)}
        />
      </View>

      <ThemedButton
        text="Siguiente"
        onPress={handleQuote}
        style={styles.nextButton}
        disabled={!selectedVehicle || !buyerRut || !ownerOption || !referredId}
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
      {isLoading && (
        <LoadingScreen />
      )}
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
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehicleInfo: {
    flex: 1,
    marginLeft: 16,
  },
  nextButton: {
    marginTop: 24,
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