import React from 'react';
import { View, Modal, StyleSheet } from 'react-native';
import { useThemeColor } from '@/shared/hooks/useThemeColor';
import { ThemedText } from '@/shared/components/ui/ThemedText';
import { ThemedButton } from '@/shared/components/ui/ThemedButton';

interface LogoutModalProps {
  isVisible: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({ isVisible, onClose, onLogout }) => {
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
            ¿Estás seguro de que quieres cerrar sesión?
          </ThemedText>
          <View style={styles.buttonContainer}>
            <ThemedButton
              text="Cancelar"
              onPress={onClose}
              variant="secondary"
              style={styles.button}
            />
            <ThemedButton
              text="Cerrar Sesión"
              onPress={onLogout}
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