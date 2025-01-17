import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../ui/ThemedText';
import { useThemeColor } from '../../hooks/useThemeColor';
import { useRouter } from 'expo-router';

interface ThemedHeaderProps {
    title: string;
    subtitle?: string;
    showBackButton?: boolean;
}

export function ThemedHeader({ title, subtitle, showBackButton = true }: ThemedHeaderProps) {
    const themeColors = useThemeColor();
    const router = useRouter();

    return (
        <SafeAreaView edges={['top']} style={{ backgroundColor: themeColors.backgroundColor }}>
            <View style={[styles.header, { backgroundColor: themeColors.backgroundColor }]}>
                {showBackButton && (
                    <TouchableOpacity onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={24} color={themeColors.accentInDarkMode} />
                    </TouchableOpacity>
                )}
                <View style={styles.titleContainer}>
                    <ThemedText variant="title" textAlign="center" marginBottom={4}>{title}</ThemedText>
                    {subtitle && <ThemedText variant="paragraph" textAlign="center">{subtitle}</ThemedText>}
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingVertical: 20,
    },
    titleContainer: {
        paddingRight: 24,
        marginHorizontal: 'auto',
        flexDirection: 'column',
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 12,
    },
});