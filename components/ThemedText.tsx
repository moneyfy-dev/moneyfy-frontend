import React from 'react';
import { Text, TextStyle, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

type TextVariant = 'jumboTitle' | 'superTitle' | 'title' | 'jumboSubTitle' | 'subTitleBold' | 'subTitle' | 'paragraph' | 'textLink' | 'default';

interface ThemedTextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  style?: TextStyle | TextStyle[];
  textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  marginBottom?: number;
  color?: string; // Nueva prop para color personalizado
}

export const ThemedText: React.FC<ThemedTextProps> = ({
  children,
  variant = 'default',
  style,
  textAlign,
  marginBottom,
  color, // Nueva prop
}) => {
  const themeColors = useThemeColor();

  const variantStyles: Record<TextVariant, TextStyle> = {
    jumboTitle: {
      fontSize: 36,
      lineHeight: 48,
      color: themeColors.textColor,
      fontWeight: '800', // extrabold
    },
    superTitle: {
      fontSize: 24,
      lineHeight: 28,
      color: themeColors.textColor,
      fontWeight: '800', // extrabold
    },
    title: {
      fontSize: 16,
      lineHeight: 22,
      color: themeColors.textColor,
      fontWeight: '800', // extrabold
    },
    jumboSubTitle: {
      fontSize: 20,
      lineHeight: 28,
      color: themeColors.textParagraph,
      fontWeight: '400', // normal
    },
    subTitleBold: {
      fontSize: 14,
      lineHeight: 20,
      color: themeColors.textColor,
      fontWeight: '700', // bold
    },
    subTitle: {
      fontSize: 14,
      lineHeight: 20,
      color: themeColors.textColor,
      fontWeight: '500', // normal
    },
    paragraph: {
      fontSize: 12,
      lineHeight: 16,
      color: themeColors.textParagraph,
      fontWeight: '400', // normal
    },
    textLink: {
      fontSize: 12,
      lineHeight: 16,
      color: themeColors.textColorAccent,
      fontWeight: '600', // semibold
    },
    default: {
      color: themeColors.textColor,
    }
  };

  const combinedStyle = [
    styles.baseText,
    variantStyles[variant],
    textAlign && { textAlign },
    marginBottom !== undefined && { marginBottom },
    color && { color }, // Aplicar color personalizado si se proporciona
    style,
  ];

  return (
    <Text style={combinedStyle}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  baseText: {
    // Estilos base comunes a todos los textos
  },
});
