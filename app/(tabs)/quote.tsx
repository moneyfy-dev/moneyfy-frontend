import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from '@/components/ThemedText';
import { ThemedLayout } from '@/components/ThemedLayout';
import { ThemedInput } from '@/components/ThemedInput';
import { ThemedButton } from '@/components/ThemedButton';
import Colors from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

type SearchType = 'plate' | 'rut';

export default function QuoteScreen() {
  const router = useRouter();
  const themeColors = useThemeColor();
  const [searchValue, setSearchValue] = useState('');
  const [activeTab, setActiveTab] = useState<SearchType>('plate');

  const handleSearch = (type: SearchType, value: string) => {
    console.log(`Buscando por ${type}:`, value);
    // Aquí iría la lógica de búsqueda
    if (type === 'plate') {
      router.push({
        pathname: '/(quote)/search-results',
        params: { type: 'plate', value: value }
      });
    } else {
      router.push({
        pathname: '/(quote)/search-results',
        params: { type: 'rut', value: value }
      });
    }
  };

  const TabButton = ({ type, label, icon }: { type: SearchType, label: string, icon: string }) => (
    <TouchableOpacity
      style={[styles.tabButton, activeTab === type && styles.tabButtonActive]}
      onPress={() => {
        setActiveTab(type);
        setSearchValue('');
      }}
    >
      {activeTab === type ? (
        <LinearGradient
          colors={[Colors.common.green2, Colors.common.green4]}
          style={styles.tabButtonGradient}
        >
          <Ionicons name={icon as any} size={20} color={themeColors.white} />
          <ThemedText variant="paragraph" color={themeColors.white}>{label}</ThemedText>
        </LinearGradient>
      ) : (
        <View style={styles.tabButtonContent}>
          <Ionicons name={icon as any} size={20} color={themeColors.textColorAccent} />
          <ThemedText variant="paragraph">{label}</ThemedText>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <ThemedLayout padding={[24, 24]}>
      <View style={styles.header}>
        <ThemedText variant="superTitle" marginBottom={8}>
          Cotiza rápidamente el seguro más adecuado
        </ThemedText>
        <ThemedText variant="paragraph" color={themeColors.textParagraph}>
          Cotiza diferentes planes de seguros ingresando la información de tu vehículo o el RUT del propietario.
        </ThemedText>
      </View>

      <View style={styles.tabContainer}>
        <TabButton type="plate" label="Buscar Patente" icon="car-outline" />
        <TabButton type="rut" label="Buscar RUT" icon="person-outline" />
      </View>

      <View style={styles.searchSection}>
        <ThemedText variant="subTitle" marginBottom={8}>
          {activeTab === 'plate' ? 'Patente' : 'RUT'}
        </ThemedText>
        <ThemedInput
          placeholder={`Ingresa ${activeTab === 'plate' ? 'la patente del vehículo' : 'el RUT del propietario'}`}
          value={searchValue}
          onChangeText={setSearchValue}
          icon="search-outline"
          onIconPress={() => handleSearch(activeTab, searchValue)}
          isRUT={activeTab === 'rut'}
          style={styles.searchInput}
        />
      </View>

      <TouchableOpacity 
        style={styles.manualEntryButton}
        onPress={() => router.push('/(quote)/manual-search')}
      >
        <Ionicons 
          name="hand-left-outline" 
          size={20} 
          color={themeColors.textColorAccent}
        />
        <ThemedText 
          variant="paragraph" 
          color={themeColors.textColorAccent}
          style={styles.manualEntryText}
        >
          Ingreso manual
        </ThemedText>
      </TouchableOpacity>
    </ThemedLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 32,
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  tabButton: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  tabButtonActive: {
    elevation: 2,
    shadowColor: Colors.common.green4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  tabButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
  },
  tabButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.common.gray3,
    borderRadius: 8,
  },
  searchSection: {
    marginBottom: 24,
  },
  searchInput: {
    marginBottom: 0,
  },
  manualEntryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
  },
  manualEntryText: {
    marginLeft: 4,
  },
});