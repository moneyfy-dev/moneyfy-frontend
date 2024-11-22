import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, Alert, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { InsurancePlan, Vehicle } from '@/types/quote';
import { ThemedText } from "@/components/ThemedText";
import { ThemedInput } from "@/components/ThemedInput";
import { FiltersModal } from '@/components/FiltersModal';
import { ThemedLayout } from '@/components/ThemedLayout';
import { useThemeColor } from '@/hooks/useThemeColor';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { QuoteCard } from '@/components/QuoteCard';

interface Filters {
  insuranceType: string;
  company: string;
  coverage: string;
  replacementCar: string;
}

export default function QuoteResults() {
    const themeColors = useThemeColor();
    const [showFilters, setShowFilters] = useState(false);
    const { selectedVehicle: vehicleParam, plans: plansParam } = useLocalSearchParams();
    
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
    const [plans, setPlans] = useState<InsurancePlan[]>([]);
    const [filteredPlans, setFilteredPlans] = useState<InsurancePlan[]>([]);
    const [filters, setFilters] = useState<Filters>({
        insuranceType: 'Seguro por kilómetro',
        company: '',
        coverage: '',
        replacementCar: ''
    });

    // Función para manejar la selección del plan
    const handleSelectPlan = (plan: InsurancePlan) => {
        // Implementa la lógica de selección aquí
        console.log('Plan seleccionado:', plan);
    };

    useEffect(() => {
        try {
            if (vehicleParam && plansParam) {
                const parsedVehicle = JSON.parse(decodeURIComponent(vehicleParam as string));
                const parsedPlans = JSON.parse(decodeURIComponent(plansParam as string));
                
                setSelectedVehicle(parsedVehicle);
                setPlans(parsedPlans);
                setFilteredPlans(parsedPlans);
            }
        } catch (error) {
            console.error('Error al procesar los datos:', error);
            Alert.alert('Error', 'Hubo un problema al cargar los resultados');
        }
    }, [vehicleParam, plansParam]);

    useEffect(() => {
        let result = [...plans];

        if (filters.company) {
            result = result.filter(plan => 
                plan.insuranceCompany.toLowerCase().includes(filters.company.toLowerCase())
            );
        }

        // Aquí podrías agregar más filtros según los campos que vengan en los planes
        // Por ejemplo, si los planes tuvieran un campo coverage:
        if (filters.coverage) {
            result = result.filter(plan => 
                plan.planName.toLowerCase().includes(filters.coverage.toLowerCase())
            );
        }

        setFilteredPlans(result);
    }, [filters, plans]);

    return (
        <ThemedLayout padding={[0, 24]}>
            <View style={styles.container}>
                {selectedVehicle && (
                    <View style={styles.header}>
                        <View style={styles.vehicleInfo}>
                            <ThemedText variant="title">{selectedVehicle.ppu}</ThemedText>
                            <ThemedText>{selectedVehicle.year} {selectedVehicle.brand} {selectedVehicle.model}</ThemedText>
                        </View>
                    </View>
                )}

                <View style={styles.resultsHeader}>
                    <ThemedText>{filteredPlans.length} resultados</ThemedText>
                    <Pressable onPress={() => setShowFilters(true)}>
                        <Ionicons name="filter-outline" size={24} color={themeColors.textColorAccent} />
                    </Pressable>
                </View>

                <FlatList
                    data={filteredPlans}
                    renderItem={({ item }) => (
                        <QuoteCard
                            plan={item}
                            onPress={() => handleSelectPlan(item)}
                            showButton={true}
                        />
                    )}
                    keyExtractor={(item) => item.id}
                />

                <FiltersModal
                    visible={showFilters}
                    onClose={() => setShowFilters(false)}
                >
                    <View style={styles.filterSection}>
                        <View style={styles.radioGroup}>
                            <ThemedText variant="subTitle">Tipo de Seguro</ThemedText>
                            {['Seguro por kilómetro', 'Seguro tradicional'].map((option) => (
                                <Pressable
                                    key={option}
                                    style={styles.radioOption}
                                    onPress={() => setFilters({ ...filters, insuranceType: option })}
                                >
                                    <View style={[
                                        styles.radio,
                                        filters.insuranceType === option && styles.radioSelected
                                    ]} />
                                    <ThemedText>{option}</ThemedText>
                                </Pressable>
                            ))}
                        </View>

                        <ThemedInput
                            label="Compañía"
                            value={filters.company}
                            onChangeText={(value) => setFilters({ ...filters, company: value })}
                            placeholder="Seguros Falabella"
                            isSelect={true}
                            options={Array.from(new Set(plans.map(plan => plan.insuranceCompany)))}
                        />

                        <View style={styles.radioGroup}>
                            <ThemedText variant="subTitle">Cobertura</ThemedText>
                            {['Cobertura Premium', 'Cobertura Full', 'Cobertura Básica'].map((option) => (
                                <Pressable
                                    key={option}
                                    style={styles.radioOption}
                                    onPress={() => setFilters({ ...filters, coverage: option })}
                                >
                                    <View style={[
                                        styles.radio,
                                        filters.coverage === option && styles.radioSelected
                                    ]} />
                                    <ThemedText>{option}</ThemedText>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                </FiltersModal>
            </View>
        </ThemedLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    vehicleInfo: {
        flex: 1,
        marginLeft: 12,
    },
    resultsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    resultsList: {
        flex: 1,
    },
    card: {
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    detailButton: {
        padding: 12,
        borderBottomWidth: 1,
    },
    priceSection: {
        marginVertical: 16,
        alignItems: 'flex-start',
    },
    discount: {
        padding: 4,
        borderRadius: 4,
    },
    originalPrice: {
        textDecorationLine: 'line-through',
    },
    finalPrice: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    filterSection: {
        padding: 16,
    },
    radioGroup: {
        marginVertical: 16,
    },
    radioOption: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    radio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: Colors.status.success,
        marginRight: 8,
    },
    radioSelected: {
        backgroundColor: Colors.status.success,
    },
});
