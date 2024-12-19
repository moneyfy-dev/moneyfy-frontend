import React from 'react';
import { View, Modal, StyleSheet } from 'react-native';
import { useThemeColor } from '@/shared/hooks/useThemeColor';
import { ThemedText } from '@/shared/components/ui/ThemedText';
import { ThemedButton } from '@/shared/components/ui/ThemedButton';
import { Ionicons } from '@expo/vector-icons';

interface ButtonConfig {
  text: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

interface MessageModalProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  icon?: {
    name: keyof typeof Ionicons.glyphMap;
    color?: string;
  };
  primaryButton: ButtonConfig;
  secondaryButton?: ButtonConfig;
}

export const MessageModal: React.FC<MessageModalProps> = ({
  isVisible,
  onClose,
  title,
  message,
  icon,
  primaryButton,
  secondaryButton
}) => {
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
          {icon && (
            <View style={[styles.iconContainer, { backgroundColor: themeColors.extremeContrastGray }]}>
              <Ionicons
                name={icon.name}
                size={60}
                color={icon.color || themeColors.textColorAccent}
              />
            </View>
          )}
          
          <ThemedText variant="title" textAlign='center' marginBottom={8}>
            {title}
          </ThemedText>
          
          <ThemedText variant="paragraph" textAlign='center' marginBottom={32}>
            {message}
          </ThemedText>

          <View style={styles.buttonContainer}>
            {secondaryButton && (
              <View style={styles.buttonWrapper}>
                <ThemedButton
                  text={secondaryButton.text}
                  onPress={secondaryButton.onPress}
                  variant="secondary"
                />
              </View>
            )}
            <View style={styles.buttonWrapper}>
              <ThemedButton
                text={primaryButton.text}
                onPress={primaryButton.onPress}
              />
            </View>
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
    elevation: 5,
    width: '85%',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  buttonWrapper: {
    flex: 1,
  }
}); 