import React from 'react';
import { KeyboardAvoidingView, ScrollView, Platform, StyleSheet, ViewStyle, RefreshControl, RefreshControlProps } from 'react-native';
import { Edge, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColor } from '../../hooks/useThemeColor';
import { ThemedSafeAreaView } from '../layouts/ThemedSafeAreaView';
import { BgSection } from '../images/BgSection';
import { LinearGradient } from 'expo-linear-gradient';

type PaddingProp = [number, number] | number;

interface ThemedLayoutProps {
    children: React.ReactNode;
    contentContainerStyle?: ViewStyle;
    padding?: PaddingProp;
    scrollRef?: React.Ref<ScrollView>;
    scrollEnabled?: boolean;
    refreshControl?: React.ReactElement<RefreshControlProps>;
    variant?: 'default' | 'card';
    gradientColors?: readonly [string, string, ...string[]];
    showBgSection?: boolean;
    safeAreaEdges?: Edge[];
}

export const ThemedLayout: React.FC<ThemedLayoutProps> = ({ 
    children, 
    contentContainerStyle,
    padding = [40, 40],
    scrollRef,
    scrollEnabled = true,
    refreshControl,
    variant = 'default',
    gradientColors,
    showBgSection = true,
    safeAreaEdges,
}) => {
    const themeColors = useThemeColor();
    const insets = useSafeAreaInsets();
    const [paddingTop, paddingBottom] = Array.isArray(padding) ? padding : [padding, padding];

    if (variant === 'card') {
        return (
            <ThemedSafeAreaView style={styles.container} edges={safeAreaEdges}>
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
        <ThemedSafeAreaView style={styles.container} edges={safeAreaEdges}>
            {showBgSection && <BgSection style={styles.backgroundSvg} />}
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoidingView}
            >
                <ScrollView 
                    ref={scrollRef}
                    scrollEnabled={scrollEnabled}
                    contentContainerStyle={[
                        styles.scrollViewContent, 
                        { paddingTop, paddingBottom: Math.max(paddingBottom, insets.bottom + 24) },
                        contentContainerStyle
                    ]}
                    refreshControl={refreshControl}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="on-drag"
                    nestedScrollEnabled
                    showsVerticalScrollIndicator={false}
                    automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
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
