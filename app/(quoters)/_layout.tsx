import React from 'react';
import { Stack, usePathname } from 'expo-router';
import { ThemedHeader } from '@/shared/components/ThemedHeader';

interface HeaderInfo {
  title: string;
  subtitle: string;
}

const headerInfo: Record<string, HeaderInfo> = {
  'quoter-detail': {
    title: "Detalle de cotizante",
    subtitle: "Detalles del cotizante"
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
      <Stack.Screen name="quoter-detail" />
    </Stack>
  );
}