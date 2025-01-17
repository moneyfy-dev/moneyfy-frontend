import React from 'react';
import { QuoterOwnerData, QuoterAddressData } from '@/core/types';
import { View, StyleSheet } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import { ThemedText } from '../ui/ThemedText';
import { Ionicons } from '@expo/vector-icons';

interface QuoterInfoCardProps {
  personalData: QuoterOwnerData;
  addressData: QuoterAddressData;
}

export const QuoterInfoCard = ({ personalData, addressData }: QuoterInfoCardProps) => {
  const themeColors = useThemeColor();

  const hasPersonalData = personalData.name;
  const hasAddressData = addressData.street || addressData.streetNumber;

  if (!hasPersonalData && !hasAddressData) return null;

  return (
    <View style={[styles.card, { borderColor: themeColors.borderBackgroundColor }]}>
      {hasPersonalData && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person-outline" size={20} color={themeColors.textColorAccent} />
            <ThemedText variant="subTitleBold">Información de Contacto</ThemedText>
          </View>

          <View style={styles.infoContainer}>
            {personalData.name && personalData.paternalSurname && personalData.maternalSurname && (
              <View style={styles.infoRow}>
                <ThemedText variant="paragraph" color={themeColors.textParagraph}>
                  Nombre completo:
                </ThemedText>
                <ThemedText variant="paragraph" color={themeColors.textColor}>
                  <ThemedText variant="paragraph" color={themeColors.textColorAccent}>
                    {personalData.name}{' '}
                  </ThemedText>
                  {personalData.paternalSurname} {personalData.maternalSurname}
                </ThemedText>
              </View>
            )}
          </View>
        </View>
      )}

      {hasAddressData && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="location-outline" size={20} color={themeColors.textColorAccent} />
            <ThemedText variant="subTitleBold">Dirección</ThemedText>
          </View>

          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <ThemedText variant="paragraph" color={themeColors.textParagraph}>
                Dirección:
              </ThemedText>
              <ThemedText variant="paragraph" color={themeColors.textColorAccent}>
                {addressData.street ? `${addressData.street}` : 'No hay dirección proporcionada'}
              </ThemedText>
            </View>

            {addressData && (
              <View style={styles.infoRow}>
                <ThemedText variant="paragraph" color={themeColors.textParagraph}>
                  Número:
                </ThemedText>
                <ThemedText variant="paragraph" color={themeColors.textColorAccent}>{addressData.streetNumber}</ThemedText>
              </View>
            )}

            {addressData.department && (
              <View style={styles.infoRow}>
                <ThemedText variant="paragraph" color={themeColors.textParagraph}>
                  Departamento ?:
                </ThemedText>
                <ThemedText variant="paragraph" color={themeColors.textColorAccent}>{addressData.department}</ThemedText>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 24,
  },
  section: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoContainer: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}); 