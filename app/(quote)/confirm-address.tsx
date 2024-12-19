import React, { useState, useMemo } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ROUTES } from '@/core/types/routes';
import { View, StyleSheet } from 'react-native';
import { useThemeColor } from '@/shared/hooks';
import { ThemedLayout, ThemedText, ThemedInput, ThemedButton, LoadingScreen, MessageModal } from '@/shared/components';
import { useAuth } from '@/core/context';
import { selectPlan } from '@/core/services';

export default function ConfirmAddressScreen() {
  const { quoterId: quoterIdParam, plan: planParam, vehicle: vehicleParam } = useLocalSearchParams();
  const router = useRouter();
  const { updateUserData } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [street, setStreet] = useState('');
  const [streetNumber, setStreetNumber] = useState('');
  const [department, setDepartment] = useState('');
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const themeColors = useThemeColor();

  const parsedVehicle = useMemo(() => {
    try {
      return typeof vehicleParam === 'string' ? JSON.parse(decodeURIComponent(vehicleParam)) : vehicleParam;
    } catch (error) {
      console.error('Error parsing vehicle:', error);
      return null;
    }
  }, [vehicleParam]);

  const handleContinue = async () => {
    setIsLoading(true);
    if (!street || !streetNumber) {
      setErrorMessage('Por favor complete los campos requeridos');
      setIsErrorModalVisible(true);
      return;
    }
    try {
      const parsedPlan = JSON.parse(planParam as string);

      // Extraemos solo los datos necesarios para la solicitud
      const selectPlanData = {
        quoterId: quoterIdParam as string,
        planId: parsedPlan.planId,
        insuranceCompany: parsedPlan.insuranceCompany,
        planName: parsedPlan.planName,
        price: parsedPlan.price,
        priceUf: parsedPlan.priceUf,
        deductible: parsedPlan.deductible,
        street,
        streetNumber: Number(streetNumber),
        department
      };

      const response = await selectPlan(selectPlanData);

      if (response.data.user) {
        await updateUserData(response.data.user);
      }

      // Pasamos el plan completo a la siguiente pantalla
      router.push({
        pathname: ROUTES.QUOTE.PAYMENT_QR,
        params: {
          quoterId: response.data.quoterId,
          plan: planParam, // Mantenemos el plan completo original
          vehicle: vehicleParam
        }
      });

    } catch (error) {
      console.error('Error al seleccionar plan:', error);
      setErrorMessage('No se pudo procesar la selección del plan');
      setIsErrorModalVisible(true);
    } finally {
      setIsLoading(false);
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
  }
}); 