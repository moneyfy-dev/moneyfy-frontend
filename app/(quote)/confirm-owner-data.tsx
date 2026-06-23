import React, { useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ROUTES } from '@/core/types';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    ThemedLayout,
    ThemedText,
    ThemedInput,
    ThemedButton,
    LoadingScreen,
    ThemedAutocomplete,
} from '@/shared/components';
import { useQuote } from '@/core/context';
import { catalogService } from '@/core/services/catalog';
import type { Region } from '@/core/types';
import { validateAddress } from '@/shared/utils/validations';
import { useMessageConfig } from '@/shared/hooks';

const FIELD_LABELS: Record<string, string> = {
    quoterId: 'cotizacion',
    planId: 'plan',
    insurer: 'aseguradora',
    planName: 'nombre del plan',
    valueUF: 'valor UF',
    grossPriceUF: 'prima anual',
    totalMonths: 'cuotas',
    monthlyPriceUF: 'cuota UF',
    monthlyPrice: 'cuota mensual',
    deductibleDesc: 'deducible',
    discount: 'descuento',
    ownerName: 'nombre',
    ownerPaternalSur: 'apellido paterno',
    ownerMaternalSur: 'apellido materno',
    street: 'calle',
    streetNumber: 'numero',
    department: 'departamento',
    region: 'region',
    city: 'region',
    commune: 'comuna',
};

const getBackendValidationErrors = (error: unknown): Record<string, string> => {
    const data = (error as any)?.response?.data?.data;
    return data && typeof data === 'object' && !Array.isArray(data) ? data : {};
};

const OWNER_DATA_FIELDS = new Set([
    'ownerName',
    'ownerPaternalSur',
    'ownerMaternalSur',
    'street',
    'streetNumber',
    'department',
    'city',
    'commune',
]);

const formatBackendError = (field: string, message: string) =>
    `${FIELD_LABELS[field] || field}: ${message}`;

const validateBackendName = (value: string) => {
    const trimmedValue = value.trim();
    return /^[a-zA-ZáéíóúñçýÁÉÍÓÚÑÇÝ]{2,40}$/.test(trimmedValue);
};

const getPlanId = (plan: any) =>
    plan?.planId || plan?.quoterPlanId || plan?.idPlan || plan?.id || '';

export default function ConfirmOwnerDataScreen() {
    const { planId, planIndex } = useLocalSearchParams();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const {
        selectPlan,
        isLoading,
        vehicle,
        plans,
        quoterId,
        ownerDataDraft: formData,
        updateOwnerDataDraft,
    } = useQuote();

    const [errors, setErrors] = useState({
        ownerName: '',
        ownerPaternalSur: '',
        ownerMaternalSur: '',
        street: '',
        streetNumber: '',
        department: '',
        city: '',
        commune: '',
    });
    const [formError, setFormError] = useState('');
    const [regions, setRegions] = useState<Region[]>([]);
    const [catalogError, setCatalogError] = useState('');

    useEffect(() => {
        let active = true;

        catalogService.getRegions()
            .then((items) => {
                if (active) setRegions(items);
            })
            .catch(() => {
                if (active) {
                    setCatalogError('No fue posible cargar las regiones. Intenta nuevamente.');
                }
            });

        return () => {
            active = false;
        };
    }, []);

    const regionOptions = useMemo(() => regions.map((item) => item.region), [regions]);
    const communeOptions = useMemo(
        () => regions.find((item) => item.region === formData.city)?.locations || [],
        [regions, formData.city],
    );

    useMessageConfig(['/quoter/select/plan']);

    const planIdValue = Array.isArray(planId) ? planId[0] : planId;
    const planIndexValue = Array.isArray(planIndex) ? planIndex[0] : planIndex;
    const parsedPlanIndex = Number(planIndexValue);
    const selectedPlan = Number.isInteger(parsedPlanIndex) && plans[parsedPlanIndex]
        ? plans[parsedPlanIndex]
        : plans.find(plan => getPlanId(plan) === planIdValue);
    const selectedPlanId = getPlanId(selectedPlan);
    const selectedInsurerName = typeof selectedPlan?.insurer === 'string'
        ? selectedPlan.insurer
        : selectedPlan?.insurer?.name ?? '';
    const selectedDeductibleDesc = selectedPlan?.deductibleDesc?.trim()
        || `Deducible ${selectedPlan?.deductible ?? 0} UF`;

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            ownerName: '',
            ownerPaternalSur: '',
            ownerMaternalSur: '',
            street: '',
            streetNumber: '',
            department: '',
            city: '',
            commune: '',
        };

        if (formData.ownerName && !validateBackendName(formData.ownerName)) {
            newErrors.ownerName = 'Nombre inválido';
            isValid = false;
        }

        if (formData.ownerPaternalSur && !validateBackendName(formData.ownerPaternalSur)) {
            newErrors.ownerPaternalSur = 'Apellido paterno inválido';
            isValid = false;
        }

        if (formData.ownerMaternalSur && !validateBackendName(formData.ownerMaternalSur)) {
            newErrors.ownerMaternalSur = 'Apellido materno inválido';
            isValid = false;
        }

        if (formData.street && !validateAddress(formData.street)) {
            newErrors.street = 'Calle inválida';
            isValid = false;
        }

        setErrors(newErrors);
        setFormError('');
        return isValid;
    };

    const handleSubmit = async () => {

        if (!validateForm()) {
            return;
        }

        if (!formData.ownerName.trim() && !formData.ownerPaternalSur.trim() && !formData.ownerMaternalSur.trim() && !formData.street.trim() && !formData.streetNumber.trim() && !formData.department.trim() && !formData.city.trim() && !formData.commune.trim()) {
            setErrors({
                ownerName: 'Ingrese el nombre del propietario',
                ownerPaternalSur: 'Ingrese el apellido paterno del propietario',
                ownerMaternalSur: 'Ingrese el apellido materno del propietario',
                street: 'Ingrese la calle del propietario',
                department: '',
                streetNumber: 'Ingrese el número de la calle del propietario',
                city: '',
                commune: '',
            });
            return;
        }
        if (!formData.ownerName.trim() ||
            !formData.ownerPaternalSur.trim() ||
            !formData.ownerMaternalSur.trim() ||
            !formData.street.trim() ||
            !formData.streetNumber.trim() ||
            !selectedPlan) {
            return;
        }

        if (!selectedPlanId || selectedPlanId.length < 4) {
            setFormError('El plan seleccionado no trae un identificador valido. Vuelve a seleccionar el plan desde los resultados.');
            return;
        }

        try {
            await selectPlan({
                quoterId: quoterId,
                planId: selectedPlanId,
                insurer: selectedInsurerName,
                planName: selectedPlan.planName,
                valueUF: selectedPlan.valueUF,
                grossPriceUF: selectedPlan.grossPriceUF,
                totalMonths: selectedPlan.totalMonths,
                monthlyPriceUF: selectedPlan.monthlyPriceUF,
                monthlyPrice: selectedPlan.monthlyPrice,
                deductible: selectedPlan.deductible,
                deductibleDesc: selectedDeductibleDesc,
                discount: selectedPlan.discount,
                ownerName: formData.ownerName.trim(),
                ownerPaternalSur: formData.ownerPaternalSur.trim(),
                ownerMaternalSur: formData.ownerMaternalSur.trim(),
                street: formData.street.trim(),
                streetNumber: formData.streetNumber.trim(),
                department: formData.department.trim(),
                region: formData.city.trim(),
                commune: formData.commune.trim(),
            });

            router.push({
                pathname: ROUTES.QUOTE.PAYMENT_QR,
                params: {
                    quoterId: quoterId,
                    planId: selectedPlanId,
                    planIndex: Number.isInteger(parsedPlanIndex) ? String(parsedPlanIndex) : undefined,
                }
            });
        } catch (error) {
            const backendErrors = getBackendValidationErrors(error);
            const responseStatus = (error as any)?.response?.status;
            const responseMessage = (error as any)?.response?.data?.message;
            const visibleErrors = {
                ownerName: backendErrors.ownerName || '',
                ownerPaternalSur: backendErrors.ownerPaternalSur || '',
                ownerMaternalSur: backendErrors.ownerMaternalSur || '',
                street: backendErrors.street || '',
                streetNumber: backendErrors.streetNumber || '',
                department: backendErrors.department || '',
                city: backendErrors.region || backendErrors.city || '',
                commune: backendErrors.commune || '',
            };
            const hiddenErrors = Object.entries(backendErrors)
                .filter(([field]) => !OWNER_DATA_FIELDS.has(field) && field !== 'info')
                .map(([field, message]) => formatBackendError(field, String(message)));

            setErrors(visibleErrors);
            setFormError(
                hiddenErrors.length > 0
                    ? `Revisa los datos del plan seleccionado: ${hiddenErrors.join(', ')}`
                    : responseStatus === 424
                        ? 'Esta cotizacion ya no esta disponible para continuar. Vuelve a cotizar para generar una nueva sesion.'
                        : responseMessage
                            ? String(responseMessage)
                            : 'Revisa los campos marcados antes de continuar.'
            );
        }
    };

    if (!selectedPlan || !vehicle) {
        return null;
    }

    return (
        <>
            {isLoading ?
                <LoadingScreen /> : (

                    <ThemedLayout
                        padding={[0, Math.max(120, insets.bottom + 96)]}
                        safeAreaEdges={['left', 'right', 'bottom']}
                    >
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

                            {!!formError && (
                                <ThemedText variant="paragraph" color="red" textAlign="center" marginBottom={12}>
                                    {formError}
                                </ThemedText>
                            )}

                            <ThemedInput
                                label="Nombre"
                                placeholder="Nombre"
                                value={formData.ownerName}
                                onChangeText={(value) => updateOwnerDataDraft({ ownerName: value })}
                                error={errors.ownerName}
                            />
                            <ThemedInput
                                label='Apellido Paterno'
                                placeholder="Apellido Paterno"
                                value={formData.ownerPaternalSur}
                                onChangeText={(value) => updateOwnerDataDraft({ ownerPaternalSur: value })}
                                error={errors.ownerPaternalSur}
                            />
                            <ThemedInput
                                label='Apellido Materno'
                                placeholder="Apellido Materno"
                                value={formData.ownerMaternalSur}
                                onChangeText={(value) => updateOwnerDataDraft({ ownerMaternalSur: value })}
                                error={errors.ownerMaternalSur}
                            />

                            <ThemedInput
                                label="Calle"
                                placeholder="Calle"
                                value={formData.street}
                                onChangeText={(value) => updateOwnerDataDraft({ street: value })}
                                error={errors.street}
                            />
                            <ThemedAutocomplete
                                label="Region (opcional)"
                                placeholder="Selecciona una region"
                                value={formData.city}
                                options={regionOptions}
                                onChangeText={(value) => {
                                    updateOwnerDataDraft({
                                        city: value,
                                        commune: value === formData.city ? formData.commune : '',
                                    });
                                }}
                                onSelect={(value) => {
                                    updateOwnerDataDraft({
                                        city: value,
                                        commune: value === formData.city ? formData.commune : '',
                                    });
                                }}
                                error={errors.city}
                                zIndex={3}
                            />
                            <ThemedAutocomplete
                                label="Comuna (opcional)"
                                placeholder={formData.city ? 'Selecciona una comuna' : 'Selecciona primero una region'}
                                value={formData.commune}
                                options={communeOptions}
                                onChangeText={(value) => updateOwnerDataDraft({ commune: value })}
                                onSelect={(value) => updateOwnerDataDraft({ commune: value })}
                                error={errors.commune}
                                disabled={!formData.city || (!catalogError && communeOptions.length === 0)}
                                zIndex={2}
                            />
                            {!!catalogError && (
                                <ThemedText variant="notes" color="red" marginBottom={12}>
                                    {catalogError}
                                </ThemedText>
                            )}
                            <ThemedInput
                                label="Número"
                                placeholder="Número"
                                value={formData.streetNumber}
                                onChangeText={(value) => updateOwnerDataDraft({ streetNumber: value })}
                                keyboardType="numeric"
                                error={errors.streetNumber}
                            />
                            <ThemedInput
                                label="Departamento (opcional)"
                                placeholder="Departamento"
                                value={formData.department}
                                onChangeText={(value) => updateOwnerDataDraft({ department: value })}
                                error={errors.department}
                            />
                        </View>

                        <ThemedButton
                            text="Continuar"
                            onPress={handleSubmit}
                            disabled={!formData.ownerName.trim() || !formData.ownerPaternalSur.trim() || !formData.ownerMaternalSur.trim() || !formData.street.trim() || !formData.streetNumber.trim()}
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
        flexGrow: 0,
    },
    button: {
        marginTop: 24,
    },
}); 
