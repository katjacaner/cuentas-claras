import { View, Text, StyleSheet } from "react-native";
import { colores, espacio, letra, radio } from "../constants/tema";
import { formatearMonto } from "../utils/formato";

// Barras horizontales: cuánto se gastó en cada categoría
export default function GraficoCategorias({ totales }) {
  if (totales.length === 0) return null;

  const mayor = totales[0].total;

  return (
    <View style={styles.panel}>
      <Text style={styles.titulo}>Por categoría</Text>
      <Text style={styles.subtitulo}>
        Donde más gastaste: <Text style={styles.negrita}>{totales[0].categoria.nombre}</Text>
      </Text>

      {totales.map(({ categoria, total, porcentaje }) => (
        <View key={categoria.id} style={styles.fila}>
          <View style={styles.etiquetas}>
            <View style={styles.nombre}>
              <View style={[styles.punto, { backgroundColor: categoria.color }]} />
              <Text style={styles.texto}>{categoria.nombre}</Text>
            </View>
            <Text style={styles.monto}>
              {formatearMonto(total)} · {porcentaje}%
            </Text>
          </View>
          <View style={styles.barra}>
            <View style={[styles.relleno, { width: `${(total / mayor) * 100}%`, backgroundColor: categoria.color }]} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colores.superficie,
    borderRadius: radio.l,
    borderWidth: 1,
    borderColor: colores.borde,
    padding: espacio.l,
    gap: espacio.m,
  },
  titulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: colores.texto,
  },
  subtitulo: {
    fontSize: letra.chica,
    color: colores.textoSuave,
    marginTop: -espacio.s,
  },
  negrita: {
    fontWeight: "bold",
    color: colores.texto,
  },
  fila: {
    gap: 6,
  },
  etiquetas: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nombre: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacio.s,
  },
  punto: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  texto: {
    fontSize: 14,
    color: colores.texto,
  },
  monto: {
    fontSize: 13,
    color: colores.textoSuave,
  },
  barra: {
    height: 10,
    borderRadius: 5,
    backgroundColor: colores.superficie2,
    overflow: "hidden",
  },
  relleno: {
    height: 10,
    borderRadius: 5,
  },
});