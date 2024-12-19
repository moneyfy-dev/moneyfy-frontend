import React from 'react';
import { Stack, usePathname } from 'expo-router';
import { ThemedHeader } from '@/shared/components';

interface HeaderInfo {
  title: string;
  subtitle: string;
}

const headerInfo: Record<string, HeaderInfo> = {
  'personal-info': {
    title: "Información personal",
    subtitle: "Edita tu información personal"
  },
  'payment-config': {
    title: "Configuración de pago",
    subtitle: "Selecciona una cuenta"
  },
  'add-account': {
    title: "Agregar cuenta",
    subtitle: "Agrega la cuenta bancaria para recibir los pagos por referidos"
  },
  'referral-code': {
    title: "Código de referido",
    subtitle: "Comparte tu código para seguir sumando lucas"
  },
  'privacy-security': {
    title: "Privacidad y Seguridad",
    subtitle: "Configura tus opciones de seguridad"
  },
  'change-password': {
    title: "Cambiar contraseña",
    subtitle: "Actualiza tu información de acceso a la App"
  },
  'pin-config': {
    title: "Configuración de PIN",
    subtitle: "Configura tu PIN o patrón para la App"
  },
  'two-factor-auth': {
    title: "Autenticación de dos pasos",
    subtitle: "Configura tu autenticación de dos pasos"
  },
  'appearance': {
    title: "Apariencia",
    subtitle: "Escoje el tema que más te guste"
  },
  'notifications': {
    title: "Notificaciones",
    subtitle: "Configura tus preferencias de notificaciones"
  }
};

function getHeaderInfo(pathname: string): HeaderInfo {
  const route = pathname.split('/').pop() || '';
  return headerInfo[route] || { title: "", subtitle: "" };
}

export default function SettingsLayout() {
  const pathname = usePathname();

  return (
    <Stack
      screenOptions={{
        header: () => {
          const { title, subtitle } = getHeaderInfo(pathname);
          return <ThemedHeader title={title} subtitle={subtitle} />;
        },
      }}
    >
      <Stack.Screen name="personal-info" />
      <Stack.Screen name="payment-config" />
      <Stack.Screen name="add-account" />
      <Stack.Screen name="referral-code" />
      <Stack.Screen name="privacy-security" />
      <Stack.Screen name="appearance" />
      <Stack.Screen name="notifications" />
    </Stack>
  );
}