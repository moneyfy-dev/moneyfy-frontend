import React from 'react';
import {
  Modal as RNModal,
  View,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import Colors from '@/constants/Colors';
import { useThemeColor } from '@/shared/hooks';
import { ThemedText } from '../ui/ThemedText';
import { Ionicons } from '@expo/vector-icons';
interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal = ({ visible, onClose, title, children }: ModalProps) => {
  const themeColors = useThemeColor();
  return (
    <RNModal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={[styles.centeredView, { backgroundColor: Colors.common.black75 }]}>
        <View style={[styles.modalView, { backgroundColor: themeColors.backgroundCardColor }]}>
          <View style={styles.header}>
            <ThemedText variant="title">{title}</ThemedText>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={24} color={themeColors.textColorAccent} />
            </Pressable>
          </View>
          <ScrollView style={styles.content}>
            {children}
          </ScrollView>
        </View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
  },
  modalView: {
    marginTop: 'auto',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 24,
    paddingHorizontal: 24,
  },
  content: {
    padding: 24,
  },
});
