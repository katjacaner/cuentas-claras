import { View, Text, Pressable, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colores, espacio, letra } from "../constants/tema";
import { hoy, mesDe, moverMes, nombreDelMes } from "../utils/formato";

// ‹ Septiembre 2026 ›   No deja pasar del mes actual.
// Tocando el nombre del mes, vuelve al mes actual.
export default function SelectorMes({ mes, alCambiar }) {
  const mesActual = mesDe(hoy());
  const esMesActual = mes >= mesActual;

  return (
    <View style={styles.fila}>
      <Pressable
        onPress={() => alCambiar(moverMes(mes, -1))}
        style={styles.flecha}
        hitSlop={8}
        accessibilityLabel="Mes anterior"
      >
        <Ionicons name="chevron-back" size={24} color={colores.texto} />
      </Pressable>

      <Pressable onPress={() => alCambiar(mesActual)} disabled={esMesActual} style={styles.centro}>
        <Text style={styles.texto}>{nombreDelMes(mes)}</Text>
        {!esMesActual && <Text style={styles.volver}>Volver al mes actual</Text>}
      </Pressable>

      <Pressable
        onPress={() => alCambiar(moverMes(mes, 1))}
        disabled={esMesActual}
        style={[styles.flecha, esMesActual && styles.apagada]}
        hitSlop={8}
        accessibilityLabel="Mes siguiente"
      >
        <Ionicons name="chevron-forward" size={24} color={colores.texto} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  fila: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  flecha: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  apagada: {
    opacity: 0.3,
  },
  centro: {
    alignItems: "center",
  },
  texto: {
    fontSize: 20,
    fontWeight: "bold",
    color: colores.texto,
  },
  volver: {
    fontSize: letra.chica,
    fontWeight: "bold",
    color: colores.acento,
    marginTop: espacio.xs,
  },
});
