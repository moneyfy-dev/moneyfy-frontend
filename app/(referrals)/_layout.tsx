import React from 'react';
import { Stack, usePathname } from 'expo-router';
import { CustomHeader } from '@/components/ThemedHeader';

interface HeaderInfo {
  title: string;
  subtitle: string;
}

const headerInfo: Record<string, HeaderInfo> = {
  'referral-detail': {
    title: "Detalle de referido",
    subtitle: "Detalles del referido"
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
          return <CustomHeader title={title} subtitle={subtitle} />;
        },
      }}
    >
      <Stack.Screen name="referral-detail" />
    </Stack>
  );
}