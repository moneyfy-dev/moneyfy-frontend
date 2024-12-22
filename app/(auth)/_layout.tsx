import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register-screen" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="persistent-auth" />
      <Stack.Screen name="confirmation-code" />
    </Stack>
  );
}