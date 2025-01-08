import React, { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ROUTES } from '@/core/types';
import { View, StyleSheet } from 'react-native';
import { useThemeColor } from '@/shared/hooks';
import { 
    ThemedLayout, 
    ThemedText, 
    ThemedInput, 
    ThemedButton, 
    LoadingScreen, 
    MessageModal 
} from '@/shared/components';
import { useQuote } from '@/core/context';

export default function ConfirmAddressScreen() {
    const { planId } = useLocalSearchParams();
    const router = useRouter();
    const { selectPlan, isLoading, vehicle, plans, quoterId } = useQuote();
    const [street, setStreet] = useState('');
    const [streetNumber, setStreetNumber] = useState('');
    const [department, setDepartment] = useState('');
    const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const themeColors = useThemeColor();

    console.log('🔍 Datos en confirm-address:', {
        planId,
        plansLength: plans?.length,
        hasVehicle: !!vehicle
    });

    const selectedPlan = plans.find(plan => plan.planId === planId);

    const handleSubmit = async () => {
        if (!street || !streetNumber || !selectedPlan) {
            setErrorMessage('Por favor complete los campos requeridos');
            setIsErrorModalVisible(true);
            return;
        }

        try {
            await selectPlan({
                quoterId: quoterId,
                planId: selectedPlan.planId,
                insurer: selectedPlan.insurer.name,
                planName: selectedPlan.planName,
                price: selectedPlan.price,
                priceUf: selectedPlan.priceUf,
                deductible: selectedPlan.deductible,
                street,
                streetNumber,
                department
            });

            router.push({
                pathname: ROUTES.QUOTE.PAYMENT_QR,
                params: { quoterId: quoterId, planId: planId }
            });
        } catch (error) {
            console.error('Error al confirmar dirección:', error);
            setErrorMessage('No se pudo confirmar la dirección');
            setIsErrorModalVisible(true);
        }
    };

    if (!selectedPlan || !vehicle) {
        console.log('❌ No hay plan seleccionado o vehículo:', { selectedPlan, vehicle });
        return null;
    }

    return (
        <ThemedLayout padding={[0, 40]}>
            <View style={styles.content}>
                <ThemedText variant="title" textAlign="center" marginBottom={5}>
                    {vehicle.ppu}
                </ThemedText>
                <ThemedText variant="paragraph" textAlign="center" marginBottom={20}>
                    {vehicle.year} {vehicle.brand} {vehicle.model}
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
                onPress={handleSubmit}
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