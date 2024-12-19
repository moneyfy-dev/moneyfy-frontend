import React from 'react';
import { QuoterPersonalData, QuoterAddressData } from '@/core/types';
import { View, StyleSheet } from 'react-native';
import { useThemeColor } from '@/shared/hooks';
import { ThemedText } from '@/shared/components';
import { Ionicons } from '@expo/vector-icons';

interface QuoterInfoCardProps {
  personalData: QuoterPersonalData;
  addressData: QuoterAddressData;
}

export const QuoterInfoCard = ({ personalData, addressData }: QuoterInfoCardProps) => {
  const themeColors = useThemeColor();

  const hasPersonalData = personalData.name || personalData.email || personalData.phone;
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
            {personalData.name && personalData.surname && (
              <View style={styles.infoRow}>
                <ThemedText variant="paragraph" color={themeColors.textParagraph}>
                  Nombre completo:
                </ThemedText>
                <ThemedText variant="paragraph">
                  {personalData.name} {personalData.surname}
                </ThemedText>
              </View>
            )}

            {personalData.email && (
              <View style={styles.infoRow}>
                <ThemedText variant="paragraph" color={themeColors.textParagraph}>
                  Email:
                </ThemedText>
                <ThemedText variant="paragraph">{personalData.email}</ThemedText>
              </View>
            )}

            {personalData.phone && (
              <View style={styles.infoRow}>
                <ThemedText variant="paragraph" color={themeColors.textParagraph}>
                  Teléfono:
                </ThemedText>
                <ThemedText variant="paragraph">{personalData.phone}</ThemedText>
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
                Calle:
              </ThemedText>
              <ThemedText variant="paragraph">
                { addressData.street && addressData.streetNumber ? `${addressData.street} ${addressData.streetNumber}` : 'No hay dirección proporcionada'}
              </ThemedText>
            </View>

            {addressData.department && (
              <View style={styles.infoRow}>
                <ThemedText variant="paragraph" color={themeColors.textParagraph}>
                  Departamento:
                </ThemedText>
                <ThemedText variant="paragraph">{addressData.department}</ThemedText>
              </View>
            )}

            {addressData.inspection && (
              <View style={styles.infoRow}>
                <ThemedText variant="paragraph" color={themeColors.textParagraph}>
                  Inspección:
                </ThemedText>
                <ThemedText variant="paragraph">{addressData.inspection}</ThemedText>
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