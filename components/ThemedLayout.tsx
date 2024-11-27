import React from 'react';
import { KeyboardAvoidingView, ScrollView, Platform, StyleSheet, ViewStyle, RefreshControl, RefreshControlProps } from 'react-native';
import { ThemedSafeAreaView } from './ThemedSafeAreaView';
import { BgSection } from './images/BgSection';

type PaddingProp = [number, number] | number;

interface ThemedLayoutProps {
    children: React.ReactNode;
    contentContainerStyle?: ViewStyle;
    padding?: PaddingProp;
    refreshControl?: React.ReactElement<RefreshControlProps>;
}

export const ThemedLayout: React.FC<ThemedLayoutProps> = ({ 
    children, 
    contentContainerStyle,
    padding = [40, 40],
    refreshControl
}) => {
    const [paddingTop, paddingBottom] = Array.isArray(padding) ? padding : [padding, padding];

    return (
        <ThemedSafeAreaView style={styles.container}>
            <BgSection 
                style={styles.backgroundSvg}
            />
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
        width: '100%',
        height: '100%',
        top: '50%',
        transform: [{ translateY: -50 }],
    },
});