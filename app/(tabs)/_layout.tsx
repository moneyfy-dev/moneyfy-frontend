import React from 'react';
import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useThemeColor } from '@/shared/hooks';
import { useOnboarding } from '@/core/context';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const themeColors = useThemeColor();
  const { shouldShowOnboarding } = useOnboarding();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: themeColors.textColorAccent,
        tabBarInactiveTintColor: themeColors.placeholderColor,
        tabBarStyle: {
          backgroundColor: themeColors.backgroundColor,
          height: 88,
          paddingBottom: 20,
          borderTopWidth: 0,
          borderTopColor: themeColors.unfocusedBorderColor,
          display: shouldShowOnboarding ? 'none' : 'flex',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarIconStyle: {
          marginTop: 12,
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="quoters"
        options={{
          title: 'Cotizantes',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="people-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="quote"
        options={{
          title: 'Cotizar',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="calculator-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Configuración',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="settings-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}

function TabBarIcon(props: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  size: number;
}) {
  return (
    <View style={styles.iconContainer}>
      <Ionicons {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    marginBottom: -3,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
