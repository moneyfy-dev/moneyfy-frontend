import React from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ROUTES } from '@/core/types';
import { ThemedLayout, ThemedText } from '@/shared/components';
import { useThemeColor } from '@/shared/hooks';

const LAST_UPDATED = '1 de julio de 2026';
const SUPPORT_EMAIL = 'soporte@moneyfy.cl';

type SectionProps = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  children: React.ReactNode;
};

function Section({ title, icon, children }: SectionProps) {
  const themeColors = useThemeColor();

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name={icon} size={24} color={themeColors.textColorAccent} style={styles.icon} />
        <ThemedText variant="subTitleBold">{title}</ThemedText>
      </View>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
}

function BulletList({ items }: { items: string[] }) {
  const themeColors = useThemeColor();

  return (
    <View style={styles.list}>
      {items.map((item) => (
        <View key={item} style={styles.listItem}>
          <ThemedText variant="paragraph" color={themeColors.textColorAccent} style={styles.bullet}>
            •
          </ThemedText>
          <ThemedText variant="paragraph" color={themeColors.textParagraph} style={styles.listText} textAlign="justify">
            {item}
          </ThemedText>
        </View>
      ))}
    </View>
  );
}

async function openSupportEmail() {
  try {
    const mailtoUrl = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('Consulta sobre Términos y Condiciones')}`;
    const canOpen = await Linking.canOpenURL(mailtoUrl);

    if (canOpen) {
      await Linking.openURL(mailtoUrl);
    }
  } catch (error) {
    console.error('Error al abrir el cliente de correo:', error);
  }
}

export default function TermsAndConditions() {
  const themeColors = useThemeColor();

  return (
    <ThemedLayout padding={[20, 40]}>
      <View style={styles.header}>
        <ThemedText variant="superTitle" marginBottom={8} textAlign="center">
          Términos y Condiciones
        </ThemedText>
        <ThemedText variant="paragraph" color={themeColors.textParagraph} textAlign="center">
          Última actualización: {LAST_UPDATED}
        </ThemedText>
      </View>

      <ThemedText variant="paragraph" color={themeColors.textParagraph} style={styles.intro} textAlign="justify">
        Estos Términos y Condiciones regulan el acceso y uso del sitio web, la aplicación móvil y los servicios
        asociados a Moneyfy, plataforma operada por Christian Torres. Al registrarte, navegar o utilizar la
        plataforma, declaras haber leído y aceptado estos términos conforme a la legislación chilena aplicable.
      </ThemedText>

      <Section title="1. Naturaleza del servicio" icon="storefront-outline">
        <ThemedText variant="paragraph" color={themeColors.textParagraph} textAlign="justify">
          Moneyfy opera como un marketplace y plataforma digital de intermediación comercial que conecta usuarios con
          oferentes, partners, corredoras, intermediarios o entidades del ecosistema asegurador. Moneyfy no es una
          aseguradora y no garantiza por sí misma la emisión, aceptación, cobertura, condiciones finales ni vigencia
          de una póliza.
        </ThemedText>
      </Section>

      <Section title="2. Reglas de registro y uso" icon="person-outline">
        <BulletList
          items={[
            'Ser mayor de 18 años y tener capacidad para contratar.',
            'Entregar información veraz, suficiente, exacta y actualizada.',
            'Usar la plataforma en forma personal, lícita y conforme a estos términos.',
            'No suplantar identidades, alterar procesos, manipular referidos, automatizar usos abusivos ni intervenir indebidamente la plataforma.',
          ]}
        />
      </Section>

      <Section title="3. Cotizaciones y productos" icon="car-outline">
        <ThemedText variant="paragraph" color={themeColors.textParagraph} textAlign="justify">
          Las cotizaciones gestionadas por Moneyfy son referenciales o quedan sujetas a validación final del partner,
          corredora, intermediario o aseguradora correspondiente. Los valores, coberturas, condiciones, vigencia o
          disponibilidad pueden variar según los antecedentes del vehículo, del comprador, del propietario, historial
          comercial, políticas del oferente y revisión final del flujo respectivo.
        </ThemedText>
      </Section>

      <Section title="4. Referidos y comisiones" icon="people-outline">
        <ThemedText variant="paragraph" color={themeColors.textParagraph} textAlign="justify">
          Moneyfy contempla una red de referidos multinivel conforme a la operación vigente de la plataforma. El
          derecho a comisión nace únicamente cuando la operación elegible queda validada dentro del flujo comercial
          correspondiente. Las comisiones pueden encontrarse pendientes, aprobadas, pagadas o en estado conflictivo
          según la revisión operativa, comercial, documental o financiera del caso.
        </ThemedText>
        <ThemedText variant="paragraph" color={themeColors.textParagraph} textAlign="justify">
          Las comisiones no constituyen remuneración laboral, sueldo, honorario ni generan vínculo de subordinación o
          dependencia entre el usuario y Moneyfy.
        </ThemedText>
      </Section>

      <Section title="5. Pagos y liquidaciones" icon="cash-outline">
        <ThemedText variant="paragraph" color={themeColors.textParagraph} textAlign="justify">
          Los pagos de comisiones se procesarán según el ciclo operacional vigente de Moneyfy, normalmente en forma
          mensual o periódica, y estarán sujetos a que el usuario mantenga datos bancarios correctos y suficientes.
          Moneyfy podrá retener, ajustar, reversar o no pagar montos ante fraude, error material, rechazo de la
          operación, anulación, inconsistencias documentales, conflictos bancarios o incumplimiento de estos términos.
        </ThemedText>
      </Section>

      <Section title="6. Suspensión o cierre de cuenta" icon="ban-outline">
        <ThemedText variant="paragraph" color={themeColors.textParagraph} textAlign="justify">
          Moneyfy podrá limitar, suspender o cerrar cuentas cuando detecte incumplimientos, fraude, riesgos
          operacionales, información falsa, usos incompatibles con la finalidad del servicio o requerimientos legales o
          regulatorios. Estas medidas podrán adoptarse de manera preventiva para resguardar a la plataforma, a terceros
          y al usuario afectado.
        </ThemedText>
      </Section>

      <Section title="7. Propiedad intelectual" icon="document-lock-outline">
        <ThemedText variant="paragraph" color={themeColors.textParagraph} textAlign="justify">
          El contenido, diseño, software, marcas, textos, logos, interfaces y funcionalidades de Moneyfy están
          protegidos por la normativa aplicable. El usuario no podrá copiar, reproducir, distribuir, modificar,
          descompilar ni explotar comercialmente la plataforma o sus componentes fuera de los usos expresamente
          permitidos.
        </ThemedText>
      </Section>

      <Section title="8. Limitación de responsabilidad" icon="alert-circle-outline">
        <ThemedText variant="paragraph" color={themeColors.textParagraph} textAlign="justify">
          Moneyfy no responde por indisponibilidades temporales, fallas de conectividad, errores de terceros,
          decisiones de aseguradoras, corredoras o partners, ni por consecuencias derivadas de datos incorrectos
          ingresados por el usuario. Tampoco garantiza continuidad ininterrumpida del servicio, aunque procurará
          mantener una operación razonable y segura.
        </ThemedText>
      </Section>

      <Section title="9. Protección de datos personales" icon="shield-checkmark-outline">
        <ThemedText variant="paragraph" color={themeColors.textParagraph} textAlign="justify">
          El tratamiento de datos personales asociado al uso de Moneyfy se rige por la Política de Privacidad, la que
          forma parte integrante de estos términos.
        </ThemedText>
        <ThemedText variant="textLink" linkConfig={{ route: ROUTES.LEGAL.PRIVACY_POLICY }}>
          Política de Privacidad
        </ThemedText>
      </Section>

      <Section title="10. Ley aplicable y jurisdicción" icon="scale-outline">
        <ThemedText variant="paragraph" color={themeColors.textParagraph} textAlign="justify">
          Estos términos se rigen por la legislación de la República de Chile, incluyendo la normativa sobre
          protección de datos personales y derechos de los consumidores. Cualquier controversia se someterá a los
          mecanismos y autoridades competentes que correspondan conforme al ordenamiento jurídico chileno.
        </ThemedText>
      </Section>

      <Section title="11. Cambios a estos términos" icon="git-branch-outline">
        <ThemedText variant="paragraph" color={themeColors.textParagraph} textAlign="justify">
          Moneyfy podrá modificar estos Términos y Condiciones para reflejar cambios operativos, comerciales,
          funcionales o legales. La versión vigente será la publicada en los canales oficiales de la plataforma.
        </ThemedText>
      </Section>

      <Section title="12. Contacto" icon="mail-outline">
        <ThemedText variant="paragraph" color={themeColors.textParagraph} textAlign="justify">
          Si tienes dudas sobre estos Términos y Condiciones, puedes escribir a:
        </ThemedText>
        <ThemedText variant="textLink" linkConfig={{ onPress: openSupportEmail }}>
          {SUPPORT_EMAIL}
        </ThemedText>
        <ThemedText variant="paragraph" color={themeColors.textParagraph} textAlign="justify">
          También puedes revisar nuestra Política de Privacidad:
        </ThemedText>
        <ThemedText variant="textLink" linkConfig={{ route: ROUTES.LEGAL.PRIVACY_POLICY }}>
          Política de Privacidad
        </ThemedText>
      </Section>
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
  sectionContent: {
    paddingLeft: 32,
    gap: 12,
  },
  icon: {
    marginRight: 8,
  },
  list: {
    gap: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bullet: {
    width: 14,
    lineHeight: 16,
  },
  listText: {
    flex: 1,
  },
});
