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

  const TabButton = ({ type, label, icon, text }: { type: SearchType, label: string, icon: string, text: string }) => (
    <TouchableOpacity
      style={styles.tabButton}
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
          <View style={[styles.tabIcon, { backgroundColor: Colors.common.white25 }]}>
            <Ionicons name={icon as any} size={20} color={themeColors.white} />
          </View>
          <View style={styles.tabButtonText}>
            <ThemedText variant="paragraph" color={themeColors.white}>{label}</ThemedText>
            <ThemedText variant="subTitleBold" color={themeColors.white}>{text}</ThemedText>
          </View>
        </LinearGradient>
      ) : (
        <View style={[styles.tabButtonContent, { backgroundColor: themeColors.extremeContrastGray }]}>
          <View style={[styles.tabIcon, { backgroundColor: Colors.common.green2 }]}>
            <Ionicons name={icon as any} size={20} color={Colors.common.white} />
          </View>
          <View style={styles.tabButtonText}>

            <ThemedText variant="paragraph">{label}</ThemedText>
            <ThemedText variant="subTitleBold">{text}</ThemedText>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <ThemedLayout padding={[48, 24]}>
      <View style={styles.header}>
        <ThemedText variant="superTitle" marginBottom={16} textAlign="center">
          Cotiza rápidamente el seguro más adecuado
        </ThemedText>
        <ThemedText variant="paragraph" textAlign="center" color={themeColors.textParagraph}>
          Cotiza diferentes planes de seguros ingresando la información de tu vehículo o el RUT del propietario.
        </ThemedText>
      </View>

      <View style={styles.tabContainer}>
        <TabButton type="plate" label="Buscar" text="Patente" icon="car-outline" />
        <TabButton type="rut" label="Buscar" text="RUT" icon="person-outline" />
      </View>

      <View style={styles.searchSection}>
        <ThemedInput
          label={activeTab === 'plate' ? 'Patente' : 'RUT'}
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
          color={themeColors.textColor}
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
    marginBottom: 48,
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  tabButton: {
    flex: 1,
  },
  tabButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 18,
    padding: 16,
    borderRadius: 16,
  },
  tabButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 18,
    padding: 16,
    borderRadius: 16,
  },
  tabIcon: {
    borderRadius: 8,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  tabButtonText: {
    display: 'flex',
    flexDirection: 'column',
  },
  searchSection: {
    marginBottom: 16,
  },
  searchInput: {
    marginBottom: 0,
  },
  manualEntryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 8,
  },
  manualEntryText: {
    marginLeft: 10,
  },
});