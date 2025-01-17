import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { useThemeColor } from '../../hooks/useThemeColor';
import { ThemedText } from '../ui/ThemedText';
import { Ionicons } from '@expo/vector-icons';

type ButtonSize = 'lg' | 'sm';
type ButtonWidth = 'full' | 'auto' | 'half' | 'third' | 'quarter';
type ButtonVariant = 'primary' | 'secondary';

interface ThemedButtonProps {
    text: string;
    onPress: () => void;
    icon?: {
        name: keyof typeof Ionicons.glyphMap;
        position: 'left' | 'right';
    };
    style?: ViewStyle;
    disabled?: boolean;
    backgroundColor?: string;
    size?: ButtonSize;
    width?: ButtonWidth;
    variant?: ButtonVariant;
}

export const ThemedButton: React.FC<ThemedButtonProps> = ({
    text,
    onPress,
    icon,
    style,
    disabled = false,
    backgroundColor,
    size = 'lg',
    width = 'full',
    variant = 'primary',
}) => {
    const themeColors = useThemeColor();

    const buttonBackgroundColor = disabled
        ? themeColors.disabledColor
        : variant === 'primary'
        ? backgroundColor || themeColors.buttonBackgroundColor
        : 'transparent';

    const buttonSizeStyle = size === 'sm' ? styles.buttonSm : styles.buttonLg;
    const textSizeStyle = size === 'sm' ? styles.textSm : styles.textLg;
    const iconSize = size === 'sm' ? 16 : 24;

    const buttonWidthStyle = styles[`width${width.charAt(0).toUpperCase() + width.slice(1)}` as keyof typeof styles];

    const buttonStyle = [
        styles.button,
        buttonSizeStyle,
        buttonWidthStyle,
        { backgroundColor: buttonBackgroundColor },
        variant === 'secondary' && { borderWidth: 1, borderColor: themeColors.textColorAccent },
        style
    ];

    const textColor = variant === 'primary' ? themeColors.buttonTextColor : themeColors.textColorAccent;

    return (
        <TouchableOpacity
            style={buttonStyle}
            onPress={onPress}
            disabled={disabled}
        >
            {icon && icon.position === 'left' && (
                <Ionicons name={icon.name} size={iconSize} color={textColor} style={styles.iconLeft} />
            )}
            <ThemedText style={[styles.buttonText, textSizeStyle, { color: textColor }]}>
                {text}
            </ThemedText>
            {icon && icon.position === 'right' && (
                <Ionicons name={icon.name} size={iconSize} color={textColor} style={styles.iconRight} />
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
    },
    buttonLg: {
        height: 50,
        paddingHorizontal: 16,
    },
    buttonSm: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 50,
    },
    buttonText: {
        fontWeight: '600',
    },
    textLg: {
        fontSize: 12,
    },
    textSm: {
        fontSize: 10,
    },
    iconLeft: {
        marginRight: 8,
    },
    iconRight: {
        marginLeft: 8,
    },
    widthFull: {
        width: '100%',
    },
    widthAuto: {
        // No se establece un ancho específico
    },
    widthHalf: {
        width: '50%',
    },
    widthThird: {
        width: '33.33%',
    },
    widthQuarter: {
        width: '25%',
    },
});