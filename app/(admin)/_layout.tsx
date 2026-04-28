import { Stack } from "expo-router";

export default function AdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" />
      <Stack.Screen name="products/index" />
      <Stack.Screen name="products/create" />
      <Stack.Screen name="products/[id]" />
      <Stack.Screen name="orders/index" />
      <Stack.Screen name="orders/[id]" />
      <Stack.Screen name="quotes/index" />
      <Stack.Screen name="quotes/[id]" />
      <Stack.Screen name="messages/index" />
      <Stack.Screen name="featured" />
      <Stack.Screen name="campaigns" />
    </Stack>
  );
}
