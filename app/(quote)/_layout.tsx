import React from 'react';
import { Stack, usePathname } from 'expo-router';
import { CustomHeader } from '@/components/ThemedHeader';

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
          return <CustomHeader title={title} subtitle={subtitle} />;
        },
      }}
    >
      <Stack.Screen name="manual-search" />
      <Stack.Screen name="search-result" />
    </Stack>
  );
}