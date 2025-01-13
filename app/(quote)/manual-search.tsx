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
        patente: '',
        marca: '',
        modelo: '',
        año: '',
        version: '',
        rut: '',
        isDueño: 'Si, soy el dueño del vehículo'
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
        if (!validateRUT(formData.rut)) {
            setErrors({ ...errors, rut: 'RUT inválido' });
            setErrorMessage('Por favor, corrija los errores en el formulario.');
            setIsErrorModalVisible(true);
            return;
        }

        try {
            const response = await startQuotationFlow({
                ppu: formData.patente.toUpperCase(),
                brand: formData.marca,
                model: formData.modelo,
                year: formData.año,
                purchaserId: formData.rut,
                ownerOption: OWNER_OPTIONS_MAP[formData.isDueño as keyof typeof OWNER_OPTIONS_MAP],
                colour: '',
                engineNum: '',
                chassisNum: ''
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
                    value={formData.patente}
                    onChangeText={(value) => setFormData({ ...formData, patente: value.toUpperCase() })}
                    placeholder="Patente"
                    isPlate={true}
                />

                <ThemedAutocomplete
                    label="Marca"
                    value={formData.marca}
                    onChangeText={(value) => setFormData({ ...formData, marca: value })}
                    onSelect={handleBrandSelect}
                    options={availableVehicles.map(b => b.brand)}
                    placeholder="Selecciona una marca"
                    zIndex={2}
                />

                <ThemedAutocomplete
                    label="Modelo"
                    value={formData.modelo}
                    onChangeText={(value) => setFormData({ ...formData, modelo: value })}
                    onSelect={handleModelSelect}
                    options={selectedBrand?.models.map(m => m.model) || []}
                    placeholder="Selecciona un modelo"
                    disabled={!selectedBrand}
                    zIndex={1}
                />

                <ThemedInput
                    label="Año"
                    value={formData.año}
                    onChangeText={(value) => setFormData({ ...formData, año: value })}
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
                    value={formData.rut}
                    onChangeText={(value) => setFormData({ ...formData, rut: value })}
                    placeholder="RUT"
                    error={errors.rut}
                    isRUT={true}
                />

                <ThemedInput
                    style={{ marginBottom: 48 }}
                    label="¿Es el dueño del vehículo?"
                    value={formData.isDueño}
                    onChangeText={(value) => setFormData({ ...formData, isDueño: value })}
                    placeholder="Si, soy el dueño del vehículo"
                    isSelect={true}
                    options={Object.keys(OWNER_OPTIONS_MAP)}
                />
            </View>

            <ThemedButton
                text="Siguiente"
                onPress={handleSubmit}
                disabled={!formData.marca || !formData.modelo || !formData.patente || !formData.rut || !formData.isDueño}
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