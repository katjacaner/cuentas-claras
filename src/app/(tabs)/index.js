import { View, Text, StyleSheet } from "react-native";
import { colores, espacio, letra } from "../../constants/tema";
import { formatearMonto, hoy, fechaCorta, nombreDelMes, mesDe } from "../../utils/formato";

export default function ResumenScreen() {
  const fechaDeHoy = hoy();

  return (
    <View style={styles.contenedor}>
      <Text style={styles.etiqueta}>{nombreDelMes(mesDe(fechaDeHoy))}</Text>
      <Text style={styles.monto}>{formatearMonto(3500000)}</Text>
      <Text style={styles.etiqueta}>Hoy es {fechaCorta(fechaDeHoy)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: espacio.s,
    backgroundColor: colores.fondo,
  },
  etiqueta: {
    fontSize: letra.normal,
    color: colores.textoSuave,
  },
  monto: {
    fontSize: letra.grande,
    fontWeight: "bold",
    color: colores.texto,
  },
});