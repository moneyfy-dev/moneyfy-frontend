import React from 'react';
import { useRouter } from 'expo-router';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useThemeColor } from '@/shared/hooks';
import { ThemedText } from '../../ui/ThemedText';
import { ThemedButton } from '../../ui/ThemedButton';
import { LottieAnimation } from '../../animations/LottieAnimation';

const { width } = Dimensions.get('window');

export const NoAccountWarning = () => {
  const router = useRouter();
  const themeColors = useThemeColor();

  const handleAddAccount = () => {
    router.push('/(settings)/add-account');
  };

  return (
    <View style={[styles.container, { backgroundColor: themeColors.backgroundColor }]}>
      <View style={styles.slide}>
        <View style={styles.imageContainer}>
          <LottieAnimation 
            name="NoAccountWarning"
            style={styles.animation}
            loop={true}
          />
        </View>
        <View style={styles.textContainer}>
          <ThemedText variant="superTitle" textAlign="center" marginBottom={16}>
            Agrega una cuenta bancaria
          </ThemedText>
          <ThemedText variant="paragraph" textAlign="center">
            Para poder cotizar seguros, necesitas tener al menos una cuenta bancaria registrada. 
            Esto nos permite procesar los pagos de manera segura y eficiente.
          </ThemedText>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <ThemedButton
          text="Agregar cuenta bancaria"
          onPress={handleAddAccount}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    width,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: 340,
    height: 340,
  },
  textContainer: {
    marginVertical: 24,
  },
  buttonContainer: {
    paddingHorizontal: 40,
    marginVertical: 24,
  },
}); 