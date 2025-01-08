import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, StyleSheet, TouchableOpacity, Share, Clipboard } from 'react-native';
import { useThemeColor } from '@/shared/hooks';
import { 
    ThemedLayout, 
    ThemedText, 
    ThemedButton, 
    IconContainer, 
    VehicleCard, 
    QuoteCard, 
    TicketEdge, 
    Logo, 
    MessageModal, 
    LoadingScreen,
    LottieAnimation
} from '@/shared/components';
import { useQuote } from '@/core/context';
import { QuoterStatus } from '@/core/types';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';

export default function PaymentQRScreen() {
    const router = useRouter();
    const { planId } = useLocalSearchParams();
    const { vehicle, plans, quoterId, isLoading, generateTransaction, finalizeQuote } = useQuote();
    const [isCopied, setIsCopied] = useState(false);
    const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const themeColors = useThemeColor();
    const link = `https://bci.cl/id=${quoterId}`;

    const selectedPlan = plans.find(plan => plan.planId === planId);

    const handleShare = async () => {
        try {
            await Share.share({
                title: '¡Ya puedes finalizar la compra de tu seguro!',
                message: `Para realizar el pago de tu seguro ${selectedPlan?.planName} para tu vehículo ${vehicle?.brand} ${vehicle?.model} ${vehicle?.year} Ingresa al siguiente enlace:\n\n${link} `,
            });
        } catch (error) {
            console.error('Error al compartir:', error);
            setErrorMessage('No se pudo compartir el enlace de pago');
            setIsErrorModalVisible(true);
        }
    };

    const handleCopyCode = async () => {
      try {
        await Clipboard.setString(link);
        setIsCopied(true);
        // Resetear el estado después de 2 segundos
        setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      } catch (error) {
        console.error('Error al copiar:', error);
      }
    };

    const handleGoToIndex = () => {
        router.push('/');
    };

    const handleTransactionFlow = async (status: QuoterStatus) => {
        try {
            await generateTransaction({ quoterId });
            await finalizeQuote({ quoterId, transactionStatus: status });
            setIsSuccess(true);
        } catch (error) {
            console.error('Error en el flujo de transacción:', error);
            setErrorMessage('Error al procesar la transacción');
            setIsErrorModalVisible(true);
        }
    };

    if (isSuccess) {
        return (
            <ThemedLayout padding={[40, 40]}>
                <View style={styles.successContainer}>
                    <LottieAnimation 
                        style={styles.successCircle} 
                        name="Success" 
                        loop={false} 
                    />
                    <ThemedText variant="title" textAlign="center">
                        Transacción completada exitosamente
                    </ThemedText>
                    <ThemedButton
                        text="Volver al inicio"
                        onPress={() => router.push('/')}
                        style={styles.backButton}
                    />
                </View>
            </ThemedLayout>
        );
    }

    return (
        <ThemedLayout padding={[0, 24]}>
            <View style={styles.content}>
                <View style={styles.qrSection}>
                    <ThemedText variant="superTitle" textAlign="center" marginBottom={16}>
                        Ya puede realizar el pago
                    </ThemedText>

                    <ThemedText variant="paragraph" textAlign="center" marginBottom={24}>
                        Comparte el código con el cliente para terminar el proceso de contratación
                    </ThemedText>

                    <View style={styles.qrContainer}>
                        <QRCode
                            value={link}
                            size={200}
                            color={themeColors.textColorAccent}
                            backgroundColor={themeColors.backgroundColor}
                        />
                    </View>

                    <View style={styles.urlContainer}>
                        <TouchableOpacity onPress={handleCopyCode}>
                            <View style={styles.copyContainer}>
                                <ThemedText
                                    variant="paragraph"
                                    color={isCopied ? themeColors.gray3to4 : themeColors.textColorAccent}
                                >
                                    {isCopied ? "¡Código copiado!" : "Copiar código"}
                                </ThemedText>
                                <Ionicons
                                    name={isCopied ? "checkmark-circle" : "copy-outline"}
                                    size={20}
                                    color={isCopied ? themeColors.gray3to4 : themeColors.textColorAccent}
                                    style={{ marginLeft: 8 }}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>

                    <ThemedButton
                        text="Compartir"
                        onPress={handleShare}
                        icon={{ name: "share", position: "left" }}
                        style={{ marginBottom: 24 }}
                    />
                    <ThemedButton
                        text="Volver al inicio"
                        onPress={handleGoToIndex}
                        icon={{ name: "home", position: "left" }}
                        style={{ marginBottom: 24 }}
                        variant="secondary"
                    />
                </View>

                <View style={styles.detailSection}>
                    <TicketEdge
                        style={{
                            flex: 1,
                            alignSelf: 'stretch',
                            marginBottom: -1,
                        }}
                    />

                    <View style={[
                        styles.ticketContent,
                        {
                            backgroundColor: themeColors.backgroundColor,
                            borderColor: themeColors.borderBackgroundColor,
                        }
                    ]}>
                        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                            <ThemedText variant="title" textAlign="center" marginBottom={12}>
                                Detalle de la compra
                            </ThemedText>
                            <Logo style={{ marginBottom: 24 }} />
                        </View>

                        <View style={styles.quoterHeader}>
                            <IconContainer
                                icon="person-outline"
                                size={24}
                                style={{ backgroundColor: themeColors.textColorAccent }}
                            />
                            <View style={styles.quoterInfo}>
                                <View style={styles.nameContainer}>
                                    <ThemedText variant="subTitleBold">
                                        Alejandro Osses
                                    </ThemedText>

                                    <ThemedText variant="notes">
                                        Actualización: 15/11/2024
                                    </ThemedText>
                                </View>

                                <ThemedText variant="notes">
                                    Cotizado el: 15/11/2024
                                </ThemedText>
                            </View>
                        </View>

                        {vehicle && (
                            <VehicleCard
                                brand={vehicle.brand}
                                model={vehicle.model}
                                ppu={vehicle.ppu}
                                year={vehicle.year}
                                isSelected={true}
                            />
                        )}
                        <View style={styles.section}>
                            {selectedPlan && (
                                <QuoteCard
                                    plan={selectedPlan}
                                    showButton={false}
                                />
                            )}
                        </View>
                    </View>
                </View>
            </View>

            <View style={styles.buttonContainer}>
                <ThemedButton
                    text="Aprobar"
                    onPress={() => handleTransactionFlow('Aprobado')}
                />
                <ThemedButton
                    text="Rechazar"
                    onPress={() => handleTransactionFlow('Rechazado')}
                    backgroundColor={themeColors.status.error}
                />
                <ThemedButton
                    text="Caducar"
                    onPress={() => handleTransactionFlow('Caducado')}
                    backgroundColor={themeColors.status.info}
                />
            </View>

            <MessageModal
                isVisible={isErrorModalVisible}
                onClose={() => setIsErrorModalVisible(false)}
                title="Error"
                message={errorMessage}
                icon={{
                    name: "alert-circle-outline",
                    color: themeColors.status.error
                }}
                primaryButton={{
                    text: "Entendido",
                    onPress: () => setIsErrorModalVisible(false)
                }}
            />
            {isLoading && <LoadingScreen />}
        </ThemedLayout>
    );
}

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    qrSection: {
        marginTop: 20,
        marginBottom: 24,
    },
    detailSection: {
        flex: 1,
    },
    ticketContent: {
        paddingHorizontal: 20,
        borderWidth: 1,
        borderTopWidth: 0,
        borderRadius: 12,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
    },
    qrContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    quoterHeader: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 24,
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
    section: {
        marginTop: 20,
    },
    urlContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    copyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContainer: {
        flexDirection: 'column',
        gap: 12,
        marginTop: 24,
    },
    successContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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