import React from 'react';
import { View } from 'react-native';
import { Modal } from './Modal';

interface FiltersModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const FiltersModal = ({
  visible,
  onClose,
  title = "",
  children
}: FiltersModalProps) => {
  return (
    <Modal visible={visible} onClose={onClose} title={title}>
      <View>
        {children}
      </View>
    </Modal>
  );
};