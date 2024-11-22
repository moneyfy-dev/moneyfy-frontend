import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedButton } from './ThemedButton';
import { useThemeColor } from '@/hooks/useThemeColor';

interface QuoteCardProps {
  plan: {
    planName: string;
    insuranceCompany: string;
    deductible: number;
    price: number;
    priceUf: number;
    discount: string;
  };
  onPress: () => void;
  showButton?: boolean;
}

export const QuoteCard = ({ plan, onPress, showButton = true }: QuoteCardProps) => {
  const themeColors = useThemeColor();
  const discountPercent = parseFloat(plan.discount);
  const finalPrice = plan.price - (plan.price * (discountPercent / 100));

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  return (
    <View style={[styles.card, { borderColor: themeColors.borderBackgroundColor }]}>
      <View style={styles.cardHeader}>
        <View>
          <ThemedText>{plan.planName}</ThemedText>
          <ThemedText variant="subTitle">
            {plan.insuranceCompany} - Deducible {plan.deductible} UF
          </ThemedText>
        </View>
      </View>

      <Pressable style={[styles.detailButton, { borderBottomColor: themeColors.borderBackgroundColor }]}>
        <ThemedText>Abrir detalle</ThemedText>
      </Pressable>

      <View style={styles.priceSection}>
        {discountPercent > 0 && (
          <View style={[styles.discount, { backgroundColor: themeColors.status.error }]}>
            <ThemedText style={{ color: themeColors.white }}>{discountPercent}%</ThemedText>
          </View>
        )}
        {discountPercent > 0 && (
          <ThemedText style={[styles.originalPrice, { color: themeColors.textParagraph }]}>
            ${plan.price.toLocaleString('es-CL')}
          </ThemedText>
        )}
        <ThemedText style={[styles.finalPrice, { color: themeColors.status.success }]}>
          ${finalPrice.toLocaleString('es-CL')}
        </ThemedText>
        <ThemedText variant="paragraph">
          Cuota mensual {plan.priceUf} UF
        </ThemedText>
      </View>

      {showButton && (
        <ThemedButton text="Comprar" onPress={handlePress} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
});