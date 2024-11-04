import React, { useState } from 'react';
import { ThemedLayout } from "@/components/ThemedLayout";
import { ThemedText } from "@/components/ThemedText";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedButton } from "@/components/ThemedButton";
import { validateRUT } from '@/utils/validations';
import { Alert } from 'react-native';

const OWNER_OPTIONS = [
    "Si, soy el dueño del vehículo",
    "No, soy el padre/madre del dueño",
    "No, soy el conviviente civil del dueño",
    "No, soy el cónyuge del dueño",
    "No, soy el hijo(a) del dueño"
];

export default function ManualSearchScreen() {
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
        <ThemedLayout>
            <ThemedText variant="title">Ingreso de vehículo manual</ThemedText>
            
            <ThemedText variant="subTitle">
                Completa la información de tu vehículo manualmente para encontrar el seguro que mejor se adapte a tus necesidades.
            </ThemedText>

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

            <ThemedText variant="subTitle" style={{ marginTop: 24 }}>
                Datos del comprador
            </ThemedText>

            <ThemedText variant="paragraph">
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
                label="¿Es el dueño del vehículo?"
                value={formData.isDueño}
                onChangeText={(value) => setFormData({ ...formData, isDueño: value })}
                placeholder="Si, soy el dueño del vehículo"
                isSelect={true}
                options={OWNER_OPTIONS}
            />

            <ThemedButton 
                text="Siguiente"
                onPress={handleSubmit}
            />
        </ThemedLayout>
    );
}