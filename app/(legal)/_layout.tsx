import React from 'react';
import { Stack, usePathname } from 'expo-router';
import { CustomHeader } from '@/components/ThemedHeader';

interface HeaderInfo {
  title: string;
  subtitle: string;
}

const headerInfo: Record<string, HeaderInfo> = {
  'terms-and-conditions': {
    title: "Términos y condiciones",
    subtitle: "Lee nuestros términos y condiciones"
  },
  'privacy-policy': {
    title: "Política de privacidad",
    subtitle: "Lee nuestra política de privacidad"
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
      <Stack.Screen name="terms-and-conditions" />
      <Stack.Screen name="privacy-policy" />
    </Stack>
  );
}