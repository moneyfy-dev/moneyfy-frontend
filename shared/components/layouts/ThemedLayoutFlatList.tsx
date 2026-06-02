import React from 'react';
import { StyleSheet, ViewStyle, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
    const insets = useSafeAreaInsets();
    const [paddingVertical, paddingHorizontal] = Array.isArray(padding) ? padding : [padding, padding];

    return (
        <ThemedSafeAreaView style={styles.container}>
            <BgSection style={styles.backgroundSvg} />
            <View
                style={[
                    styles.content,
                    {
                        paddingTop: paddingVertical,
                        paddingBottom: Math.max(paddingVertical, insets.bottom + 24),
                        paddingHorizontal,
                    },
                    contentContainerStyle
                ]}
            >
                {children}
            </View>
        </ThemedSafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    backgroundSvg: {
        position: 'absolute',
        width: '200%',
        height: '200%',
        top: '15%',
        right: '-60%',
    },
});
