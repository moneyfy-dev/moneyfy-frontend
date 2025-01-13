import React from 'react';
import { Stack, usePathname } from 'expo-router';
import { ThemedHeader } from '@/shared/components';

interface HeaderInfo {
  title: string;
  subtitle: string;
}

const headerInfo: Record<string, HeaderInfo> = {
  'manual-search': {
    title: "Búsqueda manual",
    subtitle: "Busca un vehiculo de forma manual"
  },
  'search-results': {
    title: "Resultado de la búsqueda",
    subtitle: "Resultados de la búsqueda"
  },
  'quote-results': {
    title: "Resultado de la búsqueda",
    subtitle: "Resultados de la búsqueda"
  },
  'confirm-address': {
    title: "Datos del propietario",
    subtitle: "Ingresa los datos del propietario"
  },
  'payment-qr': {
    title: "Código de pago",
    subtitle: "Comparte el código para que el cliente realice el pago"
  },

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
      <Stack.Screen name="manual-search" />
      <Stack.Screen name="search-results" />
      <Stack.Screen name="quote-results" />
      <Stack.Screen name="confirm-address" />
      <Stack.Screen name="payment-qr" />
    </Stack>
  );
}