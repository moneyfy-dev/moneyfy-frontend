import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedText } from '@/components/ThemedText';
import { ThemedLayout } from '@/components/ThemedLayout';
import { ThemedInput } from '@/components/ThemedInput';
import { searchVehicle } from '@/services/quoteService';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { NoAccountWarning } from '@/components/NoAccountWarning';
import { ThemedButton } from '@/components/ThemedButton';
import { validateRUT } from '@/utils/validations';

type SearchType = 'plate' | 'rut';

export default function QuoteScreen() {
  const router = useRouter();
  const themeColors = useThemeColor();
  const [searchValue, setSearchValue] = useState({
      ownerId: '',
      ppu: '',
    });
  const [errors, setErrors] = useState({
    ownerId: '',
    ppu: '',
  });
  const { user, updateUserData } = useAuth();
  const hasAccounts = user?.accounts && user.accounts.length > 0;

  if (!hasAccounts) {
    return <NoAccountWarning />;
  }

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      ownerId: '',
      ppu: '',
    };

    if (searchValue.ownerId && !validateRUT(searchValue.ownerId)) {
      newErrors.ownerId = 'RUT inválido';
      isValid = false;
    }

    if (searchValue.ppu) {
      const ppuRegex = /^[a-zA-Z0-9]{6}$/;
      if (!ppuRegex.test(searchValue.ppu)) {
        newErrors.ppu = 'La patente debe tener exactamente 6 caracteres alfanuméricos';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSearch = async (value: { ownerId: string, ppu: string }) => {
    if (!validateForm()) {
      return;
    }

    if (!value.ownerId.trim() && !value.ppu.trim()) {
      setErrors({
        ownerId: 'Ingrese el RUT del propietario',
        ppu: 'Ingrese la patente del vehículo'
      });
      return;
    }

    try {
      const response = await searchVehicle(value.ownerId, value.ppu.toUpperCase());

      if (response?.data?.user) {
        await updateUserData(response.data.user);
        
        router.push({
          pathname: '/(quote)/search-results',
          params: {
            value: JSON.stringify(value),
            vehicle: encodeURIComponent(JSON.stringify(response.data.vehicle)),
            referredId: response.data.referredId
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

      <View style={styles.searchSection}>
        <ThemedInput
          label='RUT'
          value={searchValue.ownerId}
          onChangeText={(text) => {
            setSearchValue({ ...searchValue, ownerId: text });
            setErrors(prev => ({ ...prev, ownerId: '' }));
          }}
          placeholder='Ingresa el RUT del propietario'
          error={errors.ownerId}
          isRUT={true}
          icon="person-outline"
        />
        <ThemedInput
          label='Patente'
          value={searchValue.ppu}
          onChangeText={(text) => {
            setSearchValue({ ...searchValue, ppu: text.toUpperCase() });
            setErrors(prev => ({ ...prev, ppu: '' }));
          }}
          placeholder='Ingresa la patente del vehículo'
          error={errors.ppu}
          icon="car-outline"
        />
      </View>

      <ThemedButton
        style={styles.searchButton}
        text="Buscar"
        onPress={() => handleSearch(searchValue)}
      />

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
  searchSection: {
    marginBottom: 16,
  },
  searchInput: {
    marginBottom: 0,
  },
  searchButton: {
    marginBottom: 16,
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