import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Brand, OWNER_OPTIONS_MAP, ROUTES } from '@/core/types';
import { ScrollView, TextInput, View, StyleSheet } from 'react-native';
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
import { formatRUT, validateEmail, validateName, validatePhoneNumber, validatePPU, validateRUT } from '@/shared/utils/validations';
import { useQuote } from '@/core/context';
import { getQuoteErrorMessage } from '@/shared/utils/quoteErrors';

export default function ManualSearchScreen() {
    const themeColors = useThemeColor();
    const router = useRouter();
    const params = useLocalSearchParams<{
        ownerId?: string;
        ppu?: string;
        quoterId?: string;
    }>();
    const scrollRef = useRef<ScrollView>(null);
    const rutInputRef = useRef<TextInput>(null);
    const hasLoadedVehiclesRef = useRef(false);
    const {
        startQuotationFlow,
        getAvailableVehicles,
        availableVehicles,
        isLoading
    } = useQuote();
    const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
    const [quoteError, setQuoteError] = useState('');
    const [catalogError, setCatalogError] = useState('');
    const [rutErrorVisible, setRutErrorVisible] = useState(false);
    const [rutInputY, setRutInputY] = useState(0);
    const [openAutocomplete, setOpenAutocomplete] = useState<'brand' | 'model' | null>(null);
    const [isCatalogLoading, setIsCatalogLoading] = useState(false);

    const handleBrandDropdownVisibility = useCallback((visible: boolean) => {
        setOpenAutocomplete(current =>
            visible ? 'brand' : current === 'brand' ? null : current
        );
    }, []);

    const handleModelDropdownVisibility = useCallback((visible: boolean) => {
        setOpenAutocomplete(current =>
            visible ? 'model' : current === 'model' ? null : current
        );
    }, []);

    const [formData, setFormData] = useState({
        ppu: params.ppu || '',
        brand: '',
        model: '',
        year: '',
        version: '',
        purchaserId: params.ownerId || '',
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

    const focusRutInput = () => {
        scrollRef.current?.scrollTo({ y: Math.max(rutInputY - 24, 0), animated: true });
        setTimeout(() => {
            rutInputRef.current?.focus();
        }, 250);
    };

    const closeRutError = () => {
        setRutErrorVisible(false);
        focusRutInput();
    };

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
        if (hasLoadedVehiclesRef.current) return;

        hasLoadedVehiclesRef.current = true;
        let cancelled = false;

        const loadVehicles = async () => {
            setIsCatalogLoading(true);
            try {
                await getAvailableVehicles();
            } catch {
                if (!cancelled) {
                    setCatalogError('No pudimos cargar el listado de marcas y modelos. Puedes ingresar los datos manualmente para continuar.');
                }
            } finally {
                if (!cancelled) {
                    setIsCatalogLoading(false);
                }
            }
        };

        void loadVehicles();

        return () => {
            cancelled = true;
        };
    }, [getAvailableVehicles]);

    const handleBrandSelect = (brandName: string) => {
        const brand = availableVehicles.find(b => b.brand === brandName);
        setSelectedBrand(brand || null);
        setFormData(prev => ({
            ...prev,
            brand: brandName,
            model: ''
        }));
    };

    const handleModelSelect = (modelName: string) => {
        if (selectedBrand) {
            setFormData(prev => ({
                ...prev,
                model: modelName
            }));
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            if (formData.purchaserId && !validateRUT(formData.purchaserId)) {
                focusRutInput();
                setRutErrorVisible(true);
            }
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

        if (!formData.ppu || !formData.brand || !formData.model || !formData.year || !formData.version ||
            !formData.purchaserId || !formData.purchaserName || !formData.purchaserPaternalSur ||
            !formData.purchaserMaternalSur || !formData.purchaserEmail || !formData.purchaserPhone || !formData.isOwner) {
            setErrors({
              ppu: !formData.ppu ? 'Ingrese la patente del vehiculo' : '',
              brand: !formData.brand ? 'Ingrese la marca del vehiculo' : '',
              model: !formData.model ? 'Ingrese el modelo del vehiculo' : '',
              year: !formData.year ? 'Ingrese el ano del vehiculo' : '',
              version: !formData.version ? 'Ingrese la version del vehiculo' : '',
              purchaserId: !formData.purchaserId ? 'Ingrese el RUT del comprador' : '',
              purchaserName: !formData.purchaserName ? 'Ingrese el nombre del comprador' : '',
              purchaserPaternalSur: !formData.purchaserPaternalSur ? 'Ingrese el apellido paterno del comprador' : '',
              purchaserMaternalSur: !formData.purchaserMaternalSur ? 'Ingrese el apellido materno del comprador' : '',
              purchaserEmail: !formData.purchaserEmail ? 'Ingrese el email del comprador' : '',
              purchaserPhone: !formData.purchaserPhone ? 'Ingrese el telefono del comprador' : '',
              isOwner: !formData.isOwner ? 'Ingrese si es el dueno del vehiculo' : '',
            });
            return;
        }

        const formattedPurchaserId = formatRUT(formData.purchaserId);

        try {
            setFormData(prev => ({ ...prev, purchaserId: formattedPurchaserId }));
            const response = await startQuotationFlow({
                quoterId: params.quoterId || '',
                ppu: formData.ppu.toUpperCase(),
                brand: formData.brand,
                model: formData.model,
                year: formData.year,
                requestType: 'Manual',
                purchaserId: formattedPurchaserId,
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
            setQuoteError(getQuoteErrorMessage(error, {
                emptyPlansMessage: 'No encontramos planes vigentes para este vehiculo. Intenta con otros datos o vuelve a cotizar mas tarde.',
                genericMessage: 'No fue posible obtener planes para esta cotizacion. Intentalo nuevamente en unos minutos.',
                invalidJwtMessage: 'La API rechazo la sesion de cotizacion. Cierra sesion e ingresa nuevamente; si sigue ocurriendo, el backend debe renovar el refresh token al iniciar sesion.',
            }));
        }
    };

    return (
        <>
            {(isLoading || isCatalogLoading) ? <LoadingScreen /> : (

                <ThemedLayout
                    padding={[0, 40]}
                    scrollRef={scrollRef}
                    scrollEnabled={!openAutocomplete}
                >
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
                            placeholder={availableVehicles.length > 0 ? 'Selecciona una marca' : 'Ingresa una marca'}
                            zIndex={2}
                            onDropdownVisibilityChange={handleBrandDropdownVisibility}
                        />

                        <ThemedAutocomplete
                            label="Modelo"
                            value={formData.model}
                            onChangeText={(value) => setFormData({ ...formData, model: value })}
                            error={errors.model}
                            onSelect={handleModelSelect}
                            options={selectedBrand?.models.map(m => m.model) || []}
                            placeholder={availableVehicles.length > 0 ? 'Selecciona un modelo' : 'Ingresa un modelo'}
                            disabled={availableVehicles.length > 0 && !selectedBrand}
                            zIndex={1}
                            onDropdownVisibilityChange={handleModelDropdownVisibility}
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

                        <View onLayout={(event) => setRutInputY(event.nativeEvent.layout.y)}>
                            <ThemedInput
                                ref={rutInputRef}
                                label="RUT del comprador"
                                value={formData.purchaserId}
                                onChangeText={(value) => setFormData({ ...formData, purchaserId: value })}
                                error={errors.purchaserId}
                                placeholder="RUT"
                                isRUT={true}
                            />
                        </View>

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
            <MessageModal
                isVisible={!!quoteError}
                onClose={() => setQuoteError('')}
                title="No se pudo cotizar"
                message={quoteError}
                icon={{
                    name: 'alert-circle-outline',
                    color: themeColors.status.warning,
                }}
                primaryButton={{
                    text: 'Entendido',
                    onPress: () => setQuoteError(''),
                }}
            />
            <MessageModal
                isVisible={!!catalogError}
                onClose={() => setCatalogError('')}
                title="Datos no disponibles"
                message={catalogError}
                icon={{
                    name: 'alert-circle-outline',
                    color: themeColors.status.warning,
                }}
                primaryButton={{
                    text: 'Entendido',
                    onPress: () => setCatalogError(''),
                }}
            />
            <MessageModal
                isVisible={rutErrorVisible}
                onClose={closeRutError}
                title="RUT invalido"
                message="Revisa el RUT ingresado. Debe tener un formato valido y digito verificador correcto."
                icon={{
                    name: 'alert-circle-outline',
                    color: themeColors.status.warning,
                }}
                primaryButton={{
                    text: 'Entendido',
                    onPress: closeRutError,
                }}
            />
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
