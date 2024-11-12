import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedLayout } from "@/components/ThemedLayout";
import { ThemedText } from "@/components/ThemedText";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedAutocomplete } from "@/components/ThemedAutocomplete";
import { ThemedButton } from "@/components/ThemedButton";
import { ThemedView } from '@/components/ThemedView';
import { validateRUT } from '@/utils/validations';
import { Alert } from 'react-native';
import { getAvailableVehicles } from '@/services/vehicleService';
import { VehicleModel } from '@/types/vehicles';
import { useAuth } from '@/context/AuthContext';
import { searchCompanies, quoteVehicle } from '@/services/quoteService';
import { useRouter } from 'expo-router';

const OWNER_OPTIONS = [
    "Si, soy el dueño del vehículo",
    "No, soy el padre/madre del dueño",
    "No, soy el conviviente civil del dueño",
    "No, soy el cónyuge del dueño",
    "No, soy el hijo(a) del dueño"
];

const OWNER_OPTIONS_MAP = {
    "Si, soy el dueño del vehículo": "owner",
    "No, soy el padre/madre del dueño": "parent",
    "No, soy el conviviente civil del dueño": "civil_cohabitant",
    "No, soy el cónyuge del dueño": "spouse",
    "No, soy el hijo(a) del dueño": "child"
};

export default function ManualSearchScreen() {
    const themeColors = useThemeColor();
    const { updateUserData } = useAuth();
    const [availableVehicles, setAvailableVehicles] = useState<VehicleModel[]>([]);
    const [selectedVehicle, setSelectedVehicle] = useState<VehicleModel | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const [formData, setFormData] = useState({
        patente: '',
        marca: '',
        modelo: '',
        año: '',
        version: '',
        rut: '',
        isDueño: ''
    });

    const [errors, setErrors] = useState({
        rut: ''
    });

    // Generar array de años desde 1990 hasta el año actual
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
            const response = await getAvailableVehicles();
            setAvailableVehicles(response.data.vehicles);
            // Actualizar datos del usuario
            await updateUserData(response.data.user);
        } catch (error) {
            console.error('Error al cargar vehículos:', error);
            Alert.alert('Error', 'No se pudieron cargar los vehículos disponibles');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBrandSelect = (brandName: string) => {
        const vehicle = availableVehicles.find(v => v.name === brandName);
        setSelectedVehicle(vehicle || null);
        setFormData(prev => ({
            ...prev,
            marca: brandName,
            modelo: '' // Resetear modelo cuando cambia la marca
        }));
    };

    const handleSubmit = async () => {
        if (!validateRUT(formData.rut)) {
            setErrors({ ...errors, rut: 'RUT inválido' });
            Alert.alert('Error', 'Por favor, corrija los errores en el formulario.');
            return;
        }

        try {
            setIsLoading(true);

            // 1. Obtener compañías
            const companiesResponse = await searchCompanies();
            const companies = companiesResponse.data.companies || [];

            if (companies.length === 0) {
                throw new Error('No hay compañías disponibles para cotizar');
            }

            // 2. Preparar datos base para la cotización
            const baseQuoteData = {
                ppu: formData.patente,
                brand: formData.marca,
                model: formData.modelo,
                year: formData.año,
                purchaserId: formData.rut,
                ownerOption: OWNER_OPTIONS_MAP[formData.isDueño as keyof typeof OWNER_OPTIONS_MAP],
            };

            // 3. Crear las promesas de cotización para cada compañía
            const quotePromises = companies.map(company => 
                quoteVehicle({
                    ...baseQuoteData,
                    companyAlias: company.alias
                })
            );

            // 4. Ejecutar todas las cotizaciones en paralelo
            const results = await Promise.all(quotePromises);

            // 5. Combinar todos los planes de las diferentes compañías
            const allPlans = results
                .filter(response => response.status === 200)
                .map(response => response.data.plans)
                .flat();

            if (allPlans.length === 0) {
                throw new Error('No se encontraron planes disponibles');
            }

            // 6. Navegar a la pantalla de resultados
            router.push({
                pathname: '/(quote)/quote-results',
                params: {
                    selectedVehicle: encodeURIComponent(JSON.stringify({
                        ppu: formData.patente,
                        brand: formData.marca,
                        model: formData.modelo,
                        year: formData.año
                    })),
                    plans: encodeURIComponent(JSON.stringify(allPlans))
                }
            });

        } catch (error) {
            console.error('Error al cotizar:', error);
            Alert.alert('Error', 'No se pudo realizar la cotización');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ThemedLayout padding={[0, 24]}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <ThemedText variant="superTitle" marginBottom={16} textAlign="center">
                        Ingreso de vehículo manual
                    </ThemedText>
                    <ThemedText variant="paragraph" textAlign="center" color={themeColors.textParagraph}>
                        Completa la información de tu vehículo manualmente para encontrar el seguro que mejor se adapte a tus necesidades.
                    </ThemedText>
                </View>

                <ThemedInput
                    label="Patente"
                    value={formData.patente}
                    onChangeText={(value) => setFormData({ ...formData, patente: value })}
                    placeholder="Patente"
                />

                <ThemedAutocomplete
                    label="Marca"
                    value={formData.marca}
                    onChangeText={(value) => setFormData({ ...formData, marca: value })}
                    onSelect={handleBrandSelect}
                    options={availableVehicles.map(v => v.name)}
                    placeholder="Selecciona una marca"
                    zIndex={2}
                />

                <ThemedAutocomplete
                    label="Modelo"
                    value={formData.modelo}
                    onChangeText={(value) => setFormData({ ...formData, modelo: value })}
                    onSelect={(value) => setFormData({ ...formData, modelo: value })}
                    options={selectedVehicle?.models || []}
                    placeholder="Selecciona un modelo"
                    disabled={!selectedVehicle}
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
                    options={OWNER_OPTIONS}
                />
            </View>

            <ThemedButton
                text="Siguiente"
                onPress={handleSubmit}
                disabled={isLoading || !formData.marca || !formData.modelo || !formData.patente || !formData.rut || !formData.isDueño}
            />
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