import { View, Text, Pressable, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colores, espacio, radio } from "../constants/tema";
import { hoy, sumarDias, etiquetaDia } from "../utils/formato";

// Elegir la fecha día por día con flechas.
// Por defecto no deja elegir días futuros (para gastos). Con permitirFuturo sí (para deudas).
export default function SelectorFecha({ fecha, alCambiar, permitirFuturo = false }) {
  const bloquearSiguiente = !permitirFuturo && fecha >= hoy();

  return (
    <View style={styles.caja}>
      <Pressable
        onPress={() => alCambiar(sumarDias(fecha, -1))}
        style={styles.flecha}
        hitSlop={8}
        accessibilityLabel="Día anterior"
      >
        <Ionicons name="chevron-back" size={22} color={colores.texto} />
      </Pressable>

      <Text style={styles.texto}>{etiquetaDia(fecha)}</Text>

      <Pressable
        onPress={() => alCambiar(sumarDias(fecha, 1))}
        disabled={bloquearSiguiente}
        style={[styles.flecha, bloquearSiguiente && styles.apagada]}
        hitSlop={8}
        accessibilityLabel="Día siguiente"
      >
        <Ionicons name="chevron-forward" size={22} color={colores.texto} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  caja: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colores.superficie2,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: radio.m,
    padding: espacio.xs,
  },
  flecha: {
    width: 44,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  apagada: {
    opacity: 0.3,
  },
  texto: {
    fontSize: 16,
    fontWeight: "bold",
    color: colores.texto,
  },
});
