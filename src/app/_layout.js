import { Stack } from "expo-router";
import { DatosProvider } from "../context/DatosContext";
import { colores } from "../constants/tema";

// Hoja chica que sube desde abajo (mide lo justo para su contenido)
const hoja = {
  presentation: "formSheet",
  sheetAllowedDetents: "fitToContents",
  sheetGrabberVisible: true,
  sheetCornerRadius: 20,
  headerShown: false,
  contentStyle: { backgroundColor: colores.superficie },
};

// Hoja alta, para formularios largos con teclado
const modal = {
  presentation: "modal",
  headerShown: false,
  contentStyle: { backgroundColor: colores.superficie },
};

export default function RootLayout() {
  return (
    <DatosProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="presupuesto" options={hoja} />
        <Stack.Screen name="gasto" options={modal} />
        <Stack.Screen name="deuda" options={modal} />
          <Stack.Screen name="pago" options={hoja} />
          <Stack.Screen name="ajustes" options={modal} />
      </Stack>
    </DatosProvider>
  );
}