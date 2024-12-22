import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeColor } from '@/shared/hooks';
import Colors from '@/constants/Colors';
import { ThemedText } from '../ui/ThemedText';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

type TabItem = {
    type: string;
    label: string;
    title: string;
    icon: string;
};

interface TabSelectorProps {
    tabs: TabItem[];
    activeTab: string;
    onTabChange: (type: string) => void;
}

export function TabSelector({ tabs, activeTab, onTabChange }: TabSelectorProps) {
    const themeColors = useThemeColor();

    return (
        <View style={styles.tabContainer}>
            {tabs.map((tab) => (
                <TouchableOpacity
                    key={tab.type}
                    style={styles.tabButton}
                    onPress={() => onTabChange(tab.type)}
                >
                    {activeTab === tab.type ? (
                        <LinearGradient
                            colors={[Colors.common.green1, Colors.common.green3]}
                            style={styles.tabButtonGradient}
                        >
                            <View style={[styles.tabIcon, { backgroundColor: Colors.common.white25 }]}>
                                <Ionicons name={tab.icon as any} size={20} color={themeColors.white} />
                            </View>
                            <View>
                                <ThemedText variant="notes" color={themeColors.white}>{tab.label}</ThemedText>
                                <ThemedText variant="subTitleBold" color={themeColors.white}>{tab.title}</ThemedText>
                            </View>
                        </LinearGradient>
                    ) : (
                        <View style={[styles.tabButtonContent, { backgroundColor: themeColors.extremeContrastGray }]}>
                            <View style={[styles.tabIcon, { backgroundColor: Colors.common.green2 }]}>
                                <Ionicons name={tab.icon as any} size={20} color={Colors.common.white} />
                            </View>
                            <View>
                                <ThemedText variant="notes">{tab.label}</ThemedText>
                                <ThemedText variant="subTitleBold" color={themeColors.textColor}>{tab.title}</ThemedText>
                            </View>
                        </View>
                    )}
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 24,
    },
    tabButton: {
        flex: 1,
    },
    tabButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        gap: 12,
    },
    tabButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        gap: 12,
    },
    tabIcon: {
        borderRadius: 8,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
}); 