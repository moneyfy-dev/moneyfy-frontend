import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from '@/components/ThemedText';
import { ThemedLayout } from '@/components/ThemedLayout';
import { ThemedInput } from '@/components/ThemedInput';
import { ThemedButton } from '@/components/ThemedButton';
import Colors from '@/constants/Colors';

interface Vehicle {
  brand: string;
  model: string;
  year: string;
  plate: string;
  type: string;
  details: string;
}

export default function SearchResultsScreen() {
  const { type, value } = useLocalSearchParams();
  const themeColors = useThemeColor();
  const [buyerRut, setBuyerRut] = useState('');
  const [isOwner, setIsOwner] = useState('Si, soy el dueño del vehículo');

  // Simulación de datos
  const vehicles: Vehicle[] = type === 'rut' ? [
    {
      brand: 'Toyota',
      model: 'CTJZ47 - 2011',
      plate: 'CTJZ47',
      year: '2011',
      type: 'Automóvil',
      details: 'NEW YARIS SEDAN XLI'
    },
    {
      brand: 'Yamaha',
      model: 'RZKT93 - 2022',
      plate: 'RZKT93',
      year: '2022',
      type: 'Motocicleta',
      details: 'YAMAHA R1 1000CC'
    },
    {
      brand: 'Toyota',
      model: 'DFTE23 - 2018',
      plate: 'DFTE23',
      year: '2018',
      type: 'Suv',
      details: 'RAV4 2.0 4X2 CVT'
    }
  ] : [
    {
      brand: 'Toyota',
      model: 'CTJZ47 - 2011',
      plate: value as string,
      year: '2011',
      type: 'Automóvil',
      details: 'NEW YARIS SEDAN XLI'
    }
  ];

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

  return (
    <ThemedLayout padding={[24, 24]}>
      <View style={styles.header}>
        <ThemedText variant="title">
          Resultados para el {type === 'plate' ? 'patente' : 'RUT'}
        </ThemedText>
        <ThemedText variant="superTitle" color={Colors.common.green2} marginBottom={8}>
          {value}
        </ThemedText>
        <ThemedText variant="paragraph" color={themeColors.textParagraph} marginBottom={16}>
          Por favor seleccione el vehículo e ingrese los datos del comprador
          {type === 'rut' && ', si no ves tu vehículo puedes buscarlo por patente.'}
        </ThemedText>
      </View>

      {vehicles.map((vehicle, index) => (
        <TouchableOpacity 
          key={index}
          style={[styles.vehicleCard, { backgroundColor: themeColors.backgroundCardColor }]}
        >
          <View style={[styles.iconContainer, { backgroundColor: Colors.common.green2 }]}>
            <Ionicons name={getVehicleIcon(vehicle.type)} size={24} color={themeColors.white} />
          </View>
          <View style={styles.vehicleInfo}>
            <ThemedText variant="paragraph">{vehicle.brand}</ThemedText>
            <ThemedText variant="subTitle">{vehicle.model}</ThemedText>
            <ThemedText variant="paragraph" color={Colors.common.green2}>{vehicle.details}</ThemedText>
          </View>
          <Ionicons name="chevron-forward" size={24} color={themeColors.textColorAccent} />
        </TouchableOpacity>
      ))}

      <View style={styles.buyerSection}>
        <ThemedText variant="title" marginBottom={16}>
          Datos del comprador
        </ThemedText>
        <ThemedText variant="paragraph" color={themeColors.textParagraph} marginBottom={24}>
          Por favor complete la información del comprador
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
          value={isOwner}
          onChangeText={setIsOwner}
          isSelect
          options={['Si, soy el dueño del vehículo', 'No, no soy el dueño del vehículo']}
        />
      </View>

      <ThemedButton
        text="Siguiente"
        onPress={() => {}}
        style={styles.nextButton}
        backgroundColor={Colors.common.green2}
      />
    </ThemedLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 24,
  },
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
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
  buyerSection: {
    marginTop: 24,
  },
  nextButton: {
    marginTop: 24,
  },
}); 