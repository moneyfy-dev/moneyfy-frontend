import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Alert, Share, Clipboard, } from 'react-native';
import { ThemedLayout } from '@/shared/components/layouts/ThemedLayout';
import { ThemedText } from '@/shared/components/ui/ThemedText';
import { IconContainer } from '@/shared/components/ui/IconContainer';
import { useThemeColor } from '@/shared/hooks/useThemeColor';
import { ThemedButton } from '@/shared/components/ui/ThemedButton';
import { VehicleCard } from '@/shared/components/composite/VehicleCard';
import { QuoteCard } from '@/shared/components/composite/QuoteCard';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';
import { TicketEdge } from '@/shared/components/images/TicketEdge';
import { Logo } from '@/shared/components/ui/Logo';
import { useLocalSearchParams } from 'expo-router';
import { InsurancePlan, Vehicle } from '@/core/types/quote';
import { useRouter } from 'expo-router';
import { MessageModal } from '@/shared/components/modals/MessageModal';

export default function PaymentQRScreen() {
  const router = useRouter();
  const { quoterId: quoterIdParam, plan: planParam, vehicle: vehicleParam } = useLocalSearchParams();

  const [plan, setPlan] = useState<InsurancePlan | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const themeColors = useThemeColor();
  const qrValue = 'https://connect360.cl';

  useEffect(() => {
    try {
      if (planParam) {
        const parsedPlan = JSON.parse(planParam as string) as InsurancePlan;
        setPlan(parsedPlan);
      }
      if (vehicleParam) {
        let parsedVehicle: Vehicle;
        if (typeof vehicleParam === 'string') {
          parsedVehicle = JSON.parse(vehicleParam);
        } else {
          parsedVehicle = vehicleParam as unknown as Vehicle;
        }
        setSelectedVehicle(parsedVehicle);
      }
    } catch (error) {
      console.error('Error al procesar los datos:', error);
      console.error('plansParam:', planParam);
      setErrorMessage('Hubo un problema al cargar los resultados');
      setIsErrorModalVisible(true);
    }
  }, [planParam, vehicleParam]);
  const link = `https://bci.cl/id=${quoterIdParam}`;

  const handleShareLink = async () => {
    try {
      await Share.share({
        title: '¡Ya puedes finalizar la compra de tu seguro!',
        message: `Para realizar el pago de tu seguro ${plan?.planName} para tu vehículo ${selectedVehicle?.brand} ${selectedVehicle?.model} ${selectedVehicle?.year} Ingresa al siguiente enlace:\n\n${link} `,
      });
    } catch (error) {
      console.error('Error al compartir:', error);
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
              value={qrValue}
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
            onPress={handleShareLink}
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

            {selectedVehicle && (
              <VehicleCard
                brand={selectedVehicle.brand}
                model={selectedVehicle.model}
                ppu={selectedVehicle.ppu}
                year={selectedVehicle.year}
                isSelected={true}
              />
            )}
            <View style={styles.section}>
              {plan && (
                <QuoteCard
                  plan={plan}
                  showButton={false}
                />
              )}
            </View>
          </View>
        </View>
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
    gap: 8,
  },
  copyButton: {
    padding: 8,
  },
  copyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
});