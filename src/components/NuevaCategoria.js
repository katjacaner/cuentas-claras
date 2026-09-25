import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useDatos } from "../context/DatosContext";
import { colores, espacio, letra, radio } from "../constants/tema";

// "+ Nueva categoría": al tocarlo aparece un campo para escribir el nombre.
// alCrear (opcional): qué hacer con la categoría recién creada
export default function NuevaCategoria({ alCrear }) {
  const { agregarCategoria } = useDatos();
  const [abierto, setAbierto] = useState(false);
  const [nombre, setNombre] = useState("");
  const [error, setError] = useState("");

  function crear() {
    const resultado = agregarCategoria(nombre);
    if (resultado.error) {
      setError(resultado.error);
      return;
    }
    setNombre("");
    setError("");
    setAbierto(false);
    if (alCrear) alCrear(resultado.categoria);
  }

  // Cerrado: solo el botón
  if (!abierto) {
    return (
      <Pressable style={styles.chip} onPress={() => setAbierto(true)}>
        <Text style={styles.chipTexto}>+ Nueva categoría</Text>
      </Pressable>
    );
  }

  // Abierto: campo para escribir + botón Agregar
  return (
    <View style={styles.bloque}>
      <View style={styles.fila}>
        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Ej: Salud, Mascotas"
          placeholderTextColor={colores.textoSuave}
          maxLength={20}
          autoFocus
          returnKeyType="done"
          onSubmitEditing={crear}
        />
        <Pressable style={({ pressed }) => [styles.boton, pressed && styles.presionado]} onPress={crear}>
          <Text style={styles.botonTexto}>Agregar</Text>
        </Pressable>
      </View>
      {error !== "" && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colores.acento,
  },
  chipTexto: {
    fontSize: 14,
    fontWeight: "bold",
    color: colores.acento,
  },
  bloque: {
    gap: espacio.xs,
  },
  fila: {
    flexDirection: "row",
    gap: espacio.s,
  },
  input: {
    flex: 1,
    backgroundColor: colores.superficie2,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: radio.m,
    paddingHorizontal: espacio.m,
    paddingVertical: 10,
    fontSize: 16,
    color: colores.texto,
  },
  boton: {
    backgroundColor: colores.acento,
    borderRadius: radio.m,
    paddingHorizontal: espacio.l,
    justifyContent: "center",
  },
  presionado: {
    opacity: 0.85,
  },
  botonTexto: {
    color: colores.sobreAcento,
    fontSize: 15,
    fontWeight: "bold",
  },
  error: {
    fontSize: letra.chica,
    fontWeight: "bold",
    color: colores.peligro,
  },
});
