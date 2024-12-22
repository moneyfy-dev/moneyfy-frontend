import React from 'react';
import { KeyboardAvoidingView, ScrollView, Platform, StyleSheet, ViewStyle, View } from 'react-native';
import { ThemedSafeAreaView } from '../layouts/ThemedSafeAreaView';
import { BgSection } from '../images/BgSection';

type PaddingProp = [number, number] | number;

interface ThemedLayoutProps {
    children: React.ReactNode;
    contentContainerStyle?: ViewStyle;
    padding?: PaddingProp;
}

export const ThemedLayoutFlatList: React.FC<ThemedLayoutProps> = ({ 
    children, 
    contentContainerStyle,
    padding = [40, 40] // Valor por defecto
}) => {
    const [paddingVertical, paddingHorizontal] = Array.isArray(padding) ? padding : [padding, padding];

    return (
        <ThemedSafeAreaView style={styles.container}>
            <BgSection style={styles.backgroundSvg} />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardAvoidingView}
            >
                <View
                    style={[
                        styles.scrollViewContent, 
                        { paddingVertical, paddingHorizontal },
                        contentContainerStyle
                    ]}
                >
                    {children}
                </View>
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
    },
    backgroundSvg: {
        position: 'absolute',
        width: '200%',
        height: '200%',
        top: '15%',
        right: '-60%',
    },
});