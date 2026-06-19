import React, { useMemo, useState } from 'react';
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

    const getInsurerName = (plan: InsurancePlan) =>
        typeof plan.insurer === 'string' ? plan.insurer : plan.insurer?.name ?? '';

    const getPlanId = (plan: InsurancePlan) =>
        plan.planId || (plan as any).uniquePlan || (plan as any).quoterPlanId || (plan as any).idPlan || (plan as any).id || '';

    // Obtener valores únicos para los filtros
    const uniqueInsurers = useMemo(
        () => Array.from(new Set((plans || []).map(getInsurerName).filter(Boolean))),
        [plans]
    );
    const uniqueWorkshopTypes = useMemo(
        () => Array.from(new Set((plans || []).map(plan => plan.workshopType).filter(Boolean))),
        [plans]
    );
    const uniqueDeductibles = useMemo(() => {
        if (!plans) return [];
        
        return Array.from(new Set(plans.map(plan => plan.deductible.toString())))
            .map(Number)  // Convertir a números
            .sort((a, b) => a - b)  // Ordenar numéricamente
            .map(String);  // Volver a convertir a strings
    }, [plans]);

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

    const filteredPlans = useMemo(() => {
        if (!plans) return [];

        let filtered = [...plans];

        // Filtrar por búsqueda de aseguradora
        if (searchQuery) {
            filtered = filtered.filter(plan => 
                getInsurerName(plan).toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Filtrar por aseguradora específica
        if (filters.insurerName) {
            filtered = filtered.filter(plan => 
                getInsurerName(plan) === filters.insurerName
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

        return filtered;
    }, [filters, plans, searchQuery]);

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
        const planIndex = plans.findIndex(candidate => candidate === plan);
        const selectedPlanId = getPlanId(plan);

        router.push({
            pathname: ROUTES.QUOTE.CONFIRM_ADDRESS,
            params: {
                planId: selectedPlanId,
                planIndex: planIndex >= 0 ? String(planIndex) : undefined,
            }
        });
    };

    return (
        <ThemedLayoutFlatList padding={[0, 24]} contentContainerStyle={styles.screenContent}>
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
                    style={styles.planList}
                    contentContainerStyle={styles.planListContent}
                    renderItem={({ item }) => (
                        <QuoteCard
                            plan={item}
                            onPress={() => handleSelectPlan(item)}
                            showButton={true}
                        />
                    )}
                    keyExtractor={(item, index) => [
                        getPlanId(item),
                        getInsurerName(item),
                        item.deductible,
                        item.monthlyPriceUF,
                        index,
                    ].join('-')}
                />

                <FiltersModal
                    visible={showFilters}
                    onClose={() => setShowFilters(false)}
                >
                    <View style={styles.filtersContent}>
                        {/* Filtro de Aseguradora */}
                        <View style={[styles.filterSection, { borderBottomColor: themeColors.borderBackgroundColor }]}>
                            <ThemedText variant="subTitle" marginBottom={6}>Aseguradora</ThemedText>
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
                            <ThemedText variant="subTitle" marginBottom={6}>Rango de precios</ThemedText>
                            <View style={styles.priceRangeContainer}>
                                <View style={styles.halfField}>
                                    <ThemedInput
                                        label="Mínimo"
                                        value={filters.priceRange.min}
                                        onChangeText={(value) => setFilters({
                                            ...filters,
                                            priceRange: {
                                                ...filters.priceRange,
                                                min: formatNumber(value)
                                            }
                                        })}
                                        placeholder="$0"
                                        keyboardType="numeric"
                                    />
                                </View>
                                <View style={styles.halfField}>
                                    <ThemedInput
                                        label="Máximo"
                                        value={filters.priceRange.max}
                                        onChangeText={(value) => setFilters({
                                            ...filters,
                                            priceRange: {
                                                ...filters.priceRange,
                                                max: formatNumber(value)
                                            }
                                        })}
                                        placeholder="Sin límite"
                                        keyboardType="numeric"
                                    />
                                </View>
                            </View>
                        </View>

                        <View style={[styles.filterSection, { borderBottomColor: themeColors.borderBackgroundColor }]}>
                            <View style={styles.filterFieldsRow}>
                                {uniqueWorkshopTypes.length > 0 && (
                                    <View style={styles.halfField}>
                                        <ThemedInput
                                            label="Tipo de taller"
                                            value={filters.workshopType}
                                            onChangeText={(value) => setFilters({ ...filters, workshopType: value })}
                                            placeholder="Todos"
                                            isSelect={true}
                                            options={uniqueWorkshopTypes}
                                        />
                                    </View>
                                )}
                                <View
                                    style={[
                                        styles.halfField,
                                        uniqueWorkshopTypes.length === 0 && styles.fullField,
                                    ]}
                                >
                                    <ThemedInput
                                        label="Deducible"
                                        value={filters.deductible}
                                        onChangeText={(value) => setFilters({ ...filters, deductible: value })}
                                        placeholder="Todos"
                                        isSelect={true}
                                        options={uniqueDeductibles}
                                    />
                                </View>
                            </View>
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
    screenContent: {
        paddingBottom: 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    planList: {
        flex: 1,
        minHeight: 0,
    },
    planListContent: {
        gap: 16,
        paddingBottom: 8,
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
        borderBottomWidth: 1,
        paddingBottom: 8,
    },
    filtersContent: {
        gap: 10,
    },
    priceRangeContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    filterFieldsRow: {
        flexDirection: 'row',
        gap: 10,
    },
    halfField: {
        flex: 1,
        minWidth: 0,
    },
    fullField: {
        flexBasis: '100%',
    },
    filterButtons: {
        flexDirection: 'row',
        marginTop: 2,
        gap: 10,
    },
    resetButton: {
        flex: 1,
    },
    applyButton: {
        flex: 1,
    },
});