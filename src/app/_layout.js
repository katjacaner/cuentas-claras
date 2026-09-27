import { Platform, View, StyleSheet } from "react-native";
import { Stack, ThemeProvider, DarkTheme, DefaultTheme } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  useFonts,
  BricolageGrotesque_700Bold,
  BricolageGrotesque_800ExtraBold,
} from "@expo-google-fonts/bricolage-grotesque";
import { DatosProvider } from "../context/DatosContext";
import { colores, esOscuro } from "../constants/tema";

// ¿La app está corriendo en un navegador?
const esWeb = Platform.OS === "web";

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
  // Cargamos las tipografías del diseño antes de mostrar la app
  const [fuentesListas, errorFuentes] = useFonts({
    BricolageGrotesque_700Bold,
    BricolageGrotesque_800ExtraBold,
  });

  // Mientras cargan no mostramos nada (dura un instante).
  // Si fallaran, seguimos igual con la letra del celular.
  if (!fuentesListas && !errorFuentes) return null;

  return (
    <ThemeProvider value={temaNavegacion}>
      <DatosProvider>
        <StatusBar style="auto" />
        {/* En la compu, la app se ve como una columna de celular centrada */}
        <View style={styles.fondo}>
          <View style={[styles.columna, esWeb && styles.columnaWeb]}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="presupuesto" options={hoja} />
              <Stack.Screen name="gasto" options={modal} />
              <Stack.Screen name="deuda" options={modal} />
              <Stack.Screen name="pago" options={hoja} />
              <Stack.Screen name="ajustes" options={modal} />
            </Stack>
          </View>
        </View>
      </DatosProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  fondo: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  columna: {
    flex: 1,
    width: "100%",
  },
  columnaWeb: {
    maxWidth: 520,
    alignSelf: "center",
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: colores.borde,
  },
});