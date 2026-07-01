import React from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedLayout, ThemedText } from '@/shared/components';
import { useThemeColor } from '@/shared/hooks';
import { ROUTES } from '@/core/types';

const LAST_UPDATED = '1 de julio de 2026';
const SUPPORT_EMAIL = 'soporte@moneyfy.cl';

type SectionProps = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  children: React.ReactNode;
};

type DefinitionItemProps = {
  label: string;
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

function DefinitionItem({ label, children }: DefinitionItemProps) {
  const themeColors = useThemeColor();

  return (
    <View style={styles.definitionItem}>
      <ThemedText variant="subTitle" color={themeColors.textColorAccent}>
        {label}
      </ThemedText>
      <ThemedText variant="paragraph" color={themeColors.textParagraph} textAlign="justify">
        {children}
      </ThemedText>
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
    const mailtoUrl = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent('Consulta sobre Política de Privacidad')}`;
    const canOpen = await Linking.canOpenURL(mailtoUrl);

    if (canOpen) {
      await Linking.openURL(mailtoUrl);
    }
  } catch (error) {
    console.error('Error al abrir el cliente de correo:', error);
  }
}

export default function PrivacyPolicy() {
  const themeColors = useThemeColor();

  return (
    <ThemedLayout padding={[20, 40]}>
      <View style={styles.header}>
        <ThemedText variant="superTitle" marginBottom={8} textAlign="center">
          Política de Privacidad
        </ThemedText>
        <ThemedText variant="paragraph" color={themeColors.textParagraph} textAlign="center">
          Última actualización: {LAST_UPDATED}
        </ThemedText>
      </View>

      <ThemedText variant="paragraph" color={themeColors.textParagraph} style={styles.intro} textAlign="justify">
        Esta Política de Privacidad regula el tratamiento de datos personales realizado en Moneyfy, plataforma operada
        por Christian Torres, y aplica al uso del sitio web, la aplicación móvil y los servicios asociados. Su
        contenido se interpreta conforme a la legislación chilena vigente sobre protección de datos personales y
        derechos de los consumidores.
      </ThemedText>

      <Section title="1. Responsable del tratamiento" icon="badge-outline">
        <ThemedText variant="paragraph" color={themeColors.textParagraph} textAlign="justify">
          Moneyfy es una plataforma operada por Christian Torres para la intermediación comercial, gestión de
          cotizaciones de seguros y administración de una red de referidos.
        </ThemedText>
        <ThemedText variant="paragraph" color={themeColors.textParagraph} textAlign="justify">
          Para consultas sobre privacidad o ejercicio de derechos del titular, puedes escribir a:
        </ThemedText>
        <ThemedText variant="textLink" linkConfig={{ onPress: openSupportEmail }}>
          {SUPPORT_EMAIL}
        </ThemedText>
      </Section>

      <Section title="2. Datos que tratamos" icon="document-text-outline">
        <BulletList
          items={[
            'Datos de cuenta y registro, como nombre, apellidos, RUT, correo electrónico, teléfono y clave de acceso.',
            'Datos de identificación y contacto del titular, del comprador y del propietario del vehículo cuando una cotización lo requiera.',
            'Datos del vehículo y de la cotización, como patente, marca, modelo, año, uso, dirección y antecedentes necesarios para solicitar propuestas de seguro.',
            'Datos bancarios o de pago necesarios para liquidar comisiones o gestionar abonos asociados a la plataforma.',
            'Datos de navegación, uso, soporte, seguridad y trazabilidad operativa dentro del sitio web y la aplicación.',
            'Comunicaciones, solicitudes, reclamos o antecedentes que el usuario remita al equipo de soporte.',
          ]}
        />
      </Section>

      <Section title="3. Finalidades del tratamiento" icon="analytics-outline">
        <BulletList
          items={[
            'Crear, autenticar, administrar y mantener cuentas de usuario.',
            'Generar, gestionar y actualizar cotizaciones de seguros de auto solicitadas por los usuarios.',
            'Operar el sistema de referidos, calcular comisiones y gestionar su estado operativo.',
            'Validar y procesar pagos o liquidaciones de comisiones a cuentas bancarias informadas por el usuario.',
            'Prevenir fraude, usos abusivos, errores materiales y riesgos de seguridad o cumplimiento.',
            'Atender consultas, reclamos, solicitudes de soporte y comunicaciones operativas o legales.',
            'Cumplir obligaciones legales, regulatorias, contractuales o requerimientos de autoridad competente.',
          ]}
        />
      </Section>

      <Section title="4. Base de legitimación" icon="shield-checkmark-outline">
        <ThemedText variant="paragraph" color={themeColors.textParagraph} textAlign="justify">
          El tratamiento de datos se funda, según corresponda, en el consentimiento del titular, en la necesidad de
          ejecutar medidas precontractuales o contractuales solicitadas por el usuario, en el cumplimiento de
          obligaciones legales y en intereses legítimos vinculados a la seguridad y correcta operación de la
          plataforma, siempre dentro de los márgenes permitidos por la normativa chilena aplicable.
        </ThemedText>
      </Section>

      <Section title="5. Comunicación a terceros" icon="share-social-outline">
        <BulletList
          items={[
            'Aseguradoras, corredoras, intermediarios o partners que participen en el flujo de cotización, evaluación o emisión.',
            'Proveedores tecnológicos, de infraestructura, mensajería, almacenamiento, autenticación, soporte o analítica.',
            'Entidades financieras o prestadores de servicios de pago necesarios para procesar comisiones o abonos.',
            'Autoridades administrativas, judiciales o regulatorias cuando exista obligación legal o requerimiento formal.',
          ]}
        />
      </Section>

      <Section title="6. Derechos del titular" icon="person-outline">
        <BulletList
          items={[
            'Acceso a sus datos personales y a información sobre su tratamiento.',
            'Rectificación, actualización o complementación de datos inexactos o incompletos.',
            'Supresión o cancelación de datos cuando corresponda legalmente.',
            'Oposición a determinados tratamientos en los casos permitidos por la normativa aplicable.',
            'Revocación del consentimiento cuando el tratamiento se funde en este.',
          ]}
        />
        <ThemedText variant="paragraph" color={themeColors.textParagraph} textAlign="justify">
          Para ejercer estos derechos, el canal habilitado es:
        </ThemedText>
        <ThemedText variant="textLink" linkConfig={{ onPress: openSupportEmail }}>
          {SUPPORT_EMAIL}
        </ThemedText>
      </Section>

      <Section title="7. Seguridad, conservación y eliminación" icon="lock-closed-outline">
        <ThemedText variant="paragraph" color={themeColors.textParagraph} textAlign="justify">
          Moneyfy adopta medidas técnicas, administrativas y organizativas razonables para resguardar la
          confidencialidad, integridad y disponibilidad de los datos personales. Los datos se conservarán solo durante
          el tiempo necesario para cumplir las finalidades informadas, obligaciones legales, trazabilidad operativa,
          prevención de fraude y resolución de controversias. Una vez concluida la necesidad del tratamiento, los datos
          serán eliminados, anonimizados o bloqueados según corresponda.
        </ThemedText>
      </Section>

      <Section title="8. Almacenamiento y servicios de terceros" icon="cloud-outline">
        <ThemedText variant="paragraph" color={themeColors.textParagraph} textAlign="justify">
          Algunos servicios de Moneyfy pueden apoyarse en infraestructura o proveedores tecnológicos externos. En esos
          casos, el tratamiento se realizará bajo medidas de seguridad razonables y con acceso limitado a lo necesario
          para la prestación del servicio. Esta política no compromete una localización geográfica específica de la
          infraestructura cuando ello no haya sido formalmente informado al usuario.
        </ThemedText>
      </Section>

      <Section title="9. Uso por menores de edad" icon="people-outline">
        <ThemedText variant="paragraph" color={themeColors.textParagraph} textAlign="justify">
          Moneyfy está orientada exclusivamente a personas mayores de 18 años. Si detectamos antecedentes que indiquen
          uso por menores de edad en contravención a esta regla, podremos limitar, suspender o eliminar la cuenta y
          adoptar las medidas necesarias para cesar el tratamiento respectivo.
        </ThemedText>
      </Section>

      <Section title="10. Vigencia y cambios" icon="git-branch-outline">
        <ThemedText variant="paragraph" color={themeColors.textParagraph} textAlign="justify">
          Esta Política de Privacidad podrá actualizarse para reflejar cambios legales, operativos o funcionales de
          Moneyfy. La versión vigente será la publicada en los canales oficiales de la plataforma. Los cambios
          relevantes podrán ser informados por la aplicación, el sitio web o mediante comunicaciones directas cuando
          corresponda.
        </ThemedText>
      </Section>

      <Section title="11. Contacto" icon="mail-outline">
        <ThemedText variant="paragraph" color={themeColors.textParagraph} textAlign="justify">
          Si tienes dudas sobre esta Política de Privacidad o sobre el tratamiento de tus datos personales, puedes
          escribir a:
        </ThemedText>
        <ThemedText variant="textLink" linkConfig={{ onPress: openSupportEmail }}>
          {SUPPORT_EMAIL}
        </ThemedText>
        <ThemedText variant="paragraph" color={themeColors.textParagraph} textAlign="justify">
          También puedes revisar nuestros Términos y Condiciones:
        </ThemedText>
        <ThemedText variant="textLink" linkConfig={{ route: ROUTES.LEGAL.TERMS }}>
          Términos y Condiciones
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
  definitionItem: {
    marginBottom: 12,
    gap: 4,
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
