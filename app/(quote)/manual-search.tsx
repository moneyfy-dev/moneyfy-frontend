import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedLayout } from "@/components/ThemedLayout";
import { ThemedText } from "@/components/ThemedText";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedButton } from "@/components/ThemedButton";
import { validateRUT } from '@/utils/validations';
import { Alert } from 'react-native';
import { ThemedView } from '@/components/ThemedView';

const OWNER_OPTIONS = [
    "Si, soy el dueño del vehículo",
    "No, soy el padre/madre del dueño",
    "No, soy el conviviente civil del dueño",
    "No, soy el cónyuge del dueño",
    "No, soy el hijo(a) del dueño"
];

export default function ManualSearchScreen() {
    const themeColors = useThemeColor();
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

    const handleSubmit = () => {
        if (!validateRUT(formData.rut)) {
            setErrors({ ...errors, rut: 'RUT inválido' });
            Alert.alert('Error', 'Por favor, corrija los errores en el formulario.');
            return;
        }

        console.log(formData);
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

                <ThemedInput
                    label="Marca"
                    value={formData.marca}
                    onChangeText={(value) => setFormData({ ...formData, marca: value })}
                    placeholder="Marca"
                    isSelect={true}
                    options={[]} // Aquí irían las marcas disponibles
                />

                <ThemedInput
                    label="Modelo"
                    value={formData.modelo}
                    onChangeText={(value) => setFormData({ ...formData, modelo: value })}
                    placeholder="Modelo"
                    isSelect={true}
                    options={[]} // Aquí irían los modelos disponibles
                />

                <ThemedInput
                    label="Año"
                    value={formData.año}
                    onChangeText={(value) => setFormData({ ...formData, año: value })}
                    placeholder="Año"
                    isSelect={true}
                    options={[]} // Aquí irían los años disponibles
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

                <ThemedText variant="paragraph" textAlign="center" style={{ marginBottom: 16 }}>
                    Por favor complete la información del comprador
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