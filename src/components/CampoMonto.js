import { View, Text, TextInput, StyleSheet } from "react-native";
import { colores, espacio, radio } from "../constants/tema";
import { miles, leerMonto } from "../utils/formato";

// Campo para escribir plata: muestra "₲" y agrega los puntos de miles mientras escribís
export default function CampoMonto({ valor, alCambiar, autoFocus }) {
  function cambiarTexto(texto) {
    const numero = leerMonto(texto);
    alCambiar(isNaN(numero) ? "" : miles(numero));
  }

  return (
    <View style={styles.caja}>
      <Text style={styles.simbolo}>₲</Text>
      <TextInput
        style={styles.input}
        value={valor}
        onChangeText={cambiarTexto}
        keyboardType="number-pad"
        placeholder="0"
        placeholderTextColor={colores.textoSuave}
        maxLength={15}
        autoFocus={autoFocus}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  caja: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacio.s,
    backgroundColor: colores.superficie2,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: radio.m,
    paddingHorizontal: espacio.l,
    paddingVertical: espacio.s,
  },
  simbolo: {
    fontSize: 26,
    color: colores.textoSuave,
  },
  input: {
    flex: 1,
    fontSize: 30,
    fontWeight: "bold",
    color: colores.texto,
    paddingVertical: espacio.xs,
  },
});