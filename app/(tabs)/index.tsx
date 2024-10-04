import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { LineChart } from 'react-native-chart-kit';
import { useAuth } from '@/context/AuthContext';

export default function HomeScreen() {
  const themeColors = useThemeColor();
  const { user } = useAuth();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: themeColors.backgroundColor,
      padding: 20,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    greeting: {
      fontSize: 24,
      fontWeight: 'bold',
      color: themeColors.textColor,
    },
    iconContainer: {
      flexDirection: 'row',
    },
    icon: {
      marginLeft: 15,
    },
    balanceContainer: {
      marginBottom: 20,
    },
    balanceLabel: {
      fontSize: 16,
      color: themeColors.textParagraph,
    },
    balance: {
      fontSize: 36,
      fontWeight: 'bold',
      color: themeColors.textColor,
    },
    card: {
      backgroundColor: themeColors.backgroundCardColor,
      borderRadius: 10,
      padding: 15,
      marginBottom: 15,
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: themeColors.textColor,
      marginBottom: 10,
    },
    cardValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: themeColors.textColorAccent,
    },
    button: {
      backgroundColor: themeColors.buttonBackgroundColor,
      borderRadius: 10,
      padding: 15,
      alignItems: 'center',
      marginBottom: 15,
    },
    buttonText: {
      color: themeColors.buttonTextColor,
      fontSize: 16,
      fontWeight: 'bold',
    },
    actionContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    actionButton: {
      flex: 1,
      backgroundColor: themeColors.backgroundCardColor,
      borderRadius: 10,
      padding: 15,
      alignItems: 'center',
      marginHorizontal: 5,
    },
    actionButtonText: {
      color: themeColors.textColor,
      fontSize: 12,
      marginTop: 5,
    },
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hola {user?.userData.name}</Text>
        <View style={styles.iconContainer}>
          <Ionicons name="notifications-outline" size={24} color={themeColors.textColor} style={styles.icon} />
          <Ionicons name="help-circle-outline" size={24} color={themeColors.textColor} style={styles.icon} />
        </View>
      </View>

      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>Tu saldo actual</Text>
        <Text style={styles.balance}>${user?.wallet.totalBalance.toFixed(2)}</Text>
      </View>

      <LineChart
        data={{
          labels: ["Jun", "Jul", "Ago", "Sep", "Oct"],
          datasets: [{ data: [50000, 60000, 40000, 70000, 65000] }]
        }}
        width={350}
        height={200}
        chartConfig={{
          backgroundColor: themeColors.backgroundCardColor,
          backgroundGradientFrom: themeColors.backgroundCardColor,
          backgroundGradientTo: themeColors.backgroundCardColor,
          decimalPlaces: 0,
          color: (opacity = 1) => themeColors.textColorAccent,
          style: { borderRadius: 16 }
        }}
        bezier
        style={{ marginVertical: 8, borderRadius: 16 }}
      />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Saldo Disponible</Text>
        <Text style={styles.cardValue}>${user?.wallet.availableBalance.toFixed(2)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Saldo Retenido</Text>
        <Text style={styles.cardValue}>${user?.wallet.outstandingBalance.toFixed(2)}</Text>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Cotizador de seguros</Text>
      </TouchableOpacity>

      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="people-outline" size={24} color={themeColors.textColor} />
          <Text style={styles.actionButtonText}>Mis referidos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="cash-outline" size={24} color={themeColors.textColor} />
          <Text style={styles.actionButtonText}>Retirar Saldo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="time-outline" size={24} color={themeColors.textColor} />
          <Text style={styles.actionButtonText}>Historial de referidos</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}