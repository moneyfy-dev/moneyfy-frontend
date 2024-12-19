import React from 'react';
import { KeyboardAvoidingView, ScrollView, Platform, StyleSheet, ViewStyle, RefreshControl, RefreshControlProps } from 'react-native';
import { ThemedSafeAreaView } from './ThemedSafeAreaView';
import { BgSection } from '../images/BgSection';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeColor } from '@/shared/hooks/useThemeColor';

type PaddingProp = [number, number] | number;

interface ThemedLayoutProps {
    children: React.ReactNode;
    contentContainerStyle?: ViewStyle;
    padding?: PaddingProp;
    refreshControl?: React.ReactElement<RefreshControlProps>;
    variant?: 'default' | 'card';
    gradientColors?: readonly [string, string, ...string[]];
    showBgSection?: boolean;
}

export const ThemedLayout: React.FC<ThemedLayoutProps> = ({ 
    children, 
    contentContainerStyle,
    padding = [40, 40],
    refreshControl,
    variant = 'default',
    gradientColors,
    showBgSection = true,
}) => {
    const themeColors = useThemeColor();
    const [paddingTop, paddingBottom] = Array.isArray(padding) ? padding : [padding, padding];

    if (variant === 'card') {
        return (
            <ThemedSafeAreaView style={styles.container}>
                <LinearGradient
                    colors={gradientColors ?? ([themeColors.backgroundColor, themeColors.backgroundColor] as const)}
                    style={styles.gradient}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                >
                    {showBgSection && <BgSection style={styles.backgroundSvg} />}
                </LinearGradient>
                
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.keyboardAvoidingView}
                >
                    {children}
                </KeyboardAvoidingView>
            </ThemedSafeAreaView>
        );
    }

    return (
        <ThemedSafeAreaView style={styles.container}>
            {showBgSection && <BgSection style={styles.backgroundSvg} />}
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoidingView}
            >
                <ScrollView 
                    contentContainerStyle={[
                        styles.scrollViewContent, 
                        { paddingTop, paddingBottom },
                        contentContainerStyle
                    ]}
                    refreshControl={refreshControl}
                >
                    {children}
                </ScrollView>
            </KeyboardAvoidingView>
        </ThemedSafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    scrollViewContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
    },
    backgroundSvg: {
        position: 'absolute',
        width: '200%',
        height: '200%',
        top: '15%',
        right: '-60%',
    },
    gradient: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: '40%',
    },
});