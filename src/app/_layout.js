import { Stack } from "expo-router";
import { DatosProvider } from "../context/DatosContext";
import { colores } from "../constants/tema";

// Cómo se ven las hojas que suben desde abajo
const hoja = {
  presentation: "formSheet",
  sheetAllowedDetents: "fitToContents",
  sheetGrabberVisible: true,
  sheetCornerRadius: 20,
  headerShown: false,
  contentStyle: { backgroundColor: colores.superficie },
};

export default function RootLayout() {
  return (
    <DatosProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="presupuesto" options={hoja} />
      </Stack>
    </DatosProvider>
  );
}