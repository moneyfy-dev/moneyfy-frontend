import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '@/shared/components/ui/ThemedText';
import { ThemedLayout } from '@/shared/components/layouts/ThemedLayout';
import { useThemeColor } from '@/shared/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';

export default function PrivacyPolicy() {
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
    <ThemedLayout padding={[20, 40]}>
      <View style={styles.header}>
        <ThemedText variant="superTitle" marginBottom={8} textAlign="center">
          Política de Privacidad
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
        En Referi2, tu privacidad es nuestra prioridad. Esta política describe cómo recopilamos, 
        usamos y protegemos tu información personal. Al utilizar nuestra aplicación, aceptas los 
        términos descritos a continuación.
      </ThemedText>

      <Section
        title="1. Información que Recopilamos"
        icon="document-text-outline"
        content={
          <View>
            <View style={styles.definitionItem}>
              <ThemedText 
                variant="subTitle" 
                color={themeColors.textColorAccent}
                style={styles.content}
              >
                Información personal:
              </ThemedText>
              <ThemedText 
                variant="paragraph" 
                color={themeColors.textParagraph}
                style={styles.content}
              >
                Incluye tu nombre, correo electrónico, número de teléfono y cualquier dato proporcionado al registrarte o realizar una cotización.
              </ThemedText>
            </View>

            <View style={styles.definitionItem}>
              <ThemedText 
                variant="subTitle" 
                color={themeColors.textColorAccent}
                style={styles.content}
              >
                Información de uso:
              </ThemedText>
              <ThemedText 
                variant="paragraph" 
                color={themeColors.textParagraph}
                style={styles.content}
              >
                Datos relacionados con tu interacción en la aplicación, como accesos, clics y tiempo de uso.
              </ThemedText>
            </View>

            <View style={styles.definitionItem}>
              <ThemedText 
                variant="subTitle" 
                color={themeColors.textColorAccent}
                style={styles.content}
              >
                Información vehicular:
              </ThemedText>
              <ThemedText 
                variant="paragraph" 
                color={themeColors.textParagraph}
                style={styles.content}
              >
                Datos de tu vehículo, como patente y características específicas, utilizados para generar cotizaciones de seguros.
              </ThemedText>
            </View>
          </View>
        }
      />

      <Section
        title="2. Uso de la Información"
        icon="analytics-outline"
        content="Utilizamos tu información para los siguientes fines:
                • Facilitar la cotización y contratación de seguros.
                • Gestionar el sistema de referidos y comisiones.
                • Enviar notificaciones sobre actualizaciones de comisiones, estado de referidos y promociones relevantes.
                • Mejorar nuestra aplicación mediante el análisis de datos de uso."
      />

      <Section
        title="3. Compartir tu Información"
        icon="share-social-outline"
        content="Tu información será compartida únicamente con:
                • Compañías de seguros asociadas, para procesar cotizaciones y contrataciones.
                • Proveedores de servicios, como plataformas de pago o herramientas de análisis de datos.
                • Autoridades legales, cuando sea requerido por ley."
      />

      <Section
        title="4. Seguridad de los Datos"
        icon="lock-closed-outline"
        content="Implementamos medidas de seguridad técnicas y organizativas para proteger tu información contra accesos no autorizados, pérdida o alteración.
                Sin embargo, no podemos garantizar seguridad absoluta en la transmisión de datos a través de internet."
      />

      <Section
        title="5. Tus Derechos"
        icon="person-outline"
        content="Tienes derecho a:
                • Acceder, corregir o eliminar tu información personal.
                • Revocar tu consentimiento para el uso de datos en cualquier momento.
                • Solicitar detalles sobre cómo se procesan tus datos."
      />

      <Section
        title="6. Cookies y Tecnologías Similares"
        icon="code-working-outline"
        content="Nuestra aplicación utiliza cookies y tecnologías similares para mejorar tu experiencia. Puedes desactivarlas ajustando la configuración de tu dispositivo."
      />

      <Section
        title="7. Modificaciones a esta Política"
        icon="git-branch-outline"
        content="Nos reservamos el derecho de actualizar esta política en cualquier momento. Te notificaremos sobre cambios importantes a través de la aplicación."
      />

      <Section
        title="8. Contacto"
        icon="mail-outline"
        content={
          <View>
            <ThemedText variant="paragraph" color={themeColors.textParagraph} style={styles.content}>
              Si tienes dudas sobre nuestra Política de Privacidad o sobre el manejo de tus datos personales, 
              por favor contáctanos en:
            </ThemedText>
            <ThemedText 
              variant="textLink" 
              linkConfig={{ 
                onPress: () => {/* Función para manejar el contacto */} 
              }}
              style={styles.content}
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
