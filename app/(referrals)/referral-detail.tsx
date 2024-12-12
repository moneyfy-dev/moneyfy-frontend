import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedLayout } from '@/components/ThemedLayout';
import { ThemedText } from '@/components/ThemedText';
import { QuoteCard } from '@/components/QuoteCard';
import { useThemeColor } from '@/hooks/useThemeColor';
import { format } from 'date-fns';
import { Referral, ReferralStatus } from '@/types/referral';
import { VehicleCard } from '@/components/VehicleCard';
import { IconContainer } from '@/components/IconContainer';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';
import { InsurancePlan } from '@/types/quote';
import { ReferralInfoCard } from '@/components/ReferralInfoCard';
import { LoadingScreen } from '@/components/LoadingScreen';

export default function ReferralDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const themeColors = useThemeColor();
  const [referral, setReferral] = useState<Referral | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user, hydrateUserData } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const loadReferralData = async () => {
      setIsLoading(true);
      try {
        await hydrateUserData(true);
        if (isMounted && user?.referredPeople) {
          const referralData = user.referredPeople.find(r => r.referredId === params.id);
          setReferral(referralData || null);
          console.log('referralData', referralData?.referredPlanData);
        }
      } catch (error) {
        console.error('Error loading referral data:', error);
      }
    };

    loadReferralData();
    setIsLoading(false);
    return () => {
      isMounted = false;
    };
  }, [params.id]);

  if (!referral) {
    return (
      <LoadingScreen />
    );
  }

  const getStatusColor = (status: ReferralStatus) => {
    const colors: Record<ReferralStatus, string> = {
      'Iniciando': themeColors.green4to5,
      'Cotizando': themeColors.green3to4,
      'Recopilando': themeColors.green2to3,
      'Pendiente': themeColors.status.info,
      'Aprobado': themeColors.status.success,
      'Rechazado': themeColors.status.error,
      'Caducado': themeColors.status.warning,
    };
    return colors[status];
  };

  const getTextColor = (status: ReferralStatus) => {
    return status === 'Caducado' ? Colors.common.black : Colors.common.white;
  };

  const mapToPlanFormat = (referredPlan: typeof referral.referredPlanData): InsurancePlan => {
    return {
      planId: referredPlan.referredPlanId || '',
      planName: referredPlan.planName || '',
      insuranceCompany: referredPlan.insuranceCompany || '',
      deductible: referredPlan.deductible || 0,
      price: referredPlan.price || 0,
      priceUf: referredPlan.priceUf || 0,
      discount: referredPlan.discount as unknown as number || 0,
      stolenVehicle: referredPlan.stolenVehicle || '',
      workshopType: referredPlan.workshopType || '',
      totalLoss: referredPlan.totalLoss || '',
      damageThirdParty: referredPlan.damageThirdParty || '',
      details: referredPlan.details || [],
      createdDate: referredPlan.createdDate || '',
      updatedDate: referredPlan.updatedDate || '',
    };
  };

  return (
    <ThemedLayout padding={[0, 24]}>
      <View style={styles.content}>
        {/* Header con avatar y estado */}
        <View style={styles.referralHeader}>
          <IconContainer
            icon="person-outline"
            size={24}
            style={[{ backgroundColor: getStatusColor(referral.referredStatus) }]}
          />
          <View style={styles.referralInfo}>
            <View style={styles.nameContainer}>
              <ThemedText variant="subTitleBold">
                {referral.referredCarData.brand || 'Sin marca'} {' '}
                {referral.referredCarData.model || 'registrado'}
              </ThemedText>

              <ThemedText variant="notes">
                Actualización: {format(new Date(referral.updatedDate), 'dd/MM/yyyy')}
              </ThemedText>
            </View>

            <View style={styles.statusContainer}>
              <View style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(referral.referredStatus) }
              ]}>
                <ThemedText
                  variant="paragraph"
                  style={{ color: getTextColor(referral.referredStatus) }}
                >
                  {referral.referredStatus}
                </ThemedText>
              </View>
            </View>

            <ThemedText variant="notes">
              Cotizado el: {format(new Date(referral.createdDate), 'dd/MM/yyyy')}
            </ThemedText>

            {referral.referredPersonalData.purchaserId && (
              <ThemedText variant="notes">
                RUT: {referral.referredPersonalData.purchaserId}
              </ThemedText>
            )}
          </View>
        </View>

        {/* Información del vehículo */}
        <VehicleCard
          brand={referral.referredCarData.brand}
          model={referral.referredCarData.model}
          ppu={referral.referredCarData.ppu}
          year={referral.referredCarData.year}
          isSelected={true}
        />

        {/* Plan seleccionado */}
        {referral.referredPlanData && 
         referral.referredPlanData.planName && (
          <View style={styles.section}>
            <QuoteCard
              plan={mapToPlanFormat(referral.referredPlanData)}
              showButton={false}
            />
          </View>
        )}

        {/* Información adicional */}
        <ReferralInfoCard
          personalData={referral.referredPersonalData}
          addressData={referral.referredAddressData}
        />
      </View>
      {isLoading && <LoadingScreen />}
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
