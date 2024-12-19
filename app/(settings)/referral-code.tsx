import React, { useState } from 'react';
import { StyleSheet, View, Image, Share, Clipboard, TouchableOpacity } from 'react-native';
import { ThemedLayout } from '@/shared/components/layouts/ThemedLayout';
import { ThemedText } from '@/shared/components/ui/ThemedText';
import { ThemedButton } from '@/shared/components/ui/ThemedButton';
import { useThemeColor } from '@/shared/hooks/useThemeColor';
import { useAuth } from '@/core/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function ReferralCodeScreen() {
  const themeColors = useThemeColor();
  const { user } = useAuth();
  const [isCopied, setIsCopied] = useState(false);

  const handleShareLink = async () => {
    try {
      await Share.share({
        title: '¡Únete a Moneyfy!',
        message: `¡Hola! Te invito a unirte a Moneyfy. Usa mi código de referido: ${user?.codeToSuggest}\n\nDescarga la app aquí: https://play.google.com/store/apps/details?id=cl.moneyfy.app.&hl=es_9393`,
      });
    } catch (error) {
      console.error('Error al compartir:', error);
    }
  };

  const handleCopyCode = async () => {
    try {
      await Clipboard.setString(user?.codeToSuggest || '');
      setIsCopied(true);
      // Resetear el estado después de 2 segundos
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Error al copiar:', error);
    }
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

        <View style={[styles.codeContainer, {
          backgroundColor: themeColors.backgroundCardColor,
          borderColor: themeColors.textColorAccent,
        }]}>
          <ThemedText
            variant="superTitle"
            textAlign="center"
            color={themeColors.textColorAccent}
            style={styles.codeText}
          >
            {user?.codeToSuggest}
          </ThemedText>
        </View>

        <TouchableOpacity onPress={handleCopyCode}>
          <View style={styles.copyContainer}>
            <ThemedText
              variant="paragraph"
              color={isCopied ? themeColors.gray3to4 : themeColors.textColorAccent}
            >
              {isCopied ? "¡Código copiado!" : "Copiar código"}
            </ThemedText>
            <Ionicons 
              name={isCopied ? "checkmark-circle" : "copy-outline"} 
              size={20} 
              color={isCopied ? themeColors.gray3to4 : themeColors.textColorAccent}
              style={{ marginLeft: 8 }}
            />
          </View>
        </TouchableOpacity>
      </View>

      <ThemedButton
        text="Compartir"
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
  codeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    borderRadius: 16,
    borderWidth: 2,
    marginBottom: 24,
    width: '100%',
  },
  codeText: {
    fontSize: 32,
    lineHeight: 32,
    letterSpacing: 2,
  },
  copyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 48,
  },
});