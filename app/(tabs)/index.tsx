import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { User, ROUTES } from '@/core/types';
import { View, StyleSheet, TouchableOpacity, Image, Dimensions, RefreshControl } from 'react-native';
import Colors from '@/constants/Colors';
import { useThemeColor } from '@/shared/hooks';
import { ThemedLayout, ThemedText, AvatarIcon, LoadingScreen, Onboarding } from '@/shared/components';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart } from 'react-native-chart-kit';
import { useUser, useOnboarding } from '@/core/context';
import { Ionicons } from '@expo/vector-icons';

const FORCE_SHOW_ONBOARDING = true; // Mantenemos esto para desarrollo

export default function HomeScreen() {
  const themeColors = useThemeColor();
  const router = useRouter();
  const { user, hydrateUserData } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const typedUser = user as User;
  const [showBalance, setShowBalance] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    direccion: '',
    fechaNacimiento: new Date(),
    profilePicture: '',
  });
  const screenWidth = Dimensions.get("window").width;
  const toggleBalance = () => setShowBalance(!showBalance);
  const { shouldShowOnboarding, setShouldShowOnboarding } = useOnboarding();
  const route = useLocalSearchParams();
  const { fromConfirmation } = route;
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      setPersonalInfo({
        nombre: user.personalData.name || '',
        apellido: user.personalData.surname || '',
        telefono: user.personalData.phone || '',
        direccion: user.personalData.address || '',
        fechaNacimiento: user.personalData.dateOfBirth ? new Date(user.personalData.dateOfBirth) : new Date(),
        profilePicture: user.personalData.profilePicture ? `data:image/jpeg;base64,${user.personalData.profilePicture}` : '',
      });
    }
  }, [user]);

  useEffect(() => {
    if (FORCE_SHOW_ONBOARDING || fromConfirmation === 'true') {
      setShouldShowOnboarding(true);
    }
  }, []);

  const onRefresh = async () => {
    console.log('🔄 Iniciando refresh manual');
    setRefreshing(true);
    try {
      await hydrateUserData(true);
      console.log('✅ Refresh completado exitosamente');
    } catch (error) {
      console.error('❌ Error en refresh:', error);
    } finally {
      setRefreshing(false);
    }
  };

  if (shouldShowOnboarding) {
    return <Onboarding />;
  }

  if (!user) {
    return (
      <LoadingScreen />
    );
  }

  return (
    <ThemedLayout
      padding={[24, 24]}
      showBgSection={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={themeColors.textColorAccent}
          colors={[themeColors.textColorAccent]}
          progressBackgroundColor={themeColors.backgroundCardColor}
          style={{ backgroundColor: themeColors.backgroundCardColor }}
        />
      }
    >
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          {personalInfo.profilePicture ? (
            <Image source={{ uri: personalInfo.profilePicture }} style={styles.profileImage} />
          ) : (
            <AvatarIcon width={40} height={40} style={styles.profileImage} />
          )}
          <ThemedText variant="title">¡Hola {personalInfo.nombre} {personalInfo.apellido}!</ThemedText>
        </View>
        <View style={styles.iconContainer}>
          <Ionicons name="notifications-outline" size={24} color={themeColors.textColor} style={styles.icon} />
          <Ionicons name="help-circle-outline" size={24} color={themeColors.textColor} style={styles.icon} />
        </View>
      </View>

      <View style={styles.balanceContainer}>

        <View>

          <ThemedText variant="paragraph" marginBottom={5}>Tu saldo actual</ThemedText>

          <View style={styles.balanceRow}>
            <ThemedText variant="subTitleBold" marginBottom={3} color={themeColors.textColorAccent}>
              $ {' '}
            </ThemedText>
            <ThemedText variant="superTitle" color={themeColors.textColor}>
              {showBalance ? `${typedUser.wallet.totalBalance.toFixed(0)}` : '******'}
            </ThemedText>
          </View>

        </View>

        <TouchableOpacity onPress={toggleBalance} style={[styles.eyeIconButton, { backgroundColor: themeColors.extremeContrastGray }]}>
          <Ionicons name={showBalance ? "eye-outline" : "eye-off-outline"} size={20} color={themeColors.textColorAccent} />
        </TouchableOpacity>
      </View>

      <View style={styles.chartContainer}>
        <LineChart
          data={{
            labels: ["Jun", "Jul", "Ago", "Sep", "Oct"],
            datasets: [{ data: [70000, 60000, 80000, 70000, 65000] }]
          }}
          width={screenWidth + 70} // Ajusta según tus necesidades
          height={200}
          yAxisLabel=""
          yAxisSuffix=""
          withVerticalLines={true}
          withHorizontalLines={false}
          withVerticalLabels={true}
          withHorizontalLabels={false}
          withInnerLines={true}
          withOuterLines={false}
          chartConfig={{
            backgroundColor: themeColors.backgroundColor,
            backgroundGradientFrom: themeColors.backgroundColor,
            backgroundGradientTo: themeColors.backgroundColor,
            decimalPlaces: 0,
            color: (opacity = 1) => Colors.common.green1,
            labelColor: (opacity = 1) => Colors.common.gray1,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: "4",
              strokeWidth: "0",
            },
            propsForBackgroundLines: {
              stroke: Colors.common.gray1,
              strokeWidth: 1
            },
            fillShadowGradient: Colors.common.green1,
            fillShadowGradientOpacity: 1,
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 0,
            marginLeft: -50
          }}
        />
      </View>

      <View style={styles.cardContainer}>
        <LinearGradient
          colors={[Colors.common.green2, Colors.common.green4]}
          style={[styles.card, { flex: 1 }]}
        >
          <Ionicons style={{ width: 24, height: 24 }} name="cash-outline" size={24} color={themeColors.white} />
          <View>
            <ThemedText variant="paragraph" color={themeColors.white}>Saldo Disponible</ThemedText>
            <ThemedText variant="title" color={themeColors.textColorAccent}>${' '}{showBalance ? `${typedUser.wallet.availableBalance.toFixed(0)}` : '******'}</ThemedText>
          </View>
        </LinearGradient>
        <View style={[styles.card, { backgroundColor: themeColors.backgroundCardColor, flex: 1 }]}>
          <Ionicons style={{ width: 24, height: 24 }} name="lock-closed-outline" size={24} color={themeColors.textColor} />
          <View>
            <ThemedText variant="paragraph">Saldo Retenido</ThemedText>
            <ThemedText variant="title">${' '}{showBalance ? `${typedUser.wallet.outstandingBalance.toFixed(0)}` : '******'}</ThemedText>
          </View>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => router.push(ROUTES.TABS.QUOTE)}
      >
        <LinearGradient
          colors={[Colors.common.green2, Colors.common.green4]}
          style={styles.quoteButton}
        >
          <View style={styles.quoteIcon}>
            <Ionicons name="receipt-outline" size={20} color={themeColors.white} />
          </View>
          <View>
            <ThemedText variant="paragraph" color={themeColors.white}>Cotizador de seguros</ThemedText>
            <ThemedText variant="title" color={themeColors.white}>Cotizar Ahora!</ThemedText>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.actionContainer}>

        <TouchableOpacity
          onPress={() => router.push(ROUTES.TABS.QUOTERS)}
          style={[styles.actionButton, { backgroundColor: themeColors.extremeContrastGray }]}>
          <View style={styles.actionButtonIcon}>
            <Ionicons name="people-outline" size={20} color={themeColors.white} />
          </View>
          <ThemedText variant="paragraph" style={{ marginTop: 5 }}>Cotizantes</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push(ROUTES.WALLET.WITHDRAWAL)}
          style={[styles.actionButton, { backgroundColor: themeColors.extremeContrastGray }]}>
          <View style={styles.actionButtonIcon}>
            <Ionicons name="cash-outline" size={20} color={themeColors.white} />
          </View>
          <ThemedText variant="paragraph" style={{ marginTop: 5 }}>Ver pago</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push(ROUTES.WALLET.HISTORY)}
          style={[styles.actionButton, { backgroundColor: themeColors.extremeContrastGray }]}>
          <View style={styles.actionButtonIcon}>
            <Ionicons name="time-outline" size={20} color={themeColors.white} />
          </View>
          <ThemedText variant="paragraph" style={{ marginTop: 5 }}>Historial de pagos</ThemedText>
        </TouchableOpacity>

      </View>
      {isLoading && <LoadingScreen />}
    </ThemedLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  iconContainer: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 15,
  },
  balanceContainer: {
    marginBottom: 24,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  eyeIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartContainer: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 16,
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  button: {
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  quoteButton: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
  },
  quoteIcon: {
    backgroundColor: Colors.common.white25,
    borderRadius: 8,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    borderRadius: 16,
    padding: 15,
    alignItems: 'flex-start',
    marginHorizontal: 5,
  },
  actionButtonIcon: {
    backgroundColor: Colors.common.green2,
    borderRadius: 8,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 32,
    height: 32,
  },
});
