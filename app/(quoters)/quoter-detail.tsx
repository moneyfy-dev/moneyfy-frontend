import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedLayout } from '@/shared/components/layouts/ThemedLayout';
import { ThemedText } from '@/shared/components/ui/ThemedText';
import { QuoteCard } from '@/shared/components/composite/QuoteCard';
import { useThemeColor } from '@/shared/hooks/useThemeColor';
import { format } from 'date-fns';
import { Quoter, QuoterStatus } from '@/core/types/quoter';
import { VehicleCard } from '@/shared/components/composite/VehicleCard';
import { IconContainer } from '@/shared/components/ui/IconContainer';
import { useAuth } from '@/core/context/AuthContext';
import Colors from '@/constants/Colors';
import { InsurancePlan } from '@/core/types/quote';
import { QuoterInfoCard } from '@/shared/components/composite/QuoterInfoCard';
import { LoadingScreen } from '@/shared/components/animations/LoadingScreen';

export default function QuoterDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const themeColors = useThemeColor();
  const [quoter, setQuoter] = useState<Quoter | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user, hydrateUserData } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const loadQuoterData = async () => {
      setIsLoading(true);
      try {
        await hydrateUserData(true);
        if (isMounted && user?.quoterPeople) {
          const quoterData = user.quoterPeople.find(r => r.quoterId === params.id);
          setQuoter(quoterData || null);
          console.log('quoterData', quoterData?.quoterPlanData);
        }
      } catch (error) {
        console.error('Error loading quoter data:', error);
      }
    };

    loadQuoterData();
    setIsLoading(false);
    return () => {
      isMounted = false;
    };
  }, [params.id]);

  if (!quoter) {
    return (
      <LoadingScreen />
    );
  }

  const getStatusColor = (status: QuoterStatus) => {
    const colors: Record<QuoterStatus, string> = {
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

  const getTextColor = (status: QuoterStatus) => {
    return status === 'Caducado' ? Colors.common.black : Colors.common.white;
  };

  const mapToPlanFormat = (quoterPlan: typeof quoter.quoterPlanData): InsurancePlan => {
    return {
      planId: quoterPlan.quoterPlanId || '',
      planName: quoterPlan.planName || '',
      insuranceCompany: quoterPlan.insuranceCompany || '',
      deductible: quoterPlan.deductible || 0,
      price: quoterPlan.price || 0,
      priceUf: quoterPlan.priceUf || 0,
      discount: quoterPlan.discount as unknown as number || 0,
      stolenVehicle: quoterPlan.stolenVehicle || '',
      workshopType: quoterPlan.workshopType || '',
      totalLoss: quoterPlan.totalLoss || '',
      damageThirdParty: quoterPlan.damageThirdParty || '',
      details: quoterPlan.details || [],
      createdDate: quoterPlan.createdDate || '',
      updatedDate: quoterPlan.updatedDate || '',
    };
  };

  return (
    <ThemedLayout padding={[0, 24]}>
      <View style={styles.content}>
        {/* Header con avatar y estado */}
        <View style={styles.quoterHeader}>
          <IconContainer
            icon="person-outline"
            size={24}
            style={[{ backgroundColor: getStatusColor(quoter.quoterStatus) }]}
          />
          <View style={styles.quoterInfo}>
            <View style={styles.nameContainer}>
              <ThemedText variant="subTitleBold">
                {quoter.quoterCarData.brand || 'Sin marca'} {' '}
                {quoter.quoterCarData.model || 'registrado'}
              </ThemedText>

              <ThemedText variant="notes">
                Actualización: {format(new Date(quoter.updatedDate), 'dd/MM/yyyy')}
              </ThemedText>
            </View>

            <View style={styles.statusContainer}>
              <View style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(quoter.quoterStatus) }
              ]}>
                <ThemedText
                  variant="paragraph"
                  style={{ color: getTextColor(quoter.quoterStatus) }}
                >
                  {quoter.quoterStatus}
                </ThemedText>
              </View>
            </View>

            <ThemedText variant="notes">
              Cotizado el: {format(new Date(quoter.createdDate), 'dd/MM/yyyy')}
            </ThemedText>

            {quoter.quoterPersonalData.purchaserId && (
              <ThemedText variant="notes">
                RUT: {quoter.quoterPersonalData.purchaserId}
              </ThemedText>
            )}
          </View>
        </View>

        {/* Información del vehículo */}
        <VehicleCard
          brand={quoter.quoterCarData.brand}
          model={quoter.quoterCarData.model}
          ppu={quoter.quoterCarData.ppu}
          year={quoter.quoterCarData.year}
          isSelected={true}
        />

        {/* Plan seleccionado */}
        {quoter.quoterPlanData && 
            quoter.quoterPlanData.planName && (
          <View style={styles.section}>
            <QuoteCard
              plan={mapToPlanFormat(quoter.quoterPlanData)}
              showButton={false}
            />
          </View>
        )}

        {/* Información adicional */}
        <QuoterInfoCard
          personalData={quoter.quoterPersonalData}
          addressData={quoter.quoterAddressData}
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
  quoterHeader: {
    flexDirection: 'row',
    gap: 10,
  },
  quoterInfo: {
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
