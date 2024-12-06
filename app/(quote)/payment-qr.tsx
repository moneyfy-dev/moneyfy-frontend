import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { ThemedLayout } from '@/components/ThemedLayout';
import { ThemedText } from '@/components/ThemedText';
import { IconContainer } from '@/components/IconContainer';
import { useThemeColor } from '@/hooks/useThemeColor';
import { ThemedButton } from '@/components/ThemedButton';
import { VehicleCard } from '@/components/VehicleCard';
import { QuoteCard } from '@/components/QuoteCard';
import QRCode from 'react-native-qrcode-svg';
import { Ionicons } from '@expo/vector-icons';
import { TicketEdge } from '@/components/images/TicketEdge';
import Svg, { Path } from 'react-native-svg';
import { Logo } from '@/components/Logo';

export function PaymentQRScreen() {
  const themeColors = useThemeColor();
  const qrValue = 'https://connect360.cl';

  // Datos de ejemplo (estos vendrían por props o contexto en producción)
  const vehicleInfo = {
    brand: "Toyota",
    model: "NEW YARIS SEDAN XLI",
    ppu: "CTJZ47",
    year: "2011"
  };

  const planInfo = {
    id: "1",
    insuranceCompany: "Seguros Falabella",
    planName: "Seguro Motocicleta Full Falabella",
    deductible: "10 UF",
    monthlyPayment: "0.5 UF",
    price: 18870,
    originalPrice: 26957,
    discount: 30
  };

  const handleShareLink = () => {
    console.log('Compartiendo enlace...');
  };

  const handleCopyLink = async () => {
    await Clipboard.setStringAsync(qrValue);
    // agregar un Toast o Alert para confirmar la copia
  };

  return (
    <ThemedLayout padding={[0, 24]}>
      <View style={styles.content}>
        <View style={styles.qrSection}>
          <ThemedText variant="title" textAlign="center" marginBottom={16}>
            Código de pago
          </ThemedText>

          <ThemedText variant="paragraph" textAlign="center" marginBottom={24}>
            Comparte el código para que el cliente realice el pago
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
            <ThemedText
              variant="paragraph"
              textAlign="center"
              color={themeColors.status.success}
            >
              {qrValue}
            </ThemedText>
            <TouchableOpacity
              onPress={handleCopyLink}
              style={styles.copyButton}
            >
              <Ionicons
                name="copy-outline"
                size={20}
                color={themeColors.status.success}
              />
            </TouchableOpacity>
          </View>

          <ThemedButton
            text="Compartir Link"
            onPress={handleShareLink}
            icon={{ name: "share", position: "left" }}
            style={{ marginBottom: 24 }}
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

            <View style={styles.referralHeader}>
              <IconContainer
                icon="person-outline"
                size={24}
                style={{ backgroundColor: themeColors.status.success }}
              />
              <View style={styles.referralInfo}>
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

            <VehicleCard
              brand={vehicleInfo.brand}
              model={vehicleInfo.model}
              ppu={vehicleInfo.ppu}
              year={vehicleInfo.year}
              showRightIcon={false}
            />

            <View style={styles.section}>
              <QuoteCard
                plan={planInfo}
                showButton={false}
              />
            </View>
          </View>
        </View>
      </View>
    </ThemedLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  qrSection: {
    marginTop: 60,
    marginBottom: 24,
  },
  detailSection: {
    flex: 1,
  },
  ticketContent: {
    padding: 16,
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
  referralHeader: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
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
  section: {
    gap: 16,
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
});