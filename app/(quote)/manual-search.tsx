import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { Brand, Model, OWNER_OPTIONS_MAP, ROUTES } from '@/core/types';
import { View, StyleSheet } from 'react-native';
import { useMessageConfig, useThemeColor } from '@/shared/hooks';
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
import { validateEmail, validateName, validatePhoneNumber, validatePPU, validateRUT } from '@/shared/utils/validations';
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

    const [formData, setFormData] = useState({
        ppu: '',
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
        ppu: '',
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
        isOwner: ''
    });

    useMessageConfig(['/quoter/vehicle/quote']);

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            ppu: '',
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
            isOwner: ''
        };
        
        if (formData.ppu && !validatePPU(formData.ppu)) {
            newErrors.ppu = 'Formato de patente inválido.';
            isValid = false;
        }

        if (formData.purchaserId && !validateRUT(formData.purchaserId)) {
            newErrors.purchaserId = 'RUT inválido';
            isValid = false;
        }

        if (formData.purchaserName && !validateName(formData.purchaserName)) {
            newErrors.purchaserName = 'Nombre inválido';
            isValid = false;
        }

        if (formData.purchaserPaternalSur && !validateName(formData.purchaserPaternalSur)) {
            newErrors.purchaserPaternalSur = 'Apellido paterno inválido';
            isValid = false;
        }

        if (formData.purchaserMaternalSur && !validateName(formData.purchaserMaternalSur)) {
            newErrors.purchaserMaternalSur = 'Apellido materno inválido';
            isValid = false;
        }

        if (formData.purchaserEmail && !validateEmail(formData.purchaserEmail)) {
            newErrors.purchaserEmail = 'Email inválido';
            isValid = false;
        }

        if (formData.purchaserPhone && !validatePhoneNumber(formData.purchaserPhone)) {
            newErrors.purchaserPhone = 'Teléfono inválido';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
      };

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
        if (!validateForm()) {
            return;
          }
      
          if (!formData.purchaserId.trim() && !formData.ppu.trim() && !formData.brand.trim() && !formData.model.trim() && !formData.year.trim() && !formData.version.trim()) {
            setErrors({
              purchaserId: 'Ingrese el RUT del propietario',
              ppu: 'Ingrese la patente del vehículo',
              brand: 'Ingrese la marca del vehículo',
              model: 'Ingrese el modelo del vehículo',
              year: 'Ingrese el año del vehículo',
              version: 'Ingrese la versión del vehículo',
              purchaserName: 'Ingrese el nombre del comprador',
              purchaserPaternalSur: 'Ingrese el apellido paterno del comprador',
              purchaserMaternalSur: 'Ingrese el apellido materno del comprador',
              purchaserEmail: 'Ingrese el email del comprador',
              purchaserPhone: 'Ingrese el teléfono del comprador',
              isOwner: 'Ingrese si es el dueño del vehículo'
            });
            return;
          }

        try {
            const response = await startQuotationFlow({
                quoterId: '',
                ppu: formData.ppu.toUpperCase(),
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
        }
    };

    return (
        <>
            {isLoading ? <LoadingScreen /> : (

                <ThemedLayout padding={[0, 40]}>
                    <View style={styles.content}>

                        <ThemedInput
                            label="Patente"
                            value={formData.ppu}
                            onChangeText={(value) => setFormData({ ...formData, ppu: value.toUpperCase() })}
                            error={errors.ppu}
                            placeholder="Patente"
                            isPlate={true}
                        />

                        <ThemedAutocomplete
                            label="Marca"
                            value={formData.brand}
                            onChangeText={(value) => setFormData({ ...formData, brand: value })}
                            error={errors.brand}
                            onSelect={handleBrandSelect}
                            options={availableVehicles.map(b => b.brand)}
                            placeholder="Selecciona una marca"
                            zIndex={2}
                        />

                        <ThemedAutocomplete
                            label="Modelo"
                            value={formData.model}
                            onChangeText={(value) => setFormData({ ...formData, model: value })}
                            error={errors.model}
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
                            error={errors.year}
                            placeholder="Selecciona el año"
                            isSelect={true}
                            options={availableYears}
                        />

                        <ThemedInput
                            label="Versión"
                            value={formData.version}
                            onChangeText={(value) => setFormData({ ...formData, version: value })}
                            error={errors.version}
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
                            error={errors.purchaserId}
                            placeholder="RUT"
                            isRUT={true}
                        />

                        <ThemedInput
                            label="Nombre"
                            placeholder="Nombre"
                            value={formData.purchaserName}
                            onChangeText={(value) => setFormData({ ...formData, purchaserName: value })}
                            error={errors.purchaserName}
                        />
                        <ThemedInput
                            label='Apellido Paterno'
                            placeholder="Apellido Paterno"
                            value={formData.purchaserPaternalSur}
                            onChangeText={(value) => setFormData({ ...formData, purchaserPaternalSur: value })}
                            error={errors.purchaserPaternalSur}
                        />
                        <ThemedInput
                            label='Apellido Materno'
                            placeholder="Apellido Materno"
                            value={formData.purchaserMaternalSur}
                            onChangeText={(value) => setFormData({ ...formData, purchaserMaternalSur: value })}
                            error={errors.purchaserMaternalSur}
                        />
                        <ThemedInput
                            label="Email"
                            placeholder="Email"
                            value={formData.purchaserEmail}
                            onChangeText={(value) => setFormData({ ...formData, purchaserEmail: value })}
                            error={errors.purchaserEmail}
                            keyboardType="email-address"
                        />
                        <ThemedInput
                            label="Teléfono"
                            placeholder="Teléfono"
                            value={formData.purchaserPhone}
                            onChangeText={(value) => setFormData({ ...formData, purchaserPhone: value })}
                            error={errors.purchaserPhone}
                            keyboardType="phone-pad"
                        />

                        <ThemedInput
                            style={{ marginBottom: 48 }}
                            label="¿Es el dueño del vehículo?"
                            value={formData.isOwner}
                            onChangeText={(value) => setFormData({ ...formData, isOwner: value })}
                            error={errors.isOwner}
                            placeholder="Si, soy el dueño del vehículo"
                            isSelect={true}
                            options={Object.keys(OWNER_OPTIONS_MAP)}
                        />
                    </View>

                    <ThemedButton
                        text="Siguiente"
                        onPress={handleSubmit}
                        disabled={!formData.brand || !formData.model || !formData.year || !formData.version || !formData.purchaserId || !formData.purchaserName || !formData.purchaserPaternalSur || !formData.purchaserMaternalSur || !formData.purchaserEmail || !formData.purchaserPhone || !formData.isOwner}
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
    header: {
        marginBottom: 24,
    },
    divider: {
        height: 1,
        width: '100%',
        marginVertical: 20,
    },
    button: {
        marginTop: 24,
    },
});