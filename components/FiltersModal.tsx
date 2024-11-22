import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal } from './Modal';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

interface FiltersModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const FiltersModal = ({
  visible,
  onClose,
  title = "Filtros",
  children
}: FiltersModalProps) => {
  return (
    <Modal visible={visible} onClose={onClose} title={title}>
      <View style={styles.container}>
        {children}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 24,
  },
});