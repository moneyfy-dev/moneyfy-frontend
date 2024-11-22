import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedLayout } from '@/components/ThemedLayout';
import { ThemedText } from '@/components/ThemedText';
import { QuoteCard } from '@/components/QuoteCard';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { mockReferrals } from '@/mocks/referrals';
import { Referral, ReferralStatus } from '@/types/referral';

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
      aprovado: themeColors.status.success,
    };
    return colors[status];
  };

  return (
    <ThemedLayout padding={[0, 24]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={themeColors.textColor} />
        </Pressable>
        <ThemedText variant="title">Detalle del Referido</ThemedText>
      </View>

      <View style={styles.content}>
        {/* Estado del referido */}
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(referral.referredStatus as ReferralStatus) }]}>
          <ThemedText style={{ color: themeColors.white }}>
            {referral.referredStatus}
          </ThemedText>
        </View>

        {/* Información del vehículo */}
        <View style={styles.section}>
          <ThemedText variant="subTitle">Vehículo</ThemedText>
          <View style={styles.infoContainer}>
            <ThemedText>Patente: {referral.referredCarData.ppu}</ThemedText>
            <ThemedText>
              {referral.referredCarData.brand} {referral.referredCarData.model} {referral.referredCarData.year}
            </ThemedText>
            {referral.referredCarData.colour && (
              <ThemedText>Color: {referral.referredCarData.colour}</ThemedText>
            )}
          </View>
        </View>

        {/* Información del cliente */}
        <View style={styles.section}>
          <ThemedText variant="subTitle">Cliente</ThemedText>
          <View style={styles.infoContainer}>
            {referral.referredPersonalData.name && (
              <ThemedText>
                Nombre: {referral.referredPersonalData.name} {referral.referredPersonalData.surname}
              </ThemedText>
            )}
            {referral.referredPersonalData.email && (
              <ThemedText>Email: {referral.referredPersonalData.email}</ThemedText>
            )}
            {referral.referredPersonalData.phone && (
              <ThemedText>Teléfono: {referral.referredPersonalData.phone}</ThemedText>
            )}
            {referral.referredPersonalData.purchaserId && (
              <ThemedText>RUT: {referral.referredPersonalData.purchaserId}</ThemedText>
            )}
          </View>
        </View>

        {/* Plan seleccionado (si existe) */}
        {referral.referredPlanData.id && (
          <View style={styles.section}>
            <ThemedText variant="subTitle">Plan Seleccionado</ThemedText>
            <QuoteCard
              plan={referral.referredPlanData}
              onPress={() => {}}
              showButton={false}
            />
          </View>
        )}

        {/* Dirección de inspección (si existe) */}
        {referral.referredAddressData.street && (
          <View style={styles.section}>
            <ThemedText variant="subTitle">Dirección de Inspección</ThemedText>
            <View style={styles.infoContainer}>
              <ThemedText>
                {referral.referredAddressData.street} {referral.referredAddressData.streetNumber}
              </ThemedText>
              {referral.referredAddressData.department && (
                <ThemedText>Depto: {referral.referredAddressData.department}</ThemedText>
              )}
              <ThemedText style={styles.inspectionType}>
                Tipo de inspección: {referral.referredAddressData.inspection}
              </ThemedText>
            </View>
          </View>
        )}

        {/* Fechas importantes */}
        <View style={styles.section}>
          <ThemedText variant="subTitle">Fechas</ThemedText>
          <View style={styles.infoContainer}>
            <ThemedText>
              Creado: {format(new Date(referral.createdDate), 'dd/MM/yyyy HH:mm', { locale: es })}
            </ThemedText>
            <ThemedText>
              Última actualización: {format(new Date(referral.updatedDate), 'dd/MM/yyyy HH:mm', { locale: es })}
            </ThemedText>
            {referral.referredStatus === 'aprovado' && (
              <ThemedText>
                Aprobado: {format(new Date(referral.approvalDate), 'dd/MM/yyyy', { locale: es })}
              </ThemedText>
            )}
          </View>
        </View>
      </View>
    </ThemedLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 16,
  },
  backButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    gap: 24,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  section: {
    gap: 12,
  },
  infoContainer: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    gap: 8,
  },
  inspectionType: {
    marginTop: 8,
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
