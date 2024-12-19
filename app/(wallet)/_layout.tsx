import React from 'react';
import { Stack, usePathname } from 'expo-router';
import { ThemedHeader } from '@/shared/components';

interface HeaderInfo {
  title: string;
  subtitle: string;
}

const headerInfo: Record<string, HeaderInfo> = {
  'withdrawal': {
    title: "Retiro",
    subtitle: "Seleccionar cuenta"
  },
  'withdrawal-history': {
    title: "Historial de retiros",
    subtitle: "Historial de retiros"
  }
};

function getHeaderInfo(pathname: string): HeaderInfo {
  const route = pathname.split('/').pop() || '';
  return headerInfo[route] || { title: "", subtitle: "" };
}

export default function SettingsLayout() {
  const pathname = usePathname();
  const route = pathname.split('/').pop() || '';

  return (
    <Stack
      screenOptions={{
        header: () => {
          if (route === 'withdrawal-history') {
            const { title, subtitle } = getHeaderInfo(pathname);
            return <ThemedHeader title={title} subtitle={subtitle} />;
          }
          return null;
        },
      }}
    >
      <Stack.Screen name="withdrawal" />
      <Stack.Screen name="withdrawal-history" />
    </Stack>
  );
}