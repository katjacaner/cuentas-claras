import { Pressable, Text, StyleSheet } from "react-native";
import { colores, espacio, radio } from "../constants/tema";

// El botón verde grande de abajo (ej: "+ Registrar gasto")
export default function BotonPrincipal({ texto, alTocar }) {
  return (
    <Pressable style={({ pressed }) => [styles.boton, pressed && styles.presionado]} onPress={alTocar}>
      <Text style={styles.texto}>{texto}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  boton: {
    backgroundColor: colores.acento,
    borderRadius: radio.m,
    paddingVertical: 16,
    alignItems: "center",
    margin: espacio.l,
  },
  presionado: {
    opacity: 0.85,
  },
  texto: {
    color: colores.sobreAcento,
    fontSize: 16,
    fontWeight: "bold",
  },
});