import React, { useRef, useState } from 'react';
import { ScrollView, TextInput, View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ROUTES } from '@/core/types';
import { useMessageConfig, useThemeColor } from '@/shared/hooks';
import {
  ThemedLayout,
  ThemedText,
  ThemedInput,
  ThemedButton,
  NoAccountWarningScreen,
  LoadingScreen,
  MessageModal
} from '@/shared/components';
import { formatRUT, validatePPU, validateRUT } from '@/shared/utils/validations';
import { useUser, useQuote } from '@/core/context';
import { Ionicons } from '@expo/vector-icons';

export default function QuoteScreen() {
  const router = useRouter();
  const themeColors = useThemeColor();
  const scrollRef = useRef<ScrollView>(null);
  const rutInputRef = useRef<TextInput>(null);
  const { user } = useUser();
  const { searchVehicle, isLoading } = useQuote();
  const [rutErrorVisible, setRutErrorVisible] = useState(false);
  const [searchValue, setSearchValue] = useState({
    ownerId: '',
    ppu: '',
  });
  const [errors, setErrors] = useState({
    ownerId: '',
    ppu: '',
  });

  useMessageConfig(['/quoter/search/vehicle']);

  const hasAccounts = user?.accounts && user.accounts.length > 0;

  const focusRutInput = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
    setTimeout(() => {
      rutInputRef.current?.focus();
    }, 250);
  };

  const closeRutError = () => {
    setRutErrorVisible(false);
    focusRutInput();
  };

  if (!hasAccounts) {
    return <NoAccountWarningScreen />;
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

    if (searchValue.ppu && !validatePPU(searchValue.ppu)) {
      newErrors.ppu = 'Formato de patente inválido.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSearch = async () => {
    if (!validateForm()) {
      if (searchValue.ownerId && !validateRUT(searchValue.ownerId)) {
        focusRutInput();
        setRutErrorVisible(true);
      }
      return;
    }

    if (!searchValue.ownerId.trim() && !searchValue.ppu.trim()) {
      setErrors({
        ownerId: 'Ingrese el RUT del propietario',
        ppu: 'Ingrese la patente del vehículo'
      });
      return;
    }

    const formattedOwnerId = formatRUT(searchValue.ownerId);
    const formattedSearchValue = {
      ownerId: formattedOwnerId,
      ppu: searchValue.ppu.toUpperCase(),
    };

    try {
      setSearchValue(formattedSearchValue);
      await searchVehicle(
        formattedOwnerId,
        formattedSearchValue.ppu
      );

      router.push({
        pathname: ROUTES.QUOTE.SEARCH_RESULTS,
        params: {
          value: JSON.stringify(formattedSearchValue)
        }
      });
    } catch (error) {
      const ownerIdError = (error as any)?.response?.data?.data?.ownerId;

      if (ownerIdError) {
        setErrors(prev => ({ ...prev, ownerId: 'RUT inválido' }));
        focusRutInput();
        setRutErrorVisible(true);
      }
    }
  };

  return (
    <>
      {isLoading ? <LoadingScreen /> : (
        <ThemedLayout padding={[40, 24]} scrollRef={scrollRef}>
          <View style={styles.header}>
            <ThemedText variant="title" textAlign="center">
              Cotiza un seguro
            </ThemedText>
            <ThemedText variant="paragraph" textAlign="center">
              Ingresa los datos del vehículo para comenzar
            </ThemedText>
          </View>

          <View style={styles.searchSection}>
            <ThemedInput
              ref={rutInputRef}
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
              isPlate={true}
            />
          </View>

          <ThemedButton
            text="Buscar"
            onPress={handleSearch}
          />

          <TouchableOpacity
            style={styles.manualEntryButton}
            onPress={() => router.push(ROUTES.QUOTE.MANUAL_SEARCH)}
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
      )}
      <MessageModal
        isVisible={rutErrorVisible}
        onClose={closeRutError}
        title="RUT invalido"
        message="Revisa el RUT ingresado. Debe tener un formato valido y digito verificador correcto."
        icon={{
          name: 'alert-circle-outline',
          color: themeColors.status.warning,
        }}
        primaryButton={{
          text: 'Entendido',
          onPress: closeRutError,
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 48,
  },
  searchSection: {
    marginBottom: 16,
  },
  manualEntryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 8,
    height: 48

  },
  manualEntryText: {
    marginLeft: 10,
  },
});
