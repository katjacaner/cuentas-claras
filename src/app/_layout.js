import { Stack, ThemeProvider, DarkTheme, DefaultTheme } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { DatosProvider } from "../context/DatosContext";
import { colores, esOscuro } from "../constants/tema";

// Colores para la barra de pestañas y los encabezados (esos los dibuja la navegación, no nosotros)
const base = esOscuro ? DarkTheme : DefaultTheme;
const temaNavegacion = {
  ...base,
  colors: {
    ...base.colors,
    primary: colores.acento,
    background: colores.fondo,
    card: colores.superficie,
    text: colores.texto,
    border: colores.borde,
    notification: colores.peligro,
  },
};

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
    <ThemeProvider value={temaNavegacion}>
      <DatosProvider>
        <StatusBar style="auto" />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="presupuesto" options={hoja} />
          <Stack.Screen name="gasto" options={modal} />
          <Stack.Screen name="deuda" options={modal} />
          <Stack.Screen name="pago" options={hoja} />
          <Stack.Screen name="ajustes" options={modal} />
        </Stack>
      </DatosProvider>
    </ThemeProvider>
  );
}