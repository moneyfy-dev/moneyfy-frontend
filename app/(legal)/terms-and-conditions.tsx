import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedLayout } from '@/components/ThemedLayout';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';

export default function TermsAndConditions() {
  const themeColors = useThemeColor();

  const Section = ({ 
    title, 
    content, 
    icon 
  }: { 
    title: string; 
    content: string | React.ReactNode; 
    icon: keyof typeof Ionicons.glyphMap 
  }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons 
          name={icon} 
          size={24} 
          color={themeColors.textColorAccent} 
          style={styles.icon} 
        />
        <ThemedText variant="subTitleBold">
          {title}
        </ThemedText>
      </View>
      {typeof content === 'string' ? (
        <ThemedText 
          variant="paragraph" 
          color={themeColors.textParagraph}
          style={styles.content}
          textAlign="justify"
        >
          {content}
        </ThemedText>
      ) : (
        content
      )}
    </View>
  );

  return (
    <ThemedLayout>
        <View style={styles.header}>
          <ThemedText variant="superTitle" marginBottom={8} textAlign="center">
            Términos y Condiciones
          </ThemedText>
          <ThemedText 
            variant="paragraph" 
            color={themeColors.textParagraph} 
            textAlign="center"
          >
            Última actualización: {new Date().toLocaleDateString()}
          </ThemedText>
        </View>

        <ThemedText 
          variant="paragraph" 
          color={themeColors.textParagraph} 
          style={styles.intro}
          textAlign="justify"
        >
          Bienvenido/a a nuestra aplicación de referidos de seguros. Al utilizar nuestros servicios, 
          aceptas los siguientes términos y condiciones. Por favor, léelos detenidamente antes de continuar:
        </ThemedText>

        <Section
          title="1. Definiciones"
          icon="book-outline"
          content={
            <View>
              <View style={styles.definitionItem}>
                <ThemedText 
                  variant="subTitle" 
                  color={themeColors.textColorAccent}
                  style={styles.content}
                >
                  Usuario:
                </ThemedText>
                <ThemedText 
                  variant="paragraph" 
                  color={themeColors.textParagraph}
                  style={styles.content}
                >
                  Persona que utiliza la aplicación, ya sea como referidor o cliente.
                </ThemedText>
              </View>

              <View style={styles.definitionItem}>
                <ThemedText 
                  variant="subTitle" 
                  color={themeColors.textColorAccent}
                  style={styles.content}
                >
                  Referidor:
                </ThemedText>
                <ThemedText 
                  variant="paragraph" 
                  color={themeColors.textParagraph}
                  style={styles.content}
                >
                  Usuario registrado que comparte enlaces o códigos para referir a nuevos clientes.
                </ThemedText>
              </View>

              <View style={styles.definitionItem}>
                <ThemedText 
                  variant="subTitle" 
                  color={themeColors.textColorAccent}
                  style={styles.content}
                >
                  Cliente:
                </ThemedText>
                <ThemedText 
                  variant="paragraph" 
                  color={themeColors.textParagraph}
                  style={styles.content}
                >
                  Persona que contrata un seguro a través de la plataforma.
                </ThemedText>
              </View>

              <View style={styles.definitionItem}>
                <ThemedText 
                  variant="subTitle" 
                  color={themeColors.textColorAccent}
                  style={styles.content}
                >
                  Comisiones:
                </ThemedText>
                <ThemedText 
                  variant="paragraph" 
                  color={themeColors.textParagraph}
                  style={styles.content}
                >
                  Beneficios económicos generados por referidos exitosos.
                </ThemedText>
              </View>
            </View>
          }
        />

        <Section
          title="2. Uso de la Plataforma"
          icon="phone-portrait-outline"
          content="La aplicación está diseñada para gestionar referidos y facilitar la contratación de seguros. El usuario es responsable de la información que proporciona en la plataforma, incluyendo datos personales y vehiculares. El acceso y uso de la aplicación son exclusivamente para mayores de 18 años."
        />

        <Section
          title="3. Referidos y Comisiones"
          icon="cash-outline"
          content="Las comisiones son calculadas según las políticas de niveles establecidos (primer y segundo nivel).
                Las comisiones generadas estarán retenidas durante un mes hasta la confirmación del pago por parte de la aseguradora.
                La suma de comisiones está limitada al porcentaje máximo permitido por la plataforma."
        />

        <Section
          title="4. Billetera Virtual"
          icon="wallet-outline"
          content="Los saldos acumulados en la billetera virtual pueden ser retirados o utilizados para nuevos pagos.
                Es responsabilidad del usuario proporcionar datos bancarios correctos para los retiros."
        />

        <Section
          title="5. Protección de Datos"
          icon="shield-checkmark-outline"
          content={
            <View>
              <ThemedText variant="paragraph" color={themeColors.textParagraph} style={styles.content}>
                La aplicación cumple con todas las leyes locales de protección de datos. La información proporcionada se usará exclusivamente para el propósito indicado.{'\n\n'}
                Para más información, consulta nuestra{'\n'}
                <ThemedText
                  variant="textLink"
                  linkConfig={{
                    route: "/(legal)/privacy-policy"
                  }}
                >
                  Política de Privacidad.
                </ThemedText>
              </ThemedText>
            </View>
          }
        />

        <Section
          title="6. Limitaciones de Responsabilidad"
          icon="alert-circle-outline"
          content="No nos hacemos responsables de errores en datos ingresados por los usuarios que afecten cotizaciones o contrataciones.
                Las ofertas de seguros están sujetas a disponibilidad y a las políticas de las aseguradoras asociadas."
        />

        <Section
          title="7. Modificaciones"
          icon="git-branch-outline"
          content="Nos reservamos el derecho de modificar estos términos en cualquier momento. Notificaremos a los usuarios sobre cambios relevantes a través de la aplicación."
        />

        <Section
          title="8. Contacto"
          icon="mail-outline"
          content={
            <View>
              <ThemedText variant="paragraph" color={themeColors.textParagraph}>
                Si tienes dudas o necesitas más información, puedes contactarnos en:
              </ThemedText>
              <ThemedText 
                variant="textLink" 
                linkConfig={{ 
                  onPress: () => {/* Función para manejar el contacto */} 
                }}
              >
                soporte@referi2.com
              </ThemedText>
            </View>
          }
        />
    </ThemedLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  intro: {
    marginBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    marginRight: 8,
  },
  content: {
    paddingLeft: 32,
  },
  definitionItem: {
    marginBottom: 20
  },
  definitionText: {
    paddingLeft: 16
  }
});
