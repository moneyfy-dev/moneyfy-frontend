import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedLayout } from '@/components/ThemedLayout';
import { ThemedText } from '@/components/ThemedText';
import { ThemedInput } from '@/components/ThemedInput';
import { ThemedButton } from '@/components/ThemedButton';

export function ConfirmAddressScreen() {
  return (
    <ThemedLayout padding={[0, 24]}>
      <ThemedText variant="title" textAlign="center" marginBottom={16}>
        RZKT93
      </ThemedText>
      <ThemedText variant="paragraph" textAlign="center" marginBottom={16}>
        2022 Yamaha R1
      </ThemedText>
      <ThemedText variant="subTitle" textAlign="center" marginBottom={16}>
        Confirmación datos del propietario
      </ThemedText>
      <ThemedText variant="paragraph" textAlign="center" marginBottom={16}>
        La dirección se utiliza para comunicaciones importantes como la carta de cancelación y para ajustar la cobertura y condiciones del seguro según la ubicación del vehículo.
      </ThemedText>

      <ThemedInput label="Calle" placeholder="Calle" value="" onChangeText={() => {}}   />
      <ThemedInput label="Número" placeholder="Número" value="" onChangeText={() => {}} />
      <ThemedInput label="Departamento (opcional)" placeholder="Departamento" value="" onChangeText={() => {}} />

      <ThemedButton text="Continuar" onPress={() => {}} style={styles.button} />
    </ThemedLayout>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 24,
  },
}); 