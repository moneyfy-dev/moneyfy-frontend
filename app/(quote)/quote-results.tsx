import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable, Alert, FlatList } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { InsurancePlan, Vehicle } from '@/core/types/quote';
import { ThemedText } from "@/shared/components/ThemedText";
import { ThemedInput } from "@/shared/components/ThemedInput";
import { FiltersModal } from '@/shared/components/FiltersModal';
import { ThemedLayout } from '@/shared/components/ThemedLayout';
import { useThemeColor } from '@/shared/hooks/useThemeColor';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { QuoteCard } from '@/shared/components/QuoteCard';
import { ThemedLayoutFlatList } from '@/shared/components/ThemedLayoutFlatList';
import { useRouter } from 'expo-router';
import { CarIcon } from '@/shared/components/images/vehicles/CarIcon';
import { MessageModal } from '@/shared/components/MessageModal';
import { ROUTES } from '@/core/types/routes';

interface Filters {
  insuranceType: string;
  company: string;
  coverage: string;
  replacementCar: string;
}

export default function QuoteResults() {
    const themeColors = useThemeColor();
    const [showFilters, setShowFilters] = useState(false);
    const { plans: plansParam, referredId: referredIdParam, vehicle: vehicleParam } = useLocalSearchParams();
    const router = useRouter();
    const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
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
        console.log('referredIdParam', referredIdParam);
        router.push({
            pathname: ROUTES.QUOTE.CONFIRM_ADDRESS,
            params: {
                referredId: referredIdParam,
                plan: JSON.stringify(plan),
                vehicle: vehicleParam
            }
        });
    };

    useEffect(() => {
        console.log('vehicleParam', vehicleParam);
        try {
            if (plansParam) {
                
                let parsedPlans: InsurancePlan[];
                
                if (typeof plansParam === 'string') {
                    // Si es un string, parseamos el JSON
                    parsedPlans = JSON.parse(plansParam);
                } else if (Array.isArray(plansParam)) {
                    // Si ya es un array, lo convertimos a unknown primero
                    parsedPlans = plansParam as unknown as InsurancePlan[];
                } else {
                    // Si es un solo objeto, lo envolvemos en un array
                    parsedPlans = [plansParam as unknown as InsurancePlan];
                }
                
                setPlans(parsedPlans);
                setFilteredPlans(parsedPlans);
            }
            if (vehicleParam) {
                let parsedVehicle: Vehicle;
                if(typeof vehicleParam === 'string') {
                    parsedVehicle = JSON.parse(vehicleParam);
                } else {
                    parsedVehicle = vehicleParam as unknown as Vehicle;
                }
                setSelectedVehicle(parsedVehicle);
            }
        } catch (error) {
            setErrorMessage('Hubo un problema al cargar los resultados');
            setIsErrorModalVisible(true);
        }
    }, [plansParam]);

    useEffect(() => {
        let result = [...plans];

        if (filters.company) {
            result = result.filter(plan => 
                plan.insuranceCompany.toLowerCase().includes(filters.company.toLowerCase())
            );
        }
        if (filters.coverage) {
            result = result.filter(plan => 
                plan.planName.toLowerCase().includes(filters.coverage.toLowerCase())
            );
        }

        setFilteredPlans(result);
    }, [filters, plans]);

    return (
        <ThemedLayoutFlatList padding={[0, 24]}>
            <View style={styles.container}>
                {selectedVehicle && (
                    <View style={styles.header}>
                        <CarIcon />
                        <View style={styles.vehicleInfo}>
                            <ThemedText variant="superTitle">{selectedVehicle.ppu}</ThemedText>
                            <ThemedText variant="title">
                                {selectedVehicle.year}{' '}
                                <ThemedText variant="subTitle" style={{color: themeColors.textColorAccent}}>
                                    {selectedVehicle.brand.toUpperCase()} {selectedVehicle.model.toUpperCase()}
                                </ThemedText>
                            </ThemedText>
                            <ThemedText variant="paragraph">N° Motor {''} {selectedVehicle.engineNum}</ThemedText>
                        </View>
                    </View>
                )}

                <View style={styles.resultsHeader}>
                    <ThemedText>{filteredPlans.length} resultados</ThemedText>
                    <Pressable onPress={() => setShowFilters(true)}>
                        <Ionicons name="menu-outline" size={24} color={themeColors.textColorAccent} />
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
                    keyExtractor={(item) => item.planId}
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
        </ThemedLayoutFlatList>
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
        marginTop: 10,
        marginBottom: 20,
    },
    vehicleInfo: {
        flex: 1,
        marginLeft: 20,
    },
    resultsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
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
