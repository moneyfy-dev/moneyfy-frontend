import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { LineChart } from 'react-native-chart-kit';
import { useAuth } from '@/context/AuthContext';
import { ThemedText } from '@/components/ThemedText';
import { ThemedLayout } from '@/components/ThemedLayout';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen() {
  const themeColors = useThemeColor();
  const { user } = useAuth();
  const [showBalance, setShowBalance] = useState(true);

  const toggleBalance = () => setShowBalance(!showBalance);

  const styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
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
    balanceRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    eyeIcon: {
      marginLeft: 10,
    },
    chartContainer: {
      marginVertical: 20,
      borderRadius: 16,
      overflow: 'hidden',
    },
    cardContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    card: {
      flex: 1,
      borderRadius: 10,
      padding: 15,
      marginHorizontal: 5,
    },
    button: {
      borderRadius: 10,
      padding: 15,
      alignItems: 'center',
      marginBottom: 20,
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
  });

  if (!user) {
    return (
      <ThemedLayout>
        <ThemedText variant="title">Cargando información del usuario...</ThemedText>
      </ThemedLayout>
    );
  }

  return (
    <ThemedLayout>
      <ScrollView>
        <View style={styles.header}>
          <ThemedText variant="title">Hola {user.personalData.name}</ThemedText>
          <View style={styles.iconContainer}>
            <Ionicons name="notifications-outline" size={24} color={themeColors.textColor} style={styles.icon} />
            <Ionicons name="help-circle-outline" size={24} color={themeColors.textColor} style={styles.icon} />
          </View>
        </View>

        <View style={styles.balanceContainer}>
          <ThemedText variant="paragraph">Tu saldo actual</ThemedText>
          <View style={styles.balanceRow}>
            <ThemedText variant="jumboTitle" color={themeColors.textColorAccent}>
              {showBalance ? `$${user.wallet.totalBalance.toFixed(2)}` : '******'}
            </ThemedText>
            <TouchableOpacity onPress={toggleBalance} style={styles.eyeIcon}>
              <Ionicons name={showBalance ? "eye-outline" : "eye-off-outline"} size={24} color={themeColors.textColorAccent} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.chartContainer}>
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
            style={{ borderRadius: 16 }}
          />
        </View>

        <View style={styles.cardContainer}>
          <LinearGradient
            colors={[themeColors.buttonBackgroundColor, themeColors.buttonBackgroundColor]}
            style={[styles.card, { flex: 2 }]}
          >
            <ThemedText variant="paragraph" color={themeColors.white}>Saldo Disponible</ThemedText>
            <ThemedText variant="superTitle" color={themeColors.white}>${user?.wallet.availableBalance.toFixed(2)}</ThemedText>
          </LinearGradient>
          <View style={[styles.card, { backgroundColor: themeColors.backgroundCardColor }]}>
            <ThemedText variant="paragraph">Saldo Retenido</ThemedText>
            <ThemedText variant="title">${user?.wallet.outstandingBalance.toFixed(2)}</ThemedText>
          </View>
        </View>

        <LinearGradient
          colors={[themeColors.buttonBackgroundColor, themeColors.buttonBackgroundColor]}
          style={styles.button}
        >
          <ThemedText variant="subTitleBold" color={themeColors.white}>Cotizador de seguros</ThemedText>
        </LinearGradient>

        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="people-outline" size={24} color={themeColors.textColorAccent} />
            <ThemedText variant="paragraph" style={{ marginTop: 5 }}>Mis referidos</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="cash-outline" size={24} color={themeColors.textColorAccent} />
            <ThemedText variant="paragraph" style={{ marginTop: 5 }}>Retirar Saldo</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="time-outline" size={24} color={themeColors.textColorAccent} />
            <ThemedText variant="paragraph" style={{ marginTop: 5 }}>Historial de referidos</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedLayout>
  );
}
