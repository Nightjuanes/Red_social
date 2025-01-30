import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Mi Perfil" }} />
      <Stack.Screen name="editprofile" options={{ title: "Editar Perfil" }} />
      <Stack.Screen name="postdetail" options={{ title: "Detalle del Post" }} />
    </Stack>
  );
}
