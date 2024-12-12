import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import { Vehicle } from '@/types/quote';

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
    <TouchableOpacity
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
        <Ionicons key="car-icon" name='car-outline' size={24} color={themeColors.white} />
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
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  vehicleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vehicleInfo: {
    flex: 1,
  },
}); 