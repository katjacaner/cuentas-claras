import { Stack } from "expo-router";
import { DatosProvider } from "../context/DatosContext";

export default function RootLayout() {
  return (
    <DatosProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </DatosProvider>
  );
}