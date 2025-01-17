import React, { useState } from 'react';
import { InsurancePlan } from '@/core/types';
import { View, StyleSheet, Pressable } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import { ThemedText } from '../ui/ThemedText';
import { ThemedButton } from '../ui/ThemedButton';
import { Ionicons } from '@expo/vector-icons';
import { InsurerLogo } from '../ui/InsurerLogo';

interface QuoteCardProps {
  plan: InsurancePlan;
  onPress?: () => void;
  showButton?: boolean;
}

export const QuoteCard = ({ plan, onPress, showButton = true }: QuoteCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const themeColors = useThemeColor();
  const discountPercent = plan.discount ? Number(plan.discount) * 100 : 0; // Manejar caso donde discount puede ser string o number
  
  // Calcular valores mensuales
  const monthlyPrice = plan.montlyPrice;
  const monthlyFinalPrice = Math.round(monthlyPrice - (monthlyPrice * (discountPercent / 100)));
  const monthlyPriceUf = Number((plan.netPriceUF / 12).toFixed(2));

  // Verificar si hay coberturas disponibles
  const hasCoverages = plan.stolenVehicle || 
                      plan.totalLoss || 
                      plan.damageThirdParty || 
                      plan.workshopType || 
                      (plan.details && plan.details.length > 0);

  // Mapear las coberturas solo si existen
  const coverages = hasCoverages ? [
    ...(plan.stolenVehicle ? [{ title: 'Robo del vehículo', description: plan.stolenVehicle }] : []),
    ...(plan.totalLoss ? [{ title: 'Pérdida total', description: plan.totalLoss }] : []),
    ...(plan.damageThirdParty ? [{ title: 'Daños a terceros', description: plan.damageThirdParty }] : []),
    ...(plan.workshopType ? [{ title: 'Tipo de taller', description: plan.workshopType }] : []),
    ...(plan.details ? plan.details.map(detail => ({
      title: 'Detalle adicional',
      description: detail
    })) : [])
  ] : [];

  return (
    <View style={[styles.card, { borderColor: themeColors.borderBackgroundColor }]}>
      <View style={styles.cardHeader}>
        <View style={styles.logoContainer}>
          {plan.insurer && typeof plan.insurer === 'object' && (
            <InsurerLogo
              darkLogo={plan.insurer.darkLogo}
              lightLogo={plan.insurer.lightLogo}
              />
          )}
        </View>
        <ThemedText variant='paragraph' style={styles.planName}>
          {plan.planName}
        </ThemedText>
        <ThemedText variant="title" style={styles.deductible}>
          Deducible {plan.deductible} UF
        </ThemedText>
      </View>

      {hasCoverages && ( // Solo mostrar el botón si hay coberturas
        <Pressable 
          style={[
            styles.detailButton,
            { borderBottomColor: themeColors.borderBackgroundColor },
            { borderTopColor: themeColors.borderBackgroundColor }
          ]}
          onPress={() => setIsExpanded(!isExpanded)}
        >
          <ThemedText>{isExpanded ? 'Cerrar detalle' : 'Abrir detalle'}</ThemedText>
          <Ionicons 
            name={isExpanded ? 'remove' : 'add'} 
            size={24} 
            color={themeColors.textColorAccent}
          />
        </Pressable>
      )}

      {isExpanded && hasCoverages && (
        <View style={styles.coveragesContainer}>
          {coverages.map((coverage, index) => (
            <View key={index} style={styles.coverageItem}>
              <View style={[styles.bulletPoint, { backgroundColor: themeColors.status.success }]} />
              <View style={styles.coverageText}>
                <ThemedText style={styles.coverageTitle}>
                  {coverage.title}: {' '}
                  <ThemedText variant="paragraph">{coverage.description}</ThemedText>
                </ThemedText>
              </View>
            </View>
          ))}
        </View>
      )}

      <View style={styles.priceSection}>
        <View style={styles.discountContainer}>
          {discountPercent > 0 && (
            <>
              <View style={[styles.discount, { backgroundColor: themeColors.status.error }]}>
                <ThemedText style={{ color: themeColors.white }}>{discountPercent}%</ThemedText>
              </View>
              <ThemedText style={[styles.originalPrice, { color: themeColors.textParagraph }]}>
                ${monthlyPrice.toLocaleString('es-CL')}
              </ThemedText>
            </>
          )}
        </View>
        <ThemedText style={[styles.finalPrice, { color: themeColors.status.success }]}>
          ${monthlyFinalPrice.toLocaleString('es-CL')}
        </ThemedText>
        <ThemedText variant="paragraph">
          Cuota mensual {monthlyPriceUf} UF
        </ThemedText>
      </View>

      {showButton && (
        <ThemedButton 
          text="Comprar" 
          onPress={onPress || (() => {})} 
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoContainer: {
    marginBottom: 8,
  },
  planName: {
    textAlign: 'center',
    marginBottom: 4,
  },
  deductible: {
    textAlign: 'center',
  },
  detailButton: {
    padding: 12,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  coveragesContainer: {
    paddingVertical: 16,
    gap: 12,
  },
  coverageItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  coverageText: {
    flex: 1,
    flexDirection: 'column',
    gap: 4,
  },
  coverageTitle: {
    fontWeight: 'bold',
  },
  seeMoreButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  priceSection: {
    marginVertical: 16,
    alignItems: 'center',
  },
  discountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
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
});

