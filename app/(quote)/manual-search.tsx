import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { Brand, Model, OWNER_OPTIONS_MAP, ROUTES } from '@/core/types';
import { View, StyleSheet } from 'react-native';
import { useThemeColor } from '@/shared/hooks';
import {
    ThemedView,
    ThemedLayout,
    ThemedText,
    ThemedInput,
    ThemedAutocomplete,
    ThemedButton,
    MessageModal,
    LoadingScreen
} from "@/shared/components";
import { validateRUT } from '@/shared/utils/validations';
import { useQuote } from '@/core/context';

export default function ManualSearchScreen() {
    const themeColors = useThemeColor();
    const router = useRouter();
    const {
        startQuotationFlow,
        getAvailableVehicles,
        availableVehicles,
        isLoading
    } = useQuote();
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
    const [selectedModel, setSelectedModel] = useState<Model | null>(null);
    const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const [formData, setFormData] = useState({
        plate: '',
        brand: '',
        model: '',
        year: '',
        version: '',
        purchaserId: '',
        purchaserName: '',
        purchaserPaternalSur: '',
        purchaserMaternalSur: '',
        purchaserEmail: '',
        purchaserPhone: '',
        isOwner: 'Si, soy el dueño del vehículo'
    });

    const [errors, setErrors] = useState({
        rut: ''
    });

    const availableYears = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const years: string[] = [];
        for (let year = currentYear; year >= 1990; year--) {
            years.push(year.toString());
        }
        return years;
    }, []);

    useEffect(() => {
        loadVehicles();
    }, []);

    const loadVehicles = async () => {
        try {
            await getAvailableVehicles();
        } catch (error) {
            setErrorMessage('No se pudieron cargar los vehículos disponibles');
            setIsErrorModalVisible(true);
        }
    };

    const handleBrandSelect = (brandName: string) => {
        const brand = availableVehicles.find(b => b.brand === brandName);
        setSelectedBrand(brand || null);
        setSelectedModel(null); // Resetear modelo cuando cambia la marca
        setFormData(prev => ({
            ...prev,
            marca: brandName,
            modelo: '' // Resetear modelo cuando cambia la marca
        }));
    };

    const handleModelSelect = (modelName: string) => {
        if (selectedBrand) {
            const model = selectedBrand.models.find(m => m.model === modelName);
            setSelectedModel(model || null);
            setFormData(prev => ({
                ...prev,
                modelo: modelName
            }));
        }
    };

    const handleSubmit = async () => {
        if (!validateRUT(formData.purchaserId)) {
            setErrors({ ...errors, rut: 'RUT inválido' });
            setErrorMessage('Por favor, corrija los errores en el formulario.');
            setIsErrorModalVisible(true);
            return;
        }

        try {
            const response = await startQuotationFlow({
                quoterId: '',
                ppu: formData.plate.toUpperCase(),
                brand: formData.brand,
                model: formData.model,
                year: formData.year,
                requestType: 'Manual',
                purchaserId: formData.purchaserId,
                purchaserName: formData.purchaserName,
                purchaserPaternalSur: formData.purchaserPaternalSur,
                purchaserMaternalSur: formData.purchaserMaternalSur,
                purchaserEmail: formData.purchaserEmail,
                purchaserPhone: formData.purchaserPhone,
                ownerRelationOption: OWNER_OPTIONS_MAP[formData.isOwner as keyof typeof OWNER_OPTIONS_MAP]
            });

            router.push({
                pathname: ROUTES.QUOTE.QUOTE_RESULTS,
                params: {
                    plans: encodeURIComponent(JSON.stringify(response.data.plans)),
                    quoterId: response.data.quoterId,
                }
            });
        } catch (error) {
            console.error('Error al iniciar cotización:', error);
            setErrorMessage('No se pudo iniciar la cotización');
            setIsErrorModalVisible(true);
        }
    };

    return (
        <ThemedLayout padding={[0, 40]}>
            <View style={styles.content}>

                <ThemedInput
                    label="Patente"
                    value={formData.plate}
                    onChangeText={(value) => setFormData({ ...formData, plate: value.toUpperCase() })}
                    placeholder="Patente"
                    isPlate={true}
                />

                <ThemedAutocomplete
                    label="Marca"
                    value={formData.brand}
                    onChangeText={(value) => setFormData({ ...formData, brand: value })}
                    onSelect={handleBrandSelect}
                    options={availableVehicles.map(b => b.brand)}
                    placeholder="Selecciona una marca"
                    zIndex={2}
                />

                <ThemedAutocomplete
                    label="Modelo"
                    value={formData.model}
                    onChangeText={(value) => setFormData({ ...formData, model: value })}
                    onSelect={handleModelSelect}
                    options={selectedBrand?.models.map(m => m.model) || []}
                    placeholder="Selecciona un modelo"
                    disabled={!selectedBrand}
                    zIndex={1}
                />

                <ThemedInput
                    label="Año"
                    value={formData.year}
                    onChangeText={(value) => setFormData({ ...formData, year: value })}
                    placeholder="Selecciona el año"
                    isSelect={true}
                    options={availableYears}
                />

                <ThemedInput
                    label="Versión"
                    value={formData.version}
                    onChangeText={(value) => setFormData({ ...formData, version: value })}
                    placeholder="Versión"
                />

                <ThemedView style={[styles.divider, { backgroundColor: themeColors.borderBackgroundColor }]} />

                <ThemedText variant="subTitle" textAlign="center" style={{ marginTop: 4, marginBottom: 4 }}>
                    Datos del comprador
                </ThemedText>

                <ThemedInput
                    label="RUT del comprador"
                    value={formData.purchaserId}
                    onChangeText={(value) => setFormData({ ...formData, purchaserId: value })}
                    placeholder="RUT"
                    error={errors.rut}
                    isRUT={true}
                />

                <ThemedInput
                    label="Nombre"
                    placeholder="Nombre"
                    value={formData.purchaserName}
                    onChangeText={(value) => setFormData({ ...formData, purchaserName: value })}
                />
                <ThemedInput
                    label='Apellido Paterno'
                    placeholder="Apellido Paterno"
                    value={formData.purchaserPaternalSur}
                    onChangeText={(value) => setFormData({ ...formData, purchaserPaternalSur: value })}
                />
                <ThemedInput
                    label='Apellido Materno'
                    placeholder="Apellido Materno"
                    value={formData.purchaserMaternalSur}
                    onChangeText={(value) => setFormData({ ...formData, purchaserMaternalSur: value })}
                />
                <ThemedInput
                    label="Email"
                    placeholder="Email"
                    value={formData.purchaserEmail}
                    onChangeText={(value) => setFormData({ ...formData, purchaserEmail: value })}
                    keyboardType="email-address"
                />
                <ThemedInput
                    label="Teléfono"
                    placeholder="Teléfono"
                    value={formData.purchaserPhone}
                    onChangeText={(value) => setFormData({ ...formData, purchaserPhone: value })}
                    keyboardType="phone-pad"
                />

                <ThemedInput
                    style={{ marginBottom: 48 }}
                    label="¿Es el dueño del vehículo?"
                    value={formData.isOwner}
                    onChangeText={(value) => setFormData({ ...formData, isOwner: value })}
                    placeholder="Si, soy el dueño del vehículo"
                    isSelect={true}
                    options={Object.keys(OWNER_OPTIONS_MAP)}
                />
            </View>

            <ThemedButton
                text="Siguiente"
                onPress={handleSubmit}
                disabled={!formData.brand || !formData.model || !formData.plate || !formData.purchaserId || !formData.purchaserName || !formData.purchaserPaternalSur || !formData.purchaserMaternalSur || !formData.purchaserEmail || !formData.purchaserPhone || !formData.isOwner}
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

            {isLoading && <LoadingScreen />}
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
    divider: {
        height: 1,
        width: '100%',
        marginVertical: 20,
    },
});