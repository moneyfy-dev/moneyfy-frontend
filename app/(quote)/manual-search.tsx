import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemeColor } from '@/shared/hooks/useThemeColor';
import { ThemedLayout } from "@/shared/components/layouts/ThemedLayout";
import { ThemedText } from "@/shared/components/ui/ThemedText";
import { ThemedInput } from "@/shared/components/ui/ThemedInput";
import { ThemedAutocomplete } from "@/shared/components/ui/ThemedAutocomplete";
import { ThemedButton } from "@/shared/components/ui/ThemedButton";
import { ThemedView } from '@/shared/components/ui/ThemedView';
import { validateRUT } from '@/shared/utils/validations';
import { Alert } from 'react-native';
import { getAvailableVehicles } from '@/core/services/vehicleService';
import { VehicleModel } from '@/core/types/vehicles';
import { useAuth } from '@/core/context/AuthContext';
import { useRouter } from 'expo-router';
import { OWNER_OPTIONS_MAP } from '@/core/types/quote';
import { startQuotationFlow } from '@/core/services/quotationFlowService';
import { MessageModal } from '@/shared/components/modals/MessageModal';
import { ROUTES } from '@/core/types/routes';


export default function ManualSearchScreen() {
    const themeColors = useThemeColor();
    const { updateUserData } = useAuth();
    const [availableVehicles, setAvailableVehicles] = useState<VehicleModel[]>([]);
    const [selectedVehicle, setSelectedVehicle] = useState<VehicleModel | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
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
            setErrorMessage('No se pudieron cargar los vehículos disponibles');
            setIsErrorModalVisible(true);
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
            setErrorMessage('Por favor, corrija los errores en el formulario.');
            setIsErrorModalVisible(true);
            return;
        }

        try {
            setIsLoading(true);

            const response = await startQuotationFlow({
                ppu: formData.patente.toUpperCase(),
                brand: formData.marca,
                model: formData.modelo,
                year: formData.año,
                purchaserId: formData.rut,
                ownerOption: OWNER_OPTIONS_MAP[formData.isDueño as keyof typeof OWNER_OPTIONS_MAP]
            });
            console.log('response', response.quoterId);
            router.push({
                pathname: ROUTES.QUOTE.QUOTE_RESULTS,
                params: {
                    plans: encodeURIComponent(JSON.stringify(response.plans)),
                    quoterId: response.quoterId,
                    vehicle: encodeURIComponent(JSON.stringify(response.vehicle))
                }
            });

        } catch (error) {
            console.error('Error al cotizar:', error);
            setErrorMessage('No se pudo realizar la cotización');
            setIsErrorModalVisible(true);
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
                    isPlate={true}
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
                    options={Object.keys(OWNER_OPTIONS_MAP)}
                />
            </View>

            <ThemedButton
                text="Siguiente"
                onPress={handleSubmit}
                disabled={isLoading || !formData.marca || !formData.modelo || !formData.patente || !formData.rut || !formData.isDueño}
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