import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from '@/components/ThemedText';
import { ThemedLayout } from '@/components/ThemedLayout';
import { ThemedInput } from '@/components/ThemedInput';
import { ThemedButton } from '@/components/ThemedButton';
import { ThemedView } from '@/components/ThemedView';
import { Vehicle, OWNER_OPTIONS_MAP } from '@/types/quote';
import { quoteVehicle } from '@/services/quoteService';
import { useAuth } from '@/context/AuthContext';
import { searchCompanies } from '@/services/quoteService';

export default function SearchResultsScreen() {
  const { type, value, vehicle: initialVehicle, referredId: initialReferredId } = useLocalSearchParams();
  const themeColors = useThemeColor();
  const router = useRouter();
  const { updateUserData } = useAuth();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [buyerRut, setBuyerRut] = useState('');
  const [ownerOption, setOwnerOption] = useState(Object.keys(OWNER_OPTIONS_MAP)[0]);
  const [referredId, setReferredId] = useState<string>('');

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
      Alert.alert('Error', 'Hubo un problema al cargar los resultados');
    }
  }, [initialVehicle, initialReferredId]);

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleQuote = async () => {
    if (!selectedVehicle || !buyerRut || !ownerOption || !referredId) {
      Alert.alert('Error', 'Por favor complete todos los campos requeridos');
      return;
    }

    try {
      const quoteData = {
        referredId: referredId,
        ppu: selectedVehicle.ppu,
        brand: selectedVehicle.brand,
        model: selectedVehicle.model,
        year: selectedVehicle.year,
        colour: selectedVehicle.colour,
        engineNum: selectedVehicle.engineNum,
        purchaserId: buyerRut,
        ownerOption: OWNER_OPTIONS_MAP[ownerOption as keyof typeof OWNER_OPTIONS_MAP],
        companyAlias: "aseguradora1"
      };

      const response = await quoteVehicle(quoteData);
      
      if (response.data.user) {
        await updateUserData(response.data.user);
      }

      router.push({
        pathname: '/(quote)/quote-results',
        params: {
          plans: JSON.stringify(response.data.plans),
          referredId: response.data.referredId,
          vehicle: JSON.stringify(selectedVehicle)
        }
      });

    } catch (error) {
      console.error('Error al cotizar:', error);
      Alert.alert('Error', 'No se pudo realizar la cotización');
    }
  };

  const VehicleCard = ({ vehicle }: { vehicle: Vehicle }) => {
    const isSelected = selectedVehicle?.ppu === vehicle.ppu;
    
    return (
      <TouchableOpacity
        onPress={() => handleVehicleSelect(vehicle)}
        style={[
          styles.vehicleCard,
          { 
            borderColor: isSelected ? themeColors.textColorAccent : themeColors.borderBackgroundColor,
            backgroundColor: isSelected ? themeColors.backgroundCardColor : 'transparent'
          }
        ]}
      >
        <View style={[styles.iconContainer, { backgroundColor: themeColors.textColorAccent }]}>
          <Ionicons name='car-outline' size={24} color={themeColors.white} />
        </View>
        <View style={styles.vehicleInfo}>
          <ThemedText variant="paragraph">{vehicle.brand}</ThemedText>
          <ThemedText variant="subTitle">{vehicle.ppu} - {vehicle.year}</ThemedText>
          <ThemedText variant="paragraph" color={themeColors.textColorAccent}>
            {vehicle.model}
          </ThemedText>
        </View>
        <Ionicons 
          name={isSelected ? "checkmark-circle" : "chevron-forward"} 
          size={24} 
          color={isSelected ? themeColors.textColorAccent : themeColors.borderBackgroundColor} 
        />
      </TouchableOpacity>
    );
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
          <VehicleCard vehicle={vehicle} />
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