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

export default function SearchResultsScreen() {
  const { type, value, vehicles: initialVehicles } = useLocalSearchParams();
  const themeColors = useThemeColor();
  const router = useRouter();
  const { updateUserData } = useAuth();

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [buyerRut, setBuyerRut] = useState('');
  const [ownerOption, setOwnerOption] = useState(Object.keys(OWNER_OPTIONS_MAP)[0]);

  useEffect(() => {
    try {
      if (initialVehicles) {
        const vehiclesString = decodeURIComponent(initialVehicles as string);
        const parsedVehicles = JSON.parse(vehiclesString);
        
        setVehicles(parsedVehicles);
        
        // Si es búsqueda por patente y hay un solo vehículo, seleccionarlo automáticamente
        if (type === 'plate' && parsedVehicles.length === 1) {
          setSelectedVehicle(parsedVehicles[0]);
        }
      }
    } catch (error) {
      console.error('Error al procesar los vehículos:', error);
      Alert.alert('Error', 'Hubo un problema al cargar los resultados');
    }
  }, [initialVehicles, type]);

  const getVehicleIcon = (vehicleType: string) => {
    switch (vehicleType.toLowerCase()) {
      case 'motocicleta':
        return 'bicycle-outline';
      case 'suv':
        return 'car-sport-outline';
      default:
        return 'car-outline';
    }
  };

  const handleVehicleSelect = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleQuote = async () => {
    if (!selectedVehicle || !buyerRut || !ownerOption) {
      Alert.alert('Error', 'Por favor complete todos los campos requeridos');
      return;
    }

    try {
      const quoteData = {
        brand: 'toyota',
        model: 'corolla',
        year: '2019',
        purchaserId: '88.888.888-8',
        ownerOption: '0'
      };
      console.log('quoteData', quoteData);

      const response = await quoteVehicle(quoteData);
      
      if (response.data.user) {
        await updateUserData(response.data.user);
        router.push({
          pathname: '/(quote)/quote-results',
          params: {
            selectedVehicle: JSON.stringify(selectedVehicle),
            plans: JSON.stringify(response.data.plans)
          }
        });
      }
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
          <Ionicons name={getVehicleIcon(vehicle.type)} size={24} color={themeColors.white} />
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

  return (
    <ThemedLayout padding={[0, 24]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <ThemedText variant="superTitle">
            Resultados para {type === 'plate' ? 'la patente' : 'el RUT'}
          </ThemedText>
          <ThemedText variant="superTitle" color={themeColors.textColorAccent} marginBottom={8}>
            {value}
          </ThemedText>
          <ThemedText variant="paragraph" color={themeColors.textParagraph}>
            {vehicles.length > 0 
              ? `Hemos encontrado ${vehicles.length} resultado${vehicles.length !== 1 ? 's' : ''}`
              : 'No se encontraron vehículos'}
          </ThemedText>
        </View>

        <View>
          {vehicles.map((vehicle, index) => (
            <VehicleCard key={index} vehicle={vehicle} />
          ))}
        </View>

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
        disabled={!selectedVehicle || !buyerRut || !ownerOption}
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
}); 