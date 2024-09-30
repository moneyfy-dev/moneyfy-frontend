import { Stack } from 'expo-router';

export default function SettingsLayout() {
  return (
    <Stack>
      <Stack.Screen name="personal-info" options={{ title: "Información Personal" }} />
      <Stack.Screen name="payment-config" options={{ title: "Configuración de Pago" }} />
      <Stack.Screen name="appearance" options={{ title: "Apariencia" }} />
      <Stack.Screen name="referral-code" options={{ title: "Código de Referido" }} />
      <Stack.Screen name="privacy-security" options={{ title: "Privacidad y Seguridad" }} />
      <Stack.Screen name="notifications" options={{ title: "Notificaciones" }} />
      <Stack.Screen name="logout" options={{ title: "Cerrar Sesión" }} />
    </Stack>
  );
}