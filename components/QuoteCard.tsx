import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Linking } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedButton } from './ThemedButton';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { SvgXml } from 'react-native-svg';
import { useTheme } from '@/context/ThemeContext';
import { Logo } from './Logo';

interface QuoteCardProps {
  plan: {
    planName: string;
    insuranceCompany: string;
    deductible: number;
    price: number;
    priceUf: number;
    discount: string;
    logos: {
      light: string;
      dark: string;
    };
    coverages: {
      title: string;
      description: string;
    }[];
  };
  onPress?: () => void;
  showButton?: boolean;
}

export const QuoteCard = ({ plan, onPress, showButton = true }: QuoteCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const themeColors = useThemeColor();
  const { currentTheme } = useTheme();
  const discountPercent = parseFloat(plan.discount);
  const finalPrice = plan.price - (plan.price * (discountPercent / 100));

  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  // Datos de ejemplo para las coberturas
  const mockCoverages = [
    { title: 'Robo del vehículo', description: 'Valor comercial' },
    { title: 'Pérdida total', description: 'Valor comercial en caso de daños mayores al 65% del valor' },
    { title: 'Daños a terceros', description: 'Hasta 1.000 UF entre daños emergentes, morales y lucro cesante' },
    { title: 'Tipo de taller', description: 'Oficial de la marca' },
    { title: 'Auto de reemplazo', description: 'Limitado hasta 45 días' },
    { title: 'Reposición a nuevo', description: 'Hasta 1 año después de comprado' },
    { title: 'Promoción', description: '30% de dcto en 6 cuotas: N° 2, 4, 6, 8, 10 y 12 de la primera vigencia' },
  ];

  return (
    <View style={[styles.card, { borderColor: themeColors.borderBackgroundColor }]}>
      <View style={styles.cardHeader}>
        <View style={styles.logoContainer}>
          <Logo></Logo>
        </View>
        <ThemedText variant='paragraph' style={styles.planName}>{plan.planName}</ThemedText>
        <ThemedText variant="title" style={styles.deductible}>
          Deducible {plan.deductible} UF
        </ThemedText>
      </View>

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

      {isExpanded && (
        <View style={styles.coveragesContainer}>
          {mockCoverages.map((coverage, index) => (
            <View key={index} style={styles.coverageItem}>
              <View style={[styles.bulletPoint, { backgroundColor: themeColors.status.success }]} />
              <View style={styles.coverageText}>
                <ThemedText style={styles.coverageTitle}>{coverage.title}:</ThemedText>
                <ThemedText variant="paragraph">{coverage.description}</ThemedText>
              </View>
            </View>
          ))}
          <Pressable 
            style={styles.seeMoreButton} 
            onPress={() => Linking.openURL('https://connect360.cl')}
          >
            <ThemedText style={{ color: themeColors.status.info }}>Ver más {'>'}</ThemedText>
          </Pressable>
        </View>
      )}

      <View style={styles.priceSection}>
        <View style={styles.discountContainer}>
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
        </View>
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
    alignItems: 'center',
    marginBottom: 12,
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
    flexDirection: 'row',
    flexWrap: 'wrap',
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