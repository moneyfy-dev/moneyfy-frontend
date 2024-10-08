import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemedLayout } from '@/components/ThemedLayout';
import { ThemedText } from '@/components/ThemedText';
import { ThemedInput } from '@/components/ThemedInput';
import { ThemedButton } from '@/components/ThemedButton';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import getEnvVars from '@/config';

const { apiUrl } = getEnvVars();

export default function CarInsuranceQuoteScreen() {
    const [marca, setMarca] = useState('');
    const [modelo, setModelo] = useState('');
    const [anio, setAnio] = useState('');
    const [uso, setUso] = useState('');
    const [cobertura, setCobertura] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const themeColors = useThemeColor();
    const router = useRouter();

    const handleCotizar = async () => {
        if (!marca || !modelo || !anio || !uso || !cobertura) {
            Alert.alert('Error', 'Por favor, complete todos los campos.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post(`${apiUrl}/cotizacion-seguro`, {
                marca,
                modelo,
                anio,
                uso,
                cobertura
            });

            if (response.data && response.data.ofertas) {
                router.push({
                    pathname: '/ofertas-seguro-auto',
                    params: { ofertas: JSON.stringify(response.data.ofertas) }
                });
            } else {
                Alert.alert('Error', 'No se pudieron obtener ofertas. Intente nuevamente.');
            }
        } catch (error) {
            console.error('Error al obtener cotizaciones:', error);
            Alert.alert('Error', 'Hubo un problema al procesar su solicitud. Intente nuevamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ThemedLayout>
            <ScrollView style={styles.container}>
                <ThemedText variant='title' marginBottom={16}>Cotización de Seguro de Auto</ThemedText>

                <ThemedInput
                    placeholder="Marca del vehículo"
                    value={marca}
                    onChangeText={setMarca}
                    marginBottom={16}
                />

                <ThemedInput
                    placeholder="Modelo del vehículo"
                    value={modelo}
                    onChangeText={setModelo}
                    marginBottom={16}
                />

                <ThemedInput
                    placeholder="Año del vehículo"
                    value={anio}
                    onChangeText={setAnio}
                    keyboardType="numeric"
                    marginBottom={16}
                />

                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={uso}
                        onValueChange={(itemValue) => setUso(itemValue)}
                        style={[styles.picker, { color: themeColors.textColor }]}
                    >
                        <Picker.Item label="Seleccione el uso del vehículo" value="" />
                        <Picker.Item label="Particular" value="particular" />
                        <Picker.Item label="Comercial" value="comercial" />
                        <Picker.Item label="Transporte público" value="transporte_publico" />
                    </Picker>
                </View>

                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={cobertura}
                        onValueChange={(itemValue) => setCobertura(itemValue)}
                        style={[styles.picker, { color: themeColors.textColor }]}
                    >
                        <Picker.Item label="Seleccione el tipo de cobertura" value="" />
                        <Picker.Item label="Básica" value="basica" />
                        <Picker.Item label="Intermedia" value="intermedia" />
                        <Picker.Item label="Completa" value="completa" />
                    </Picker>
                </View>

                <ThemedButton
                    text="Cotizar"
                    onPress={handleCotizar}
                    style={styles.cotizarButton}
                    disabled={isLoading}
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
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 16,
    },
    picker: {
        height: 50,
        width: '100%',
    },
    cotizarButton: {
        marginTop: 24,
    },
});