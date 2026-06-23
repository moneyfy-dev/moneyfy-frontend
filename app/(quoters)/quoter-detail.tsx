import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Quoter, QuoterStatus, InsurancePlan, ROUTES } from '@/core/types';
import { View, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { useThemeColor } from '@/shared/hooks';
import { ThemedLayout, ThemedText, QuoteCard, VehicleCard, IconContainer, QuoterInfoCard, LoadingScreen, ThemedButton, MessageModal } from '@/shared/components';
import { format } from 'date-fns';
import { useUser, useQuote } from '@/core/context';
import { getQuoteErrorMessage } from '@/shared/utils/quoteErrors';

export default function QuoterDetailScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const themeColors = useThemeColor();
  const [quoter, setQuoter] = useState<Quoter | null>(null);
  const [plan, setPlan] = useState<InsurancePlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [resumeError, setResumeError] = useState('');
  const { user } = useUser();
  const { searchPlanById, hydrateQuoteSession, startQuotationFlow } = useQuote();
  const quoterIdParam = Array.isArray(params.id) ? params.id[0] : params.id;
  const planIdParam = Array.isArray(params.idPlan) ? params.idPlan[0] : params.idPlan;

  useEffect(() => {
    let active = true;

    const loadQuoterData = async () => {
      setHasLoaded(false);
      setQuoter(null);
      setPlan(null);
      setIsLoading(true);

      try {
        let currentQuoter = null;

        if (user?.quoters) {
          currentQuoter = user.quoters.find(r => r.quoterId === quoterIdParam) || null;
          if (active) setQuoter(currentQuoter);
        }

        if (planIdParam && currentQuoter) {
          const response = await searchPlanById(planIdParam);
          const plan = response.data.plans[0];
          const insurer = response.data.insurer;
          const insurancePlan: InsurancePlan = {
            ...plan,
            insurer: insurer,
            discount: currentQuoter.quoterPlanData.discount || 0,
            grossPriceUF: currentQuoter.quoterPlanData.grossPriceUF || 0,
            monthlyPrice: currentQuoter.quoterPlanData.monthlyPrice || 0,
            monthlyPriceUF: currentQuoter.quoterPlanData.monthlyPriceUF || 0,
            totalMonths: currentQuoter.quoterPlanData.totalMonths || 0,
            valueUF: currentQuoter.quoterPlanData.valueUF || 0,
            deductibleDesc: currentQuoter.quoterPlanData.deductibleDesc || plan.deductibleDesc,
          };
          if (active) setPlan(insurancePlan);
        }
      } catch (error) {
        console.error('Error loading quoter data:', error);
      } finally {
        if (active) {
          setIsLoading(false);
          setHasLoaded(true);
        }
      }
    };

    void loadQuoterData();

    return () => {
      active = false;
    };
  }, [planIdParam, quoterIdParam, searchPlanById, user?.quoters]);

  if (!hasLoaded) {
    return (
      <LoadingScreen />
    );
  }

  if (!quoter) {
    return (
      <ThemedLayout padding={[40, 40]}>
        <View style={styles.notFoundContainer}>
          <ThemedText variant="title" textAlign="center">
            Cotización no disponible
          </ThemedText>
          <ThemedText variant="paragraph" textAlign="center">
            Esta cotización ya no existe o no pertenece al usuario actual.
          </ThemedText>
          <ThemedButton text="Volver" onPress={() => router.back()} />
        </View>
      </ThemedLayout>
    );
  }

  const getStatusColor = (status: QuoterStatus) => {
    const colors: Record<QuoterStatus, string> = {
      Iniciando: themeColors.extremeContrastGray,
      Cotizando: themeColors.extremeContrastGray,
      Recopilando: themeColors.status.info,
      Pendiente: themeColors.status.info,
      Aprobado: themeColors.status.success,
      Pagado: themeColors.status.success,
      Conflictivo: themeColors.status.warning,
      Rechazado: themeColors.status.error,
      Caducado: themeColors.status.warning,
    };
    return colors[status];
  };

  const getTextColor = (status: QuoterStatus) => {
    return status === 'Caducado' ? Colors.common.black : Colors.common.white;
  };

  const canResumeQuote =
    quoter.quoterStatus === 'Cotizando'
    || (!!plan && quoter.quoterStatus === 'Recopilando');

  const handleResumeQuote = async () => {
    if (!quoter) {
      return;
    }

    setIsLoading(true);
    try {
      if (quoter.quoterStatus === 'Cotizando') {
        await hydrateQuoteSession({
          vehicle: {
            ...quoter.quoterCarData,
            type: quoter.quoterCarData.type || '',
          },
          plans: [],
          quoterId: quoter.quoterId,
        });

        await startQuotationFlow({
          quoterId: quoter.quoterId,
          ppu: quoter.quoterCarData.ppu,
          brand: quoter.quoterCarData.brand,
          model: quoter.quoterCarData.model,
          year: quoter.quoterCarData.year,
          requestType: 'Auto',
          purchaserId: quoter.quoterPurchaserData.personalId,
          purchaserName: quoter.quoterPurchaserData.name,
          purchaserPaternalSur: quoter.quoterPurchaserData.paternalSurname,
          purchaserMaternalSur: quoter.quoterPurchaserData.maternalSurname,
          purchaserEmail: quoter.quoterPurchaserData.email,
          purchaserPhone: quoter.quoterPurchaserData.phone,
          ownerRelationOption: quoter.quoterPurchaserData.ownerRelationOption,
          colour: quoter.quoterCarData.colour,
          engineNum: quoter.quoterCarData.engineNum,
          chassisNum: quoter.quoterCarData.chassisNum,
        });

        router.push(ROUTES.QUOTE.QUOTE_RESULTS);
        return;
      }

      if (!plan) {
        return;
      }

      await hydrateQuoteSession({
        vehicle: {
          ...quoter.quoterCarData,
          type: quoter.quoterCarData.type || '',
        },
        plans: [plan],
        quoterId: quoter.quoterId,
      });

      router.push({
        pathname: ROUTES.QUOTE.PAYMENT_QR,
        params: { quoterId: quoter.quoterId, planId: plan.planId }
      });
    } catch (error) {
      setResumeError(getQuoteErrorMessage(error, {
        emptyPlansMessage: 'No encontramos planes disponibles para retomar esta cotizacion. Puedes iniciar una nueva cotizacion con los datos actualizados.',
        genericMessage: 'No fue posible retomar esta cotizacion. Intentalo nuevamente en unos minutos.',
        invalidJwtMessage: 'Tu sesion ya no es valida para retomar esta cotizacion. Cierra sesion e ingresa nuevamente.',
      }));
    } finally {
      setIsLoading(false);
    }
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
              {quoter.quoterOwnerData.name ? (
                <ThemedText variant="subTitleBold">
                  <ThemedText variant="subTitleBold" color={themeColors.textColorAccent}>
                    {quoter.quoterOwnerData.name}
                  </ThemedText>
                  {' '} {quoter.quoterOwnerData.paternalSurname}
                </ThemedText>
              ) : (
                <ThemedText variant="subTitleBold">
                  <ThemedText variant="subTitleBold" color={themeColors.textColorAccent}>
                    {quoter.quoterCarData.brand}
                  </ThemedText>
                  {' '} {quoter.quoterCarData.model}
                </ThemedText>
              )}

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

              {quoter.quoterOwnerData.personalId && (
                <>
                  <ThemedText variant='paragraph'>|</ThemedText>

                  <View style={styles.carInfo}>
                    <ThemedText variant="paragraphBold">
                      RUT:
                    </ThemedText>
                    <ThemedText variant="paragraph">
                      {quoter.quoterOwnerData.personalId}
                    </ThemedText>
                  </View>
                </>
              )}
            </View>

            <ThemedText variant="notes">
              Cotizado el: {format(new Date(quoter.createdDate), 'dd/MM/yyyy')}
            </ThemedText>

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
          quoter.quoterPlanData.planName &&
          plan && (
            <QuoteCard
              plan={plan}
              showButton={false}
            />
          )}

        {/* Información adicional */}
        <QuoterInfoCard
          personalData={quoter.quoterOwnerData}
          addressData={quoter.quoterAddressData}
        />

        {canResumeQuote && (
          <ThemedButton
            text={
              quoter.quoterStatus === 'Cotizando'
                  ? 'Continuar cotizacion'
                  : 'Continuar compra'
            }
            onPress={handleResumeQuote}
            style={styles.resumeButton}
          />
        )}
      </View>
      {isLoading && <LoadingScreen />}
      <MessageModal
        isVisible={!!resumeError}
        onClose={() => setResumeError('')}
        title="No se pudo continuar"
        message={resumeError}
        icon={{
          name: 'alert-circle-outline',
          color: themeColors.status.warning,
        }}
        primaryButton={{
          text: 'Entendido',
          onPress: () => setResumeError(''),
        }}
      />
    </ThemedLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 12,
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
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 5,
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
  resumeButton: {
    marginTop: 12,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 24,
  },
});
