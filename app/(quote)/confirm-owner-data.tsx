import React, { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ROUTES } from '@/core/types';
import { View, StyleSheet } from 'react-native';
import {
    ThemedLayout,
    ThemedText,
    ThemedInput,
    ThemedButton,
    LoadingScreen,
} from '@/shared/components';
import { useQuote } from '@/core/context';
import { validateAddress, validateName } from '@/shared/utils/validations';
import { useMessageConfig } from '@/shared/hooks';

export default function ConfirmOwnerDataScreen() {
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

    const [errors, setErrors] = useState({
        ownerName: '',
        ownerPaternalSur: '',
        ownerMaternalSur: '',
        street: '',
        streetNumber: '',
    });

    useMessageConfig(['/quoter/select/plan']);

    const selectedPlan = plans.find(plan => plan.planId === planId);

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            ownerName: '',
            ownerPaternalSur: '',
            ownerMaternalSur: '',
            street: '',
            streetNumber: ''
        };

        if (formData.ownerName && !validateName(formData.ownerName)) {
            newErrors.ownerName = 'Nombre inválido';
            isValid = false;
        }

        if (formData.ownerPaternalSur && !validateName(formData.ownerPaternalSur)) {
            newErrors.ownerPaternalSur = 'Apellido paterno inválido';
            isValid = false;
        }

        if (formData.ownerMaternalSur && !validateName(formData.ownerMaternalSur)) {
            newErrors.ownerMaternalSur = 'Apellido materno inválido';
            isValid = false;
        }

        if (formData.street && !validateAddress(formData.street)) {
            newErrors.street = 'Calle inválida';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async () => {

        if (!validateForm()) {
            return;
        }

        if (!formData.ownerName.trim() && !formData.ownerPaternalSur.trim() && !formData.ownerMaternalSur.trim() && !formData.street.trim() && !formData.streetNumber.trim() && !formData.department.trim()) {
            setErrors({
                ownerName: 'Ingrese el nombre del propietario',
                ownerPaternalSur: 'Ingrese el apellido paterno del propietario',
                ownerMaternalSur: 'Ingrese el apellido materno del propietario',
                street: 'Ingrese la calle del propietario',
                streetNumber: 'Ingrese el número de la calle del propietario'
            });
            return;
        }
        if (!formData.ownerName ||
            !formData.ownerPaternalSur ||
            !formData.ownerMaternalSur ||
            !formData.street ||
            !formData.streetNumber ||
            !selectedPlan) {
            return;
        }

        try {
            await selectPlan({
                quoterId: quoterId,
                planId: selectedPlan.planId,
                insurer: selectedPlan.insurer.name,
                planName: selectedPlan.planName,
                valueUF: selectedPlan.valueUF,
                grossPriceUF: selectedPlan.grossPriceUF,
                totalPrice: selectedPlan.totalPrice,
                totalMonths: selectedPlan.totalMonths,
                montlyPrice: selectedPlan.montlyPrice,
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
        }
    };

    if (!selectedPlan || !vehicle) {
        return null;
    }

    return (
        <>
            {isLoading ?
                <LoadingScreen /> : (

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
                                error={errors.ownerName}
                            />
                            <ThemedInput
                                label='Apellido Paterno'
                                placeholder="Apellido Paterno"
                                value={formData.ownerPaternalSur}
                                onChangeText={(value) => setFormData({ ...formData, ownerPaternalSur: value })}
                                error={errors.ownerPaternalSur}
                            />
                            <ThemedInput
                                label='Apellido Materno'
                                placeholder="Apellido Materno"
                                value={formData.ownerMaternalSur}
                                onChangeText={(value) => setFormData({ ...formData, ownerMaternalSur: value })}
                                error={errors.ownerMaternalSur}
                            />

                            <ThemedInput
                                label="Calle"
                                placeholder="Calle"
                                value={formData.street}
                                onChangeText={(value) => setFormData({ ...formData, street: value })}
                                error={errors.street}
                            />
                            <ThemedInput
                                label="Número"
                                placeholder="Número"
                                value={formData.streetNumber}
                                onChangeText={(value) => setFormData({ ...formData, streetNumber: value })}
                                keyboardType="numeric"
                                error={errors.streetNumber}
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
                            disabled={!formData.ownerName || !formData.ownerPaternalSur || !formData.ownerMaternalSur || !formData.street || !formData.streetNumber}
                            style={styles.button}
                        />

                    </ThemedLayout>
                )
            }
        </>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    button: {
        marginTop: 24,
    },
}); 