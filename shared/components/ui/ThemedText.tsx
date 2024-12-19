import React from 'react';
import { Text, TextStyle, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeColor } from '@/shared/hooks/useThemeColor';
import { Href, Link, useRouter } from 'expo-router';

type TextVariant = 'gigaTitle' | 'jumboTitle' | 'superTitle' | 'title' | 'jumboSubTitle' | 'subTitleBold' | 'subTitle' | 'paragraph' | 'paragraphBold' | 'textLink' | 'notes' | 'default';

interface LinkConfig {
  route?: Href;
  params?: Record<string, string | number>;
  onPress?: () => void;
}

interface ThemedTextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  style?: TextStyle | TextStyle[];
  textAlign?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  marginBottom?: number;
  color?: string;
  linkConfig?: LinkConfig;
  numberOfLines?: number;
}

export const ThemedText: React.FC<ThemedTextProps> = ({
  children,
  variant = 'default',
  style,
  textAlign,
  marginBottom,
  color,
  linkConfig,
  numberOfLines,
}) => {
  const themeColors = useThemeColor();
  const router = useRouter();

  const variantStyles: Record<TextVariant, TextStyle> = {
    gigaTitle: {
      fontSize: 48,
      lineHeight: 56,
      color: themeColors.textColor,
      fontWeight: '800', // extrabold
    },
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
    paragraphBold: {
      fontSize: 12,
      lineHeight: 16,
      color: themeColors.textColor,
      fontWeight: '700', // bold
    },
    textLink: {
      fontSize: 12,
      lineHeight: 16,
      color: themeColors.textColorAccent,
      fontWeight: '600', // semibold
    },
    notes: {
      fontSize: 10,
      lineHeight: 14,
      color: themeColors.textParagraph,
      fontWeight: '400', // semibold
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
    color && { color },
    style,
  ];

  const handlePress = () => {
    if (linkConfig?.onPress) {
      linkConfig.onPress();
    } else if (linkConfig?.route) {
      try {
        if (linkConfig.params) {
          router.push({
            pathname: linkConfig.route,
            params: linkConfig.params
          } as any);
        } else {
          router.push(linkConfig.route);
        }
      } catch (error) {
        console.error('Error en la navegación:', error);
      }
    }
  };

  if (variant === 'textLink' && linkConfig) {
    return (
      <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
        <Text style={combinedStyle} numberOfLines={numberOfLines}>
          {children}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <Text style={combinedStyle} numberOfLines={numberOfLines}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  baseText: {
    // Estilos base comunes a todos los textos
  },
});
export { Text };

