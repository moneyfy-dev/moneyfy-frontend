import React, { useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    LoadingScreen,
    Logo,
    LottieAnimation,
    MessageModal,
    QuoteCard,
    ThemedButton,
    ThemedLayout,
    ThemedText,
    TicketEdge,
    VehicleCard,
} from '@/shared/components';
import { useQuote } from '@/core/context';
import { ROUTES } from '@/core/types';
import { useMessageConfig, useThemeColor } from '@/shared/hooks';

export default function PaymentQRScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const themeColors = useThemeColor();
    const { planId, planIndex } = useLocalSearchParams();
    const {
        vehicle,
        plans,
        quoterId,
        ownerDataDraft,
        isLoading,
        generateTransaction,
        clearQuoteData,
    } = useQuote();
    const submissionRef = useRef(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isTransactionComplete, setIsTransactionComplete] = useState(false);
    const [transactionError, setTransactionError] = useState('');

    const planIdValue = Array.isArray(planId) ? planId[0] : planId;
    const planIndexValue = Array.isArray(planIndex) ? planIndex[0] : planIndex;
    const parsedPlanIndex = Number(planIndexValue);
    const selectedPlan = Number.isInteger(parsedPlanIndex) && plans[parsedPlanIndex]
        ? plans[parsedPlanIndex]
        : plans.find((plan) => plan.planId === planIdValue);
    const ownerFullName = [
        ownerDataDraft.ownerName,
        ownerDataDraft.ownerPaternalSur,
        ownerDataDraft.ownerMaternalSur,
    ].filter(Boolean).join(' ');

    useMessageConfig(['/quoter/generate/transaction']);

    const handleGoToIndex = () => {
        router.replace(ROUTES.TABS.INDEX);
    };

    const handleTransactionFlow = async () => {
        if (submissionRef.current || !quoterId || !selectedPlan) return;

        submissionRef.current = true;
        setIsSubmitting(true);
        setTransactionError('');

        try {
            await generateTransaction({ quoterId });
            setIsTransactionComplete(true);
            await clearQuoteData();
        } catch {
            setTransactionError(
                'No fue posible enviar la cotizacion. Revisa tu conexion e intentalo nuevamente.',
            );
        } finally {
            submissionRef.current = false;
            setIsSubmitting(false);
        }
    };

    if (isTransactionComplete) {
        return (
            <ThemedLayout padding={[40, Math.max(40, insets.bottom + 24)]}>
                <View style={styles.successContainer}>
                    <LottieAnimation style={styles.successCircle} name="Success" loop={false} />
                    <ThemedText variant="title" textAlign="center">
                        Cotizacion enviada correctamente
                    </ThemedText>
                    <ThemedText variant="paragraph" textAlign="center">
                        La transaccion quedo pendiente de validacion. Su estado se actualizara cuando sea revisada.
                    </ThemedText>
                    <ThemedButton
                        text="Volver al inicio"
                        onPress={handleGoToIndex}
                        style={styles.backButton}
                    />
                </View>
            </ThemedLayout>
        );
    }

    if (!vehicle || !selectedPlan || !quoterId) {
        return (
            <ThemedLayout padding={[40, Math.max(40, insets.bottom + 24)]}>
                <View style={styles.unavailableContainer}>
                    <ThemedText variant="title" textAlign="center">
                        Cotizacion no disponible
                    </ThemedText>
                    <ThemedText variant="paragraph" textAlign="center">
                        No encontramos la informacion necesaria para generar la transaccion.
                    </ThemedText>
                    <ThemedButton text="Volver al inicio" onPress={handleGoToIndex} />
                </View>
            </ThemedLayout>
        );
    }

    return (
        <>
            {(isLoading || isSubmitting) && <LoadingScreen />}
            <ThemedLayout
                padding={[0, Math.max(120, insets.bottom + 96)]}
                safeAreaEdges={['left', 'right', 'bottom']}
            >
                <View style={styles.content}>
                    <View style={styles.detailSection}>
                        <TicketEdge style={styles.voucherEdge} />
                        <View
                            style={[
                                styles.ticketContent,
                                {
                                    backgroundColor: themeColors.backgroundColor,
                                    borderColor: themeColors.borderBackgroundColor,
                                },
                            ]}
                        >
                            <View style={styles.ticketHeader}>
                                <ThemedText variant="title" textAlign="center" marginBottom={12}>
                                    Detalle de la cotizacion
                                </ThemedText>
                                <Logo width={156} height={38} style={styles.logo} />
                                <ThemedText variant="paragraph" textAlign="center">
                                    Revisa el vehiculo, el propietario y el plan antes de enviar la solicitud.
                                </ThemedText>
                            </View>

                            {!!ownerFullName && (
                                <View
                                    style={[
                                        styles.ownerContainer,
                                        {
                                            backgroundColor: themeColors.backgroundCardColor,
                                            borderColor: themeColors.borderBackgroundColor,
                                        },
                                    ]}
                                >
                                    <ThemedText variant="notes">Propietario</ThemedText>
                                    <ThemedText variant="subTitleBold">{ownerFullName}</ThemedText>
                                </View>
                            )}

                            <VehicleCard
                                brand={vehicle.brand}
                                model={vehicle.model}
                                ppu={vehicle.ppu}
                                year={vehicle.year}
                                isSelected
                            />

                                <QuoteCard plan={selectedPlan} showButton={false} />
                        </View>
                    </View>
                </View>

                <ThemedButton
                    text={isSubmitting ? 'Enviando...' : 'Enviar cotizacion'}
                    onPress={handleTransactionFlow}
                    disabled={isSubmitting || isLoading}
                    style={styles.submitButton}
                />
            </ThemedLayout>

            <MessageModal
                isVisible={!!transactionError}
                onClose={() => setTransactionError('')}
                title="No se pudo enviar"
                message={transactionError}
                icon={{
                    name: 'alert-circle-outline',
                    color: themeColors.status.warning,
                }}
                primaryButton={{
                    text: 'Entendido',
                    onPress: () => setTransactionError(''),
                }}
            />
        </>
    );
}

const styles = StyleSheet.create({
    content: {
        gap: 16,
    },
    detailSection: {
        alignSelf: 'stretch',
    },
    voucherEdge: {
        marginTop: 20,
        alignSelf: 'stretch',
        marginBottom: -2,
    },
    ticketContent: {
        borderWidth: 1,
        borderTopWidth: 0,
        borderRadius: 32,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        paddingHorizontal: 20,
        paddingTop: 4,
        paddingBottom: 24,
        gap: 20,
        marginBottom: 20,
    },
    ticketHeader: {
        alignItems: 'center',
        paddingTop: 8,
        gap: 8,
    },
    logo: {
        marginBottom: 12,
    },
    ownerContainer: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        gap: 4,
    },
    submitButton: {
        marginTop: 8,
    },
    successContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 24,
    },
    unavailableContainer: {
        flex: 1,
        justifyContent: 'center',
        gap: 24,
    },
    successCircle: {
        width: 200,
        height: 200,
    },
    backButton: {
        marginTop: 24,
    },
});
