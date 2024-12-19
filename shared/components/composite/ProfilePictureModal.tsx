import React from 'react';
import { View, Modal, StyleSheet } from 'react-native';
import { useThemeColor } from '@/shared/hooks/useThemeColor';
import { ThemedText } from '@/shared/components/ui/ThemedText';
import { ThemedButton } from '@/shared/components/ui/ThemedButton';

interface ProfilePictureModalProps {
  isVisible: boolean;
  onClose: () => void;
  onDelete: () => void;
  onChange: () => void;
}

export const ProfilePictureModal: React.FC<ProfilePictureModalProps> = ({ isVisible, onClose, onDelete, onChange }) => {
  const themeColors = useThemeColor();

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={[styles.modalView, { backgroundColor: themeColors.backgroundCardColor }]}>
          <ThemedText variant="subTitle" style={styles.modalText}>
            ¿Qué deseas hacer con tu imagen de perfil?
          </ThemedText>
          <View style={styles.buttonContainer}>
            <ThemedButton
              text="Eliminar"
              onPress={onDelete}
              variant="secondary"
              style={styles.button}
            />
            <ThemedButton
              text="Cambiar"
              onPress={onChange}
              style={styles.button}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center'
  }
});