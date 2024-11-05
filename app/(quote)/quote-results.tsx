import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { ThemedText } from "@/components/ThemedText";
import { ThemedInput } from "@/components/ThemedInput";
import { ThemedButton } from "@/components/ThemedButton";
import { Modal } from '@/components/Modal';
// import { MotorcycleIcon } from '@/components/icons/MotorcycleIcon';
// import { FilterIcon } from '@/components/icons/FilterIcon';

export default function QuoteResults() {
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        insuranceType: 'Seguro estándar',
        deductible: '0 UF',
        company: 'Seguros Falabella',
        coverage: 'Cobertura Full',
        replacementCar: '10 - 30 días'
    });

    const FiltersModal = () => (
        <Modal 
            visible={showFilters} 
            onClose={() => setShowFilters(false)}
            title="Tipo de seguro"
        >
            <View style={styles.filterSection}>
                <View style={styles.radioGroup}>
                    <Pressable 
                        style={styles.radioOption}
                        onPress={() => setFilters({...filters, insuranceType: 'Seguro por kilómetro'})}
                    >
                        <View style={[
                            styles.radio,
                            filters.insuranceType === 'Seguro por kilómetro' && styles.radioSelected
                        ]} />
                        <ThemedText>Seguro por kilómetro</ThemedText>
                    </Pressable>
                    <Pressable 
                        style={styles.radioOption}
                        onPress={() => setFilters({...filters, insuranceType: 'Seguro estándar'})}
                    >
                        <View style={[
                            styles.radio,
                            filters.insuranceType === 'Seguro estándar' && styles.radioSelected
                        ]} />
                        <ThemedText>Seguro estándar</ThemedText>
                    </Pressable>
                </View>

                <ThemedInput
                    label="Deducible"
                    value={filters.deductible}
                    onChangeText={(value) => setFilters({...filters, deductible: value})}
                    placeholder="0 UF"
                    isSelect={true}
                    options={['0 UF', '10 UF', '20 UF']}
                />

                <ThemedInput
                    label="Compañía"
                    value={filters.company}
                    onChangeText={(value) => setFilters({...filters, company: value})}
                    placeholder="Seguros Falabella"
                    isSelect={true}
                    options={['Seguros Falabella', 'Otra Compañía']}
                />

                <View style={styles.radioGroup}>
                    <ThemedText variant="subTitle">Cobertura</ThemedText>
                    {['Cobertura Premium', 'Cobertura Full', 'Cobertura Básica'].map((option) => (
                        <Pressable 
                            key={option}
                            style={styles.radioOption}
                            onPress={() => setFilters({...filters, coverage: option})}
                        >
                            <View style={[
                                styles.radio,
                                filters.coverage === option && styles.radioSelected
                            ]} />
                            <ThemedText>{option}</ThemedText>
                        </Pressable>
                    ))}
                </View>

                <View style={styles.radioGroup}>
                    <ThemedText variant="subTitle">Auto de reemplazo</ThemedText>
                    {['No incluido', '10 - 30 días', '30 - 50 días', 'Ilimitado'].map((option) => (
                        <Pressable 
                            key={option}
                            style={styles.radioOption}
                            onPress={() => setFilters({...filters, replacementCar: option})}
                        >
                            <View style={[
                                styles.radio,
                                filters.replacementCar === option && styles.radioSelected
                            ]} />
                            <ThemedText>{option}</ThemedText>
                        </Pressable>
                    ))}
                </View>
            </View>
        </Modal>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                {/* <MotorcycleIcon /> */}
                <View style={styles.vehicleInfo}>
                    <ThemedText variant="title">RZKT93</ThemedText>
                    <ThemedText>2022 YAMAHA R1</ThemedText>
                    <ThemedText variant="paragraph">N° Motor: 1NZ576966</ThemedText>
                </View>
                <Pressable onPress={() => setShowFilters(true)}>
                    {/* <FilterIcon /> */}
                </Pressable>
            </View>

            <View style={styles.resultsHeader}>
                <ThemedText>16 resultados</ThemedText>
            </View>

            <ScrollView style={styles.resultsList}>
                {/* Aquí irían los resultados de las cotizaciones */}
                <QuoteCard />
                <QuoteCard />
            </ScrollView>

            <FiltersModal />
        </View>
    );
}

const QuoteCard = () => (
    <View style={styles.card}>
        <View style={styles.cardHeader}>
            {/* <InsuranceCompanyIcon /> */}
            <View>
                <ThemedText>Seguro Motocicleta Full Falabella</ThemedText>
                <ThemedText variant="subTitle">Deducible 10 UF</ThemedText>
            </View>
        </View>
        
        <Pressable style={styles.detailButton}>
            <ThemedText>Abrir detalle</ThemedText>
        </Pressable>

        <View style={styles.priceSection}>
            <View style={styles.discount}>
                <ThemedText>30%</ThemedText>
            </View>
            <ThemedText style={styles.originalPrice}>$26.957</ThemedText>
            <ThemedText style={styles.finalPrice}>$18.870</ThemedText>
            <ThemedText variant="paragraph">Cuota mensual 0.5 UF</ThemedText>
        </View>

        <ThemedButton text="Comprar" onPress={() => {}} />
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    vehicleInfo: {
        flex: 1,
        marginLeft: 12,
    },
    resultsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    resultsList: {
        flex: 1,
    },
    card: {
        padding: 16,
        margin: 16,
        borderRadius: 8,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    detailButton: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    priceSection: {
        marginVertical: 16,
        alignItems: 'flex-start',
    },
    discount: {
        backgroundColor: '#FF0066',
        padding: 4,
        borderRadius: 4,
    },
    originalPrice: {
        textDecorationLine: 'line-through',
        color: '#666',
    },
    finalPrice: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#00B833',
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
        borderColor: '#00B833',
        marginRight: 8,
    },
    radioSelected: {
        backgroundColor: '#00B833',
    },
});
