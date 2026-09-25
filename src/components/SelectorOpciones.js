import { View, Text, Pressable, StyleSheet } from "react-native";
import { colores, radio } from "../constants/tema";

// Botones pegados para elegir UNA opción, por ejemplo "Debo" / "Me deben"
// opciones: [{ valor: "debo", texto: "Debo" }, ...]
export default function SelectorOpciones({ opciones, elegida, alElegir, deshabilitado = false }) {
  return (
    <View style={[styles.contenedor, deshabilitado && styles.deshabilitado]}>
      {opciones.map((o) => {
        const activa = o.valor === elegida;
        return (
          <Pressable
            key={o.valor}
            onPress={() => alElegir(o.valor)}
            disabled={deshabilitado}
            style={[styles.opcion, activa && styles.opcionActiva]}
          >
            <Text style={[styles.texto, activa && styles.textoActivo]}>{o.texto}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flexDirection: "row",
    gap: 4,
    padding: 4,
    backgroundColor: colores.superficie2,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: radio.m,
  },
  deshabilitado: {
    opacity: 0.5,
  },
  opcion: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  opcionActiva: {
    backgroundColor: colores.superficie,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  texto: {
    fontSize: 15,
    fontWeight: "bold",
    color: colores.textoSuave,
  },
  textoActivo: {
    color: colores.texto,
  },
});