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

export default function ReferralDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const themeColors = useThemeColor();
  const [referral, setReferral] = useState<Referral | null>(null);
  const [showCoverages, setShowCoverages] = useState(false);

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
        <View style={styles.header}>
          <View style={[styles.avatar, { backgroundColor: getStatusColor(referral.referredStatus as ReferralStatus) }]}>
            <Ionicons name="person-outline" size={24} color={themeColors.white} />
          </View>
          <View style={styles.headerInfo}>
            <ThemedText variant="title">
              {referral.referredPersonalData.name} {referral.referredPersonalData.surname}
            </ThemedText>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(referral.referredStatus as ReferralStatus) }]}>
              <ThemedText style={{ color: getTextColor(referral.referredStatus as ReferralStatus) }}>
                {referral.referredStatus}
              </ThemedText>
            </View>
            <ThemedText variant="paragraph" color={themeColors.textColorAccent}>
              Actualización: {format(new Date(referral.updatedDate), 'dd/MM/yyyy', { locale: es })}
            </ThemedText>
            <ThemedText variant="paragraph" color={themeColors.textColorAccent}>
              Fecha de cotización: {format(new Date(referral.createdDate), 'dd/MM/yyyy', { locale: es })}
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
              onPress={() => setShowCoverages(!showCoverages)}
              showButton={false}
            />
            {showCoverages && (
              <View style={styles.coverages}>
                <ThemedText variant="subTitle">Coberturas incluidas:</ThemedText>
                {/* Aquí irían las coberturas cuando tengamos los datos */}
                <ThemedText>• Cobertura 1</ThemedText>
                <ThemedText>• Cobertura 2</ThemedText>
                <ThemedText>• Cobertura 3</ThemedText>
              </View>
            )}
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
  header: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    gap: 8,
  },
  section: {
    gap: 16,
  },
  statusBadge: {
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderRadius: 3,
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
