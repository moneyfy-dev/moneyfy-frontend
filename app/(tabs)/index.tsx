import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { User, ROUTES, MonthlyEarnings } from '@/core/types';
import { View, StyleSheet, TouchableOpacity, Image, RefreshControl, useWindowDimensions } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Colors from '@/constants/Colors';
import { useThemeColor } from '@/shared/hooks';
import { ThemedLayout, ThemedText, AvatarIcon, LoadingScreen, Onboarding } from '@/shared/components';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart } from 'react-native-chart-kit';
import { useUser, useOnboarding } from '@/core/context';
import { Ionicons } from '@expo/vector-icons';
import { userService } from '@/core/services';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

const applyCachedEarnings = (
  cached: {
    monthlyEarnings: MonthlyEarnings | null;
  } | null,
  setters: {
    setMonthlyEarnings: React.Dispatch<React.SetStateAction<MonthlyEarnings | null>>;
  },
) => {
  if (!cached) {
    return;
  }

  setters.setMonthlyEarnings(cached.monthlyEarnings);
};

const formatChartAxisAmount = (value: string) => {
  const amount = Number(value);

  if (!Number.isFinite(amount)) {
    return value;
  }

  if (amount >= 1000000) {
    return `${Math.round(amount / 1000000)}M`;
  }

  if (amount >= 1000) {
    return `${Math.round(amount / 1000)}k`;
  }

  return Math.round(amount).toString();
};

export default function HomeScreen() {
  const themeColors = useThemeColor();
  const router = useRouter();
  const { width: windowWidth } = useWindowDimensions();
  const { user, hydrateUserData } = useUser();
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
  const screenWidth = windowWidth;
  const toggleBalance = () => setShowBalance(!showBalance);
  const {
    hasSeenOnboarding,
    shouldShowOnboarding,
    isOnboardingStatusLoaded,
  } = useOnboarding();
  const [refreshing, setRefreshing] = useState(false);
  const [monthlyEarnings, setMonthlyEarnings] = useState<MonthlyEarnings | null>(null);

  const loadEarnings = useCallback(async () => {
    const response = await userService.getMonthlyEarnings();
    const nextMonthlyEarnings = response.data?.monthlyEarnings ?? null;
    setMonthlyEarnings(nextMonthlyEarnings);
    await userService.setCachedDashboardEarnings({
      fetchedAt: Date.now(),
      monthlyEarnings: nextMonthlyEarnings,
    });
  }, []);

  const refreshHomeData = useCallback(async () => {
    await hydrateUserData(true);
    await loadEarnings();
  }, [hydrateUserData, loadEarnings]);

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
    const initializeData = async () => {
      try {
        const cachedEarnings = await userService.getCachedDashboardEarnings();
        applyCachedEarnings(cachedEarnings, {
          setMonthlyEarnings,
        });
      } catch {
      }
    };

    void initializeData();

  }, []);

  useFocusEffect(
    useCallback(() => {
      void refreshHomeData();
    }, [refreshHomeData])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshHomeData();
    } catch {
    } finally {
      setRefreshing(false);
    }
  };

  const chartPoints = [...(monthlyEarnings?.months ?? [])]
    .sort((left, right) => {
      const leftTime = Date.parse(left.month);
      const rightTime = Date.parse(right.month);

      if (!Number.isFinite(leftTime) || !Number.isFinite(rightTime)) {
        return left.month.localeCompare(right.month);
      }

      return leftTime - rightTime;
    })
    .map((item) => ({
      label: (() => {
        try {
          return format(parseISO(item.month), 'MMM', { locale: es }).replace('.', '');
        } catch {
          return item.month.slice(5, 7);
        }
      })(),
      value: item.totalCommission,
    }));

  const chartLabels = chartPoints.length > 0 ? chartPoints.map((item) => item.label) : [''];
  const chartValues = chartPoints.length > 0 ? chartPoints.map((item) => item.value) : [0];
  const monthlyCommissions = (() => {
    const currentMonthKey = format(new Date(), 'yyyy-MM');
    return monthlyEarnings?.months?.find((item) => item.month.startsWith(currentMonthKey))?.totalCommission ?? 0;
  })();
  const headlineAmount = monthlyCommissions;
  const headlineLabel = 'Comisiones de este mes';
  const chartHint = 'Aun no hay comisiones aprobadas este mes.';

  if (!isOnboardingStatusLoaded) {
    return <LoadingScreen />;
  }

  if (shouldShowOnboarding || !hasSeenOnboarding) {
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
          <ThemedText variant="title">Hola, {personalInfo.nombre} {personalInfo.apellido}</ThemedText>
        </View>
        <View style={styles.iconContainer}>
          {/*<Ionicons name="notifications-outline" size={24} color={themeColors.textColor} style={styles.icon} />*/}
          {/*<Ionicons name="help-circle-outline" size={24} color={themeColors.textColor} style={styles.icon} />*/}
        </View>
      </View>

      <View style={styles.balanceContainer}>

        <View>

          <ThemedText variant="paragraph" marginBottom={5}>{headlineLabel}</ThemedText>

          <View style={styles.balanceRow}>
            <ThemedText variant="subTitleBold" marginBottom={3} color={themeColors.textColorAccent}>
              $ {' '}
            </ThemedText>
            <ThemedText variant="superTitle" color={themeColors.textColor}>
              {showBalance ? `${headlineAmount.toLocaleString('es-CL')}` : '******'}
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
            labels: chartLabels,
            datasets: [{ data: chartValues }]
          }}
          width={screenWidth}
          height={200}
          yAxisLabel=""
          yAxisSuffix=""
          formatYLabel={formatChartAxisAmount}
          withVerticalLines={true}
          withHorizontalLines={true}
          withVerticalLabels={true}
          withHorizontalLabels={true}
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
              strokeWidth: 0.5,
              strokeOpacity: 0.25,
            },
            fillShadowGradient: Colors.common.green1,
            fillShadowGradientOpacity: 1,
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 0,
          }}
        />
        {headlineAmount <= 0 && (
          <View style={styles.chartHint}>
            <ThemedText variant="notes" textAlign="center" color={Colors.common.gray1}>
              {chartHint}
            </ThemedText>
          </View>
        )}
      </View>

      <View style={styles.cardContainer}>
        <LinearGradient
          colors={[Colors.common.green2, Colors.common.green4]}
          style={[styles.card, { flex: 1 }]}
        >
          <Ionicons style={{ width: 24, height: 24 }} name="cash-outline" size={24} color={themeColors.white} />
          <View>
            <ThemedText variant="paragraph" style={{ marginBottom: 5 }} color={themeColors.white}>Comisiones{"\n"}aprobadas</ThemedText>
            <ThemedText variant="title" color={Colors.common.green1}>${' '}{showBalance ? `${typedUser.wallet.availableBalance.toLocaleString('es-CL')}` : '******'}</ThemedText>
          </View>
        </LinearGradient>
        <View style={[styles.card, { backgroundColor: themeColors.backgroundCardColor, flex: 1 }]}>
          <Ionicons style={{ width: 24, height: 24 }} name="lock-closed-outline" size={24} color={themeColors.textColor} />
          <View>
            <ThemedText variant="paragraph" style={{ marginBottom: 5 }}>Comisiones{"\n"}pendientes</ThemedText>
            <ThemedText variant="title">${' '}{showBalance ? `${typedUser.wallet.outstandingBalance.toLocaleString('es-CL')}` : '******'}</ThemedText>
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
            <ThemedText variant="title" color={themeColors.white}>Cotizar ahora</ThemedText>
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
          <ThemedText variant="paragraph" style={{ marginTop: 5 }}>Ver próximo pago</ThemedText>
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
    marginHorizontal: -28,
    paddingBottom: 16,
  },
  chartHint: {
    paddingHorizontal: 24,
    paddingBottom: 8,
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

