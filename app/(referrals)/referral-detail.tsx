import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedLayout } from '@/components/ThemedLayout';
import { ThemedText } from '@/components/ThemedText';
import { QuoteCard } from '@/components/QuoteCard';
import { useThemeColor } from '@/hooks/useThemeColor';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { mockReferrals } from '@/mocks/referrals';
import { Referral, ReferralStatus } from '@/types/referral';
import { VehicleCard } from '@/components/VehicleCard';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { IconContainer } from '@/components/IconContainer';

export default function ReferralDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const themeColors = useThemeColor();
  const [referral, setReferral] = useState<Referral | null>(null);

  useEffect(() => {
    // Simulamos la carga de datos
    const referralData = mockReferrals.find(r => r.referredId === params.id);
    setReferral(referralData || null);
  }, [params.id]);

  if (!referral) {
    return (
      <ThemedLayout>
        <View style={styles.loadingContainer}>
          <ThemedText>Cargando...</ThemedText>
        </View>
      </ThemedLayout>
    );
  }

  const getStatusColor = (status: ReferralStatus) => {
    const colors: Record<ReferralStatus, string> = {
      cotizando: themeColors.status.warning,
      inspeccion: themeColors.status.info,
      aprobado: themeColors.status.success,
      rechazado: themeColors.status.error,
    };
    return colors[status];
  };

  const getTextColor = (status: ReferralStatus) => {
    return status === 'cotizando' ? Colors.common.black : Colors.common.white;
  };

  return (
    <ThemedLayout padding={[0, 24]}>
      <View style={styles.content}>
        {/* Header con avatar y estado */}
        <View style={styles.referralHeader}>
          <IconContainer
            icon="person-outline"
            size={24}
            style={[{ backgroundColor: getStatusColor(referral.referredStatus as ReferralStatus) }]}
          />
          <View style={styles.referralInfo}>

            <View style={styles.nameContainer}>
              <ThemedText variant="subTitleBold">
                {referral.referredPersonalData.name} {referral.referredPersonalData.surname}
              </ThemedText>

              <ThemedText variant="notes">
                Actualización: {format(new Date(referral.updatedDate), 'dd/MM/yyyy')}
              </ThemedText>
            </View>

            <View style={styles.statusContainer}>
              <View style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(referral.referredStatus as ReferralStatus) }
              ]}>
                <ThemedText
                  variant="paragraph"
                  style={{ color: getTextColor(referral.referredStatus as ReferralStatus) }}
                >
                  {referral.referredStatus}
                </ThemedText>
              </View>
            </View>

            <ThemedText variant="notes">
              Cotizado el: {format(new Date(referral.createdDate), 'dd/MM/yyyy')}
            </ThemedText>
          </View>
        </View>

        {/* Información del vehículo */}
        <VehicleCard
          brand={referral.referredCarData.brand}
          model={referral.referredCarData.model}
          ppu={referral.referredCarData.ppu}
          year={referral.referredCarData.year}
          showRightIcon={false}
        />

        {/* Plan seleccionado */}
        {referral.referredPlanData.id && (
          <View style={styles.section}>
            <QuoteCard
              plan={referral.referredPlanData}
              showButton={false}
            />
          </View>
        )}
      </View>
    </ThemedLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 24,
  },
  referralHeader: {
    flexDirection: 'row',
    gap: 10,
  },
  referralInfo: {
    flex: 1,
  },
  nameContainer: {
    maxWidth: '99%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  statusContainer: {
    gap: 10,
    marginBottom: 5,
  },
  section: {
    gap: 16,
  },
  statusBadge: {
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 3,
    alignSelf: 'flex-start',
  },
  carInfo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  coverages: {
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
    gap: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
