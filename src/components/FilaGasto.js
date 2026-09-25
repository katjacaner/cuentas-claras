import { View, Text, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { colores, espacio } from "../constants/tema";
import { formatearMonto, etiquetaDia } from "../utils/formato";

// Una fila de la lista de gastos. Al tocarla se abre para editarla.
export default function FilaGasto({ gasto, categoria, mostrarFecha = true }) {
  function abrir() {
    router.push({ pathname: "/gasto", params: { id: gasto.id } });
  }

  return (
    <Pressable onPress={abrir} style={({ pressed }) => [styles.fila, pressed && styles.presionada]}>
      <View style={[styles.punto, { backgroundColor: categoria.color }]} />
      <View style={styles.textos}>
        <Text style={styles.descripcion} numberOfLines={1}>
          {gasto.descripcion || categoria.nombre}
        </Text>
        <Text style={styles.detalle}>
          {mostrarFecha ? `${categoria.nombre} · ${etiquetaDia(gasto.fecha)}` : categoria.nombre}
        </Text>
      </View>
      <Text style={styles.monto}>{formatearMonto(gasto.monto)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fila: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacio.m,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: colores.superficie,
    borderTopWidth: 1,
    borderTopColor: colores.borde,
  },
  presionada: {
    backgroundColor: colores.superficie2,
  },
  punto: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  textos: {
    flex: 1,
  },
  descripcion: {
    fontSize: 15,
    fontWeight: "bold",
    color: colores.texto,
  },
  detalle: {
    fontSize: 13,
    color: colores.textoSuave,
  },
  monto: {
    fontSize: 15,
    fontWeight: "bold",
    color: colores.texto,
  },
});