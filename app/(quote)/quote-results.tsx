import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { InsurancePlan, ROUTES } from '@/core/types';
import { View, StyleSheet, Pressable, FlatList } from 'react-native';
import Colors from '@/constants/Colors';
import { useThemeColor } from '@/shared/hooks';
import { ThemedText, ThemedInput, FiltersModal, QuoteCard, ThemedLayoutFlatList, CarIcon, MessageModal } from "@/shared/components";
import { useQuote } from '@/core/context';
import { Ionicons } from '@expo/vector-icons';

interface Filters {
    insuranceType: string;
    company: string;
    coverage: string;
    replacementCar: string;
}

export default function QuoteResults() {
    const themeColors = useThemeColor();
    const [showFilters, setShowFilters] = useState(false);
    const router = useRouter();
    const { plans, vehicle } = useQuote();
    const [filteredPlans, setFilteredPlans] = useState<InsurancePlan[]>([]);
    const [filters, setFilters] = useState<Filters>({
        insuranceType: 'Seguro por kilómetro',
        company: '',
        coverage: '',
        replacementCar: ''
    });

    useEffect(() => {
        if (plans) {
            setFilteredPlans(plans);
        }
    }, [plans]);

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
                            options={Array.from(new Set(plans.map(plan => plan.insurer.name)))}
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
