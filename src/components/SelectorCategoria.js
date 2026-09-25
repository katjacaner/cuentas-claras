import { View, Text, Pressable, StyleSheet } from "react-native";
import { colores, espacio } from "../constants/tema";

// Muestra las categorías como botones. La elegida se pinta de verde.
export default function SelectorCategoria({ categorias, elegida, alElegir }) {
  return (
    <View style={styles.contenedor}>
      {categorias.map((c) => {
        const activa = c.id === elegida;
        return (
          <Pressable
            key={c.id}
            onPress={() => alElegir(c.id)}
            style={[styles.chip, activa && styles.chipActivo]}
          >
            <View style={[styles.punto, { backgroundColor: c.color }]} />
            <Text style={[styles.texto, activa && styles.textoActivo]}>{c.nombre}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: espacio.s,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colores.borde,
    backgroundColor: colores.superficie,
  },
  chipActivo: {
    backgroundColor: colores.acentoSuave,
    borderColor: colores.acento,
  },
  punto: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  texto: {
    fontSize: 14,
    fontWeight: "bold",
    color: colores.texto,
  },
  textoActivo: {
    color: colores.acento,
  },
});