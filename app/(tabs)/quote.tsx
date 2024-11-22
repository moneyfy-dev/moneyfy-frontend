import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from '@/components/ThemedText';
import { ThemedLayout } from '@/components/ThemedLayout';
import { ThemedInput } from '@/components/ThemedInput';
import Colors from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { searchVehicleByPPU, searchVehicleByUserId } from '@/services/quoteService';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { NoAccountWarning } from '@/components/NoAccountWarning';

type SearchType = 'plate' | 'rut';

export default function QuoteScreen() {
  const router = useRouter();
  const themeColors = useThemeColor();
  const [searchValue, setSearchValue] = useState('');
  const [activeTab, setActiveTab] = useState<SearchType>('plate');
  const { user, updateUserData } = useAuth();

  const hasAccounts = user?.accounts && user.accounts.length > 0;

  if (!hasAccounts) {
    return <NoAccountWarning />;
  }

  const handleSearch = async (type: SearchType, value: string) => {
    if (!value.trim()) {
      if (type === 'plate') {
        Alert.alert('Error', 'Por favor ingrese la patente del vehículo');
      } else {
        Alert.alert('Error', 'Por favor ingrese el RUT del propietario');
      }
      return;
    }

    try {
      let response;
      
      if (type === 'plate') {
        response = await searchVehicleByPPU(value.toUpperCase());
      } else {
        response = await searchVehicleByUserId(value);
      }

      if (response?.data?.user) {
        await updateUserData(response.data.user);
        
        const vehiclesData = response.data.vehicles

        router.push({
          pathname: '/(quote)/search-results',
          params: { 
            type, 
            value,
            vehicles: encodeURIComponent(JSON.stringify(vehiclesData))
          }
        });
      } else {
        throw new Error('No se encontraron resultados');
      }
    } catch (error) {
      console.error('Error al buscar:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Error al realizar la búsqueda';
        Alert.alert('Error', errorMessage);
      } else {
        Alert.alert('Error', 'No se pudo realizar la búsqueda. Intente nuevamente.');
      }
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