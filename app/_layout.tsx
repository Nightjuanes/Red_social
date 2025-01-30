import { AuthProvider } from "@/context/AutContext";
import { Stack } from "expo-router";
import { Ionicons } from '@expo/vector-icons'; // Importa los íconos que necesitas

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'Inicio',
            headerLeft: () => (
              <Ionicons name="home" size={24} color="black" />
            )
          }} 
        />
        <Stack.Screen 
          name="singin" 
          options={{ 
            title: 'Registrate',
            headerLeft: () => (
              <Ionicons name="person-add" size={24} color="black" />
            )
          }} 
        />
        <Stack.Screen 
          name="singup" 
          options={{ 
            title: 'Ingresa',
            headerLeft: () => (
              <Ionicons name="log-in" size={24} color="black" />
            )
          }} 
        />
        {/* Cuando el usuario se loggea */}
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AuthProvider>
  );
}
