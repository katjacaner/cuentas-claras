import { Appearance } from "react-native";

// Colores del diseño "Mis gastos", en versión clara y oscura.
// Si cambiás un color acá, cambia en toda la app.
const claro = {
  fondo: "#EEF1EC",        // fondo general (verdoso claro)
  superficie: "#FFFFFF",   // tarjetas y paneles
  superficie2: "#F5F7F3",  // campos de texto y barras vacías
  texto: "#18221D",        // texto principal
  textoSuave: "#5E6B64",   // texto secundario (gris)
  borde: "#D8DFD9",        // líneas y bordes
  acento: "#25614F",       // verde principal
  acentoSuave: "#DCEBE4",  // verde clarito (fondos de selección)
  sobreAcento: "#FFFFFF",  // texto encima del verde
  aviso: "#A8660F",        // naranja: deuda que vence pronto
  avisoSuave: "#F6E8D3",
  peligro: "#B3261E",      // rojo: deuda vencida o presupuesto pasado
  peligroSuave: "#F9E0DD",
  sobrePeligro: "#FFFFFF", // texto encima del rojo (los globitos)
};

const oscuro = {
  fondo: "#0F1412",
  superficie: "#172019",
  superficie2: "#1D2820",
  texto: "#E6ECE8",
  textoSuave: "#97A69E",
  borde: "#2A3730",
  acento: "#72C3A6",
  acentoSuave: "#1F3A30",
  sobreAcento: "#0D1A14",
  aviso: "#E3A857",
  avisoSuave: "#3A2C17",
  peligro: "#F08A80",
  peligroSuave: "#3D1E1B",
  sobrePeligro: "#2A0E0B",
};

// ¿El celular está en modo oscuro? Se decide al abrir la app.
export const esOscuro = Appearance.getColorScheme() === "dark";

export const colores = esOscuro ? oscuro : claro;

// Espacios entre elementos (en píxeles)
export const espacio = { xs: 4, s: 8, m: 12, l: 16, xl: 24 };

// Qué tan redondeadas son las esquinas
export const radio = { s: 10, m: 14, l: 18 };

// Tamaños de letra
export const letra = { chica: 13, normal: 15, subtitulo: 17, titulo: 22, grande: 40 };

// Tipografías (se cargan en app/_layout.js). Los textos comunes usan la letra del celular.
export const fuentes = {
  titulo: "BricolageGrotesque_700Bold",      // títulos
  numero: "BricolageGrotesque_800ExtraBold", // números grandes (plata)
};