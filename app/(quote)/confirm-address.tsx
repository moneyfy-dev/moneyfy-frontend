import React, { useState, useMemo } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { ThemedLayout } from '@/components/ThemedLayout';
import { ThemedText } from '@/components/ThemedText';
import { ThemedInput } from '@/components/ThemedInput';
import { ThemedButton } from '@/components/ThemedButton';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { selectPlan } from '@/services/quoteService';

export default function ConfirmAddressScreen() {
  const {
    referredId, planId, insuranceCompany, planName,
    price, priceUf, deductible, vehicle
  } = useLocalSearchParams();
  const router = useRouter();
  const { updateUserData } = useAuth();

  const [street, setStreet] = useState('');
  const [streetNumber, setStreetNumber] = useState('');
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(false);

  const parsedVehicle = useMemo(() => {
    try {
      return typeof vehicle === 'string' ? JSON.parse(decodeURIComponent(vehicle)) : vehicle;
    } catch (error) {
      console.error('Error parsing vehicle:', error);
      return null;
    }
  }, [vehicle]);

  const handleContinue = async () => {
    if (!street || !streetNumber) {
      Alert.alert('Error', 'Por favor complete los campos requeridos');
      return;
    }

    try {
      setLoading(true);
      const planData = {
        referredId: referredId as string,
        planId: planId as string,
        insuranceCompany: insuranceCompany as string,
        planName: planName as string,
        price: Number(price),
        priceUf: Number(priceUf),
        deductible: Number(deductible),
        street,
        streetNumber: Number(streetNumber),
        department
      };

      const response = await selectPlan(planData);

      if (response.data.user) {
        await updateUserData(response.data.user);
      }

      // Navegar a la siguiente pantalla
      router.push('/(quote)/payment-qr');

    } catch (error) {
      console.error('Error al seleccionar plan:', error);
      Alert.alert('Error', 'No se pudo procesar la selección del plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedLayout padding={[0, 40]}>
      <View style={styles.content}>
        <ThemedText variant="title" textAlign="center" marginBottom={5}>
          {parsedVehicle?.ppu}
        </ThemedText>
        <ThemedText variant="paragraph" textAlign="center" marginBottom={20}>
          {parsedVehicle?.year} {parsedVehicle?.brand} {parsedVehicle?.model}
        </ThemedText>
        <ThemedText variant="subTitle" textAlign="center" marginBottom={16}>
          Dirección del propietario
        </ThemedText>
        <ThemedText variant="paragraph" textAlign="center" marginBottom={16}>
          La dirección se utiliza para comunicaciones importantes como la carta de cancelación y para ajustar la cobertura y condiciones del seguro según la ubicación del vehículo.
        </ThemedText>

        <ThemedInput
          label="Calle"
          placeholder="Calle"
          value={street}
          onChangeText={setStreet}
        />
        <ThemedInput
          label="Número"
          placeholder="Número"
          value={streetNumber}
          onChangeText={setStreetNumber}
          keyboardType="numeric"
        />
        <ThemedInput
          label="Departamento (opcional)"
          placeholder="Departamento"
          value={department}
          onChangeText={setDepartment}
        />

      </View>
        <ThemedButton
          text="Continuar"
          onPress={handleContinue}
          disabled={!street || !streetNumber}
        />
    </ThemedLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  }
}); 