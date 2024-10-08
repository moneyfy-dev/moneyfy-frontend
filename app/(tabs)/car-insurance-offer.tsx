import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedLayout } from '@/components/ThemedLayout';
import { ThemedText } from '@/components/ThemedText';
import { ThemedButton } from '@/components/ThemedButton';
import { useThemeColor } from '@/hooks/useThemeColor';

interface Oferta {
    id: string;
    aseguradora: string;
    precio: number;
    cobertura: string;
    deducible: number;
}

export default function CarInsuranceOffersScreen() {
    const { ofertas: ofertasParam } = useLocalSearchParams();
    const ofertas: Oferta[] = JSON.parse(ofertasParam as string);
    const themeColors = useThemeColor();
    const router = useRouter();

    const handleSeleccionarOferta = (oferta: Oferta) => {
        // Aquí iría la lógica para procesar la selección de la oferta
        // Por ejemplo, podrías navegar a una pantalla de confirmación o iniciar el proceso de compra
        console.log('Oferta seleccionada:', oferta);
    };

    return (
        <ThemedLayout>
            <ScrollView style={styles.container}>
                <ThemedText variant='title' marginBottom={16}>Ofertas de Seguro</ThemedText>

                {ofertas.map((oferta) => (
                    <TouchableOpacity 
                        key={oferta.id} 
                        style={styles.ofertaContainer}
                        onPress={() => handleSeleccionarOferta(oferta)}
                    >
                        <ThemedText variant='subtitle'>{oferta.aseguradora}</ThemedText>
                        <ThemedText variant='paragraph'>Precio: ${oferta.precio}</ThemedText>
                        <ThemedText variant='paragraph'>Cobertura: {oferta.cobertura}</ThemedText>
                        <ThemedText variant='paragraph'>Deducible: ${oferta.deducible}</ThemedText>
                        <ThemedButton
                            text="Seleccionar"
                            onPress={() => handleSeleccionarOferta(oferta)}
                            style={styles.seleccionarButton}
                        />
                    </TouchableOpacity>
                ))}

                <ThemedButton
                    text="Volver a cotizar"
                    onPress={() => router.back()}
                    style={styles.volverButton}
                    variant="secondary"
                />
            </ScrollView>
        </ThemedLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    ofertaContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
    },
    seleccionarButton: {
        marginTop: 8,
    },
    volverButton: {
        marginTop: 24,
    },
});