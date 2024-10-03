import React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { ThemedLayout } from '@/components/ThemedLayout';
import { ThemedText } from '@/components/ThemedText';
import { ThemedButton } from '@/components/ThemedButton';
import { useThemeColor } from '@/hooks/useThemeColor';
import QRCode from 'react-native-qrcode-svg';

export default function ReferralCodeScreen() {
  const themeColors = useThemeColor();
  const referralCode = '2453456345'; // Este código debería venir de tu backend

  const handleShareLink = () => {
    // Implementar la lógica para compartir el enlace
    console.log('Compartiendo enlace...');
  };

  return (
    <ThemedLayout padding={[0, 40]}>

      <View style={styles.content}>
        <ThemedText variant="superTitle" textAlign="center" marginBottom={8}>Mientras más refieres</ThemedText>
        <ThemedText variant="superTitle" textAlign="center" color={themeColors.status.success} marginBottom={16}>
          más lucas 🙌😃
        </ThemedText>

        <ThemedText variant="paragraph" textAlign="center" marginBottom={24}>
          Coparte tu código QR o link con tus amigos, familiares, quien quieras, y sigue sumando lucas.
        </ThemedText>

        <View style={styles.qrContainer}>
          <QRCode
            value={`https://www.referidosapp.cl/qr-user/${referralCode}`}
            size={200}
            color={themeColors.textColorAccent}
            backgroundColor={themeColors.backgroundColor}
          />
        </View>

        <ThemedText variant="paragraph" textAlign="center" color={themeColors.status.success} marginBottom={24}>
          https://www.referidosapp.cl/qr-user/{referralCode}
        </ThemedText>
      </View>

      <ThemedButton
        text="Compartir Link"
        onPress={handleShareLink}
        icon={{ name: "share", position: "left" }}
      />
    </ThemedLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
});