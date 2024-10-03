import React from 'react';
import { KeyboardAvoidingView, ScrollView, Platform, StyleSheet, ViewStyle } from 'react-native';
import { ThemedSafeAreaView } from './ThemedSafeAreaView';

type PaddingProp = [number, number] | number;

interface ThemedLayoutProps {
    children: React.ReactNode;
    contentContainerStyle?: ViewStyle;
    padding?: PaddingProp;
}

export const ThemedLayout: React.FC<ThemedLayoutProps> = ({ 
    children, 
    contentContainerStyle,
    padding = [40, 40] // Valor por defecto
}) => {
    const [paddingTop, paddingBottom] = Array.isArray(padding) ? padding : [padding, padding];

    return (
        <ThemedSafeAreaView style={styles.container}>
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
});