import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

interface VehicleCardProps {
  brand: string;
  model: string;
  ppu: string;
  year: string;
  onPress?: () => void;
  isSelected?: boolean;
  showRightIcon?: boolean;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  brand,
  model,
  ppu,
  year,
  onPress,
  isSelected,
  showRightIcon = true
}) => {
  const themeColors = useThemeColor();

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      onPress={onPress}
      style={[
        styles.vehicleCard,
        { 
          borderColor: isSelected ? themeColors.textColorAccent : themeColors.borderBackgroundColor,
          backgroundColor: isSelected ? themeColors.backgroundCardColor : 'transparent'
        }
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: themeColors.textColorAccent }]}>
        <Ionicons name='car-outline' size={24} color={themeColors.white} />
      </View>
      <View style={styles.vehicleInfo}>
        <ThemedText variant="paragraph">{brand}</ThemedText>
        <ThemedText variant="subTitle">{ppu} - {year}</ThemedText>
        <ThemedText variant="paragraph" color={themeColors.textColorAccent}>
          {model}
        </ThemedText>
      </View>
      {showRightIcon && (
        <Ionicons 
          name={isSelected ? "checkmark-circle" : "chevron-forward"} 
          size={24} 
          color={isSelected ? themeColors.textColorAccent : themeColors.borderBackgroundColor} 
        />
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  vehicleInfo: {
    flex: 1,
  },
}); 