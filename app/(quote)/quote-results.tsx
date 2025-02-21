import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { InsurancePlan, ROUTES } from '@/core/types';
import { View, StyleSheet, Pressable, FlatList } from 'react-native';
import { useThemeColor } from '@/shared/hooks';
import { ThemedText, ThemedInput, FiltersModal, QuoteCard, ThemedLayoutFlatList, CarIcon, ThemedButton } from "@/shared/components";
import { useQuote } from '@/core/context';
import { Ionicons } from '@expo/vector-icons';

interface Filters {
    insurerName: string;
    priceRange: {
        min: string;
        max: string;
    };
    workshopType: string;
    deductible: string;
}

export default function QuoteResults() {
    const themeColors = useThemeColor();
    const [showFilters, setShowFilters] = useState(false);
    const router = useRouter();
    const { plans, vehicle } = useQuote();
    const [filteredPlans, setFilteredPlans] = useState<InsurancePlan[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<Filters>({
        insurerName: '',
        priceRange: {
            min: '',
            max: ''
        },
        workshopType: '',
        deductible: ''
    });

    // Obtener valores únicos para los filtros
    const uniqueInsurers = Array.from(new Set(plans?.map(plan => plan.insurer.name) || []));
    const uniqueWorkshopTypes = Array.from(new Set(plans?.map(plan => plan.workshopType) || []));
    const uniqueDeductibles = React.useMemo(() => {
        if (!plans) return [];
        
        return Array.from(new Set(plans.map(plan => plan.deductible.toString())))
            .map(Number)  // Convertir a números
            .sort((a, b) => a - b)  // Ordenar numéricamente
            .map(String);  // Volver a convertir a strings
    }, [plans]);

    useEffect(() => {
        console.log(plans);
        if (plans) {
            filterPlans();
        }
    }, [plans, searchQuery, filters]);

    // Función para formatear números con separador de miles
    const formatNumber = (value: string) => {
        // Remover cualquier caracter que no sea número
        const number = value.replace(/\D/g, '');
        // Formatear con separador de miles
        return number.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    // Función para "limpiar" el número antes de usarlo en el filtro
    const cleanNumber = (value: string) => {
        return value.replace(/\./g, '');
    };

    const filterPlans = () => {
        if (!plans) return;

        let filtered = [...plans];

        // Filtrar por búsqueda de aseguradora
        if (searchQuery) {
            filtered = filtered.filter(plan => 
                plan.insurer.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filtrar por aseguradora específica
        if (filters.insurerName) {
            filtered = filtered.filter(plan => 
                plan.insurer.name === filters.insurerName
            );
        }

        // Filtrar por rango de precios
        if (filters.priceRange.min || filters.priceRange.max) {
            filtered = filtered.filter(plan => {
                const price = plan.monthlyPrice;
                const min = filters.priceRange.min ? parseInt(cleanNumber(filters.priceRange.min)) : 0;
                const max = filters.priceRange.max ? parseInt(cleanNumber(filters.priceRange.max)) : Infinity;
                return price >= min && price <= max;
            });
        }

        // Filtrar por tipo de taller
        if (filters.workshopType) {
            filtered = filtered.filter(plan => 
                plan.workshopType === filters.workshopType
            );
        }

        // Filtrar por deducible
        if (filters.deductible) {
            filtered = filtered.filter(plan => 
                plan.deductible.toString() === filters.deductible
            );
        }

        setFilteredPlans(filtered);
    };

    const resetFilters = () => {
        setFilters({
            insurerName: '',
            priceRange: {
                min: '',
                max: ''
            },
            workshopType: '',
            deductible: ''
        });
        setSearchQuery('');
    };

    const handleSelectPlan = (plan: InsurancePlan) => {
        router.push({
            pathname: ROUTES.QUOTE.CONFIRM_ADDRESS,
            params: { planId: plan.planId }
        });
    };

    return (
        <ThemedLayoutFlatList padding={[0, 24]}>
            <View style={styles.container}>
                {vehicle && (
                    <View style={styles.header}>
                        <CarIcon />
                        <View style={styles.vehicleInfo}>
                            <ThemedText variant="superTitle">{vehicle.ppu}</ThemedText>
                            <ThemedText variant="title">
                                {vehicle.year}{' '}
                                <ThemedText variant="subTitle" style={{color: themeColors.textColorAccent}}>
                                    {vehicle.brand.toUpperCase()} {vehicle.model.toUpperCase()}
                                </ThemedText>
                            </ThemedText>
                            <ThemedText variant="paragraph">N° Motor {''} {vehicle.engineNum}</ThemedText>
                        </View>
                    </View>
                )}

                <View>
                    <ThemedInput
                        type="search"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Buscar por aseguradora"
                    />
                </View>

                <View style={styles.resultsHeader}>
                    <ThemedText>{filteredPlans.length} resultados</ThemedText>
                    <Pressable onPress={() => setShowFilters(true)} style={styles.filterIcon}>
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
                    <View style={{ gap: 24 }}>
                        {/* Filtro de Aseguradora */}
                        <View style={[styles.filterSection, { borderBottomColor: themeColors.borderBackgroundColor }]}>
                            <ThemedText variant="subTitle" marginBottom={10}>Aseguradora</ThemedText>
                            <ThemedInput
                                value={filters.insurerName}
                                onChangeText={(value) => setFilters({ ...filters, insurerName: value })}
                                placeholder="Selecciona una aseguradora"
                                isSelect={true}
                                options={uniqueInsurers}
                            />
                        </View>

                        {/* Filtro de Rango de Precios */}
                        <View style={[styles.filterSection, { borderBottomColor: themeColors.borderBackgroundColor }]}>
                            <ThemedText variant="subTitle" marginBottom={10}>Rango de Precios</ThemedText>
                            <View style={styles.priceRangeContainer}>
                                <ThemedInput
                                    label='Mínimo'
                                    value={filters.priceRange.min}
                                    onChangeText={(value) => setFilters({
                                        ...filters,
                                        priceRange: { 
                                            ...filters.priceRange, 
                                            min: formatNumber(value)
                                        }
                                    })}
                                    placeholder="Mínimo"
                                    keyboardType="numeric"
                                />
                                <ThemedInput
                                    label='Máximo'
                                    value={filters.priceRange.max}
                                    onChangeText={(value) => setFilters({
                                        ...filters,
                                        priceRange: { 
                                            ...filters.priceRange, 
                                            max: formatNumber(value)
                                        }
                                    })}
                                    placeholder="Máximo"
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>

                        {/* Filtro de Tipo de Taller 
                        <View style={[styles.filterSection, { borderBottomColor: themeColors.borderBackgroundColor }]}>
                            <ThemedText variant="subTitle" marginBottom={10}>Tipo de Taller</ThemedText>
                            <ThemedCheckGroup
                                options={uniqueWorkshopTypes.map(type => ({ key: type, label: type }))}
                                selectedValue={filters.workshopType}
                                onSelect={(value) => setFilters({ ...filters, workshopType: value })}
                            />
                        </View>*/}

                        {/* Filtro de Deducible */}
                        <View style={[styles.filterSection, { borderBottomColor: themeColors.borderBackgroundColor }]}>
                            <ThemedText variant="subTitle" marginBottom={10}>Deducible</ThemedText>
                            <ThemedInput
                                value={filters.deductible}
                                onChangeText={(value) => setFilters({ ...filters, deductible: value })}
                                placeholder="Selecciona un deducible"
                                isSelect={true}
                                options={uniqueDeductibles}
                            />
                        </View>

                        <View style={styles.filterButtons}>
                            <ThemedButton
                                text="Limpiar Filtros"
                                onPress={resetFilters}
                                variant="secondary"
                                style={styles.resetButton}
                            />
                            <ThemedButton
                                text="Aplicar Filtros"
                                onPress={() => setShowFilters(false)}
                                style={styles.applyButton}
                            />
                        </View>
                    </View>
                </FiltersModal>
            </View>
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
        alignItems: 'center'
    },
    filterIcon: {
        padding: 12
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
        flex: 1,
        borderBottomWidth: 1,
        paddingBottom: 20,
    },
    priceRangeContainer: {
        flexDirection: 'column',
    },
    filterButtons: {
        flexDirection: 'row',
        marginTop: 16,
        gap: 12,
    },
    resetButton: {
        flex: 1,
    },
    applyButton: {
        flex: 1,
    },
});
