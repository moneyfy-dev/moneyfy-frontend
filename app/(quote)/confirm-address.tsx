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
    const [formData, setFormData] = useState({
        ownerName: '',
        ownerPaternalSur: '',
        ownerMaternalSur: '',
        street: '',
        streetNumber: '',
        department: ''
    });
    const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const themeColors = useThemeColor();

    const selectedPlan = plans.find(plan => plan.planId === planId);

    const handleSubmit = async () => {
        if (!formData.street || !formData.streetNumber || !selectedPlan) {
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
                ownerName: formData.ownerName,
                ownerPaternalSur: formData.ownerPaternalSur,
                ownerMaternalSur: formData.ownerMaternalSur,
                street: formData.street,
                streetNumber: formData.streetNumber,
                department: formData.department
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
                    Datos del propietario
                </ThemedText>
                <ThemedText variant="paragraph" textAlign="center" marginBottom={16}>
                    Los datos del propietario se utilizan para comunicaciones importantes como la carta de cancelación y para ajustar la cobertura y condiciones del seguro según la ubicación del vehículo.
                </ThemedText>

                <ThemedInput
                    label="Nombre"
                    placeholder="Nombre"
                    value={formData.ownerName}
                    onChangeText={(value) => setFormData({ ...formData, ownerName: value })}
                />
                <ThemedInput
                    label='Apellido Paterno'
                    placeholder="Apellido Paterno"
                    value={formData.ownerPaternalSur}
                    onChangeText={(value) => setFormData({ ...formData, ownerPaternalSur: value })}
                />
                <ThemedInput
                    label='Apellido Materno'
                    placeholder="Apellido Materno"
                    value={formData.ownerMaternalSur}
                    onChangeText={(value) => setFormData({ ...formData, ownerMaternalSur: value })}
                />

                <ThemedInput
                    label="Calle"
                    placeholder="Calle"
                    value={formData.street}
                    onChangeText={(value) => setFormData({ ...formData, street: value })}
                />
                <ThemedInput
                    label="Número"
                    placeholder="Número"
                    value={formData.streetNumber}
                    onChangeText={(value) => setFormData({ ...formData, streetNumber: value })}
                    keyboardType="numeric"
                />
                <ThemedInput
                    label="Departamento (opcional)"
                    placeholder="Departamento"
                    value={formData.department}
                    onChangeText={(value) => setFormData({ ...formData, department: value })}
                />
            </View>

            <ThemedButton
                text="Continuar"
                onPress={handleSubmit}
                disabled={!formData.street || !formData.streetNumber}
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