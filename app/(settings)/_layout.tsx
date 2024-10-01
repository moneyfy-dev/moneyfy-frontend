import { Stack } from 'expo-router';
import { CustomHeader } from '@/components/ThemedHeader';

export default function SettingsLayout() {
  return (
    <Stack
    screenOptions={{
      header: () => <CustomHeader title="Información Personal" subtitle="Configura tu información personal" />,
    }}
  >
      <Stack.Screen name="personal-info" options={{ title: "Información Personal" }} />
      <Stack.Screen name="payment-config" options={{ title: "Configuración de Pago" }} />
      <Stack.Screen name="appearance" options={{ title: "Apariencia" }} />
      <Stack.Screen name="referral-code" options={{ title: "Código de Referido" }} />
      <Stack.Screen name="privacy-security" options={{ title: "Privacidad y Seguridad" }} />
      <Stack.Screen name="notifications" options={{ title: "Notificaciones" }} />
    </Stack>
  );
}