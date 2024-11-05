import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { StyleSheet, View } from 'react-native';

export default function TabLayout() {
  const themeColors = useThemeColor();

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
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 'semibold',
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
        name="referidos"
        options={{
          title: 'Referidos',
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
            <TabBarIcon name="time-outline" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="config"
        options={{
          title: 'Config',
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
