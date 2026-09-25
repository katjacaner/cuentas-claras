import { useState } from "react";
import { ScrollView, Text, TextInput, Pressable, Alert, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import CampoMonto from "../components/CampoMonto";
import SelectorCategoria from "../components/SelectorCategoria";
import SelectorFecha from "../components/SelectorFecha";
import { useDatos } from "../context/DatosContext";
import { colores, espacio, letra, radio } from "../constants/tema";
import { hoy, miles, leerMonto } from "../utils/formato";

export default function GastoScreen() {
  const { id } = useLocalSearchParams();
  const { datos, agregarGasto, editarGasto, borrarGasto } = useDatos();

  // Si llegó un id, buscamos ese gasto para editarlo
  const gasto = datos.gastos.find((g) => g.id === id);
  const esEdicion = gasto !== undefined;

  // "Deudas" no se elige a mano: la usa la app para los pagos de deudas
  const categorias = datos.categorias.filter((c) => !c.delSistema);

  const [monto, setMonto] = useState(esEdicion ? miles(gasto.monto) : "");
  const [categoriaId, setCategoriaId] = useState(esEdicion ? gasto.categoriaId : categorias[0]?.id);
  const [fecha, setFecha] = useState(esEdicion ? gasto.fecha : hoy());
  const [descripcion, setDescripcion] = useState(esEdicion ? gasto.descripcion : "");
  const [error, setError] = useState("");

  function guardar() {
    const numero = leerMonto(monto);
    if (!(numero > 0)) {
      setError("Escribí un monto mayor a cero, por ejemplo 35.000.");
      return;
    }
    if (!categoriaId) {
      setError("Elegí una categoría.");
      return;
    }

    const datosDelGasto = { monto: numero, categoriaId, fecha, descripcion: descripcion.trim() };
    if (esEdicion) {
      editarGasto(gasto.id, datosDelGasto);
    } else {
      agregarGasto(datosDelGasto);
    }
    router.back();
  }

  function confirmarBorrado() {
    Alert.alert("¿Borrar este gasto?", "No se puede deshacer.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Borrar",
        style: "destructive",
        onPress: () => {
          borrarGasto(gasto.id);
          router.back();
        },
      },
    ]);
  }

  return (
    <ScrollView
      contentContainerStyle={styles.hoja}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
    >
      <Text style={styles.titulo}>{esEdicion ? "Editar gasto" : "Nuevo gasto"}</Text>

      <Text style={styles.etiqueta}>Monto</Text>
      <CampoMonto valor={monto} alCambiar={setMonto} autoFocus={!esEdicion} />

      <Text style={styles.etiqueta}>Categoría</Text>
      <SelectorCategoria categorias={categorias} elegida={categoriaId} alElegir={setCategoriaId} />

      <Text style={styles.etiqueta}>Fecha</Text>
      <SelectorFecha fecha={fecha} alCambiar={setFecha} />

      <Text style={styles.etiqueta}>Descripción (opcional)</Text>
      <TextInput
        style={styles.input}
        value={descripcion}
        onChangeText={setDescripcion}
        placeholder="Ej: Almuerzo"
        placeholderTextColor={colores.textoSuave}
        maxLength={60}
      />

      {error !== "" && <Text style={styles.error}>{error}</Text>}

      <Pressable style={({ pressed }) => [styles.boton, pressed && styles.presionado]} onPress={guardar}>
        <Text style={styles.botonTexto}>{esEdicion ? "Guardar cambios" : "Guardar gasto"}</Text>
      </Pressable>

      {esEdicion && (
        <Pressable style={styles.botonBorrar} onPress={confirmarBorrado}>
          <Text style={styles.botonBorrarTexto}>Borrar gasto</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hoja: {
    padding: espacio.xl,
    gap: espacio.s,
  },
  titulo: {
    fontSize: letra.titulo,
    fontWeight: "bold",
    color: colores.texto,
    marginBottom: espacio.s,
  },
  etiqueta: {
    fontSize: letra.chica,
    fontWeight: "bold",
    color: colores.textoSuave,
    marginTop: espacio.s,
  },
  input: {
    backgroundColor: colores.superficie2,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: radio.m,
    paddingHorizontal: espacio.l,
    paddingVertical: 12,
    fontSize: 16,
    color: colores.texto,
  },
  error: {
    fontSize: letra.chica,
    fontWeight: "bold",
    color: colores.peligro,
  },
  boton: {
    backgroundColor: colores.acento,
    borderRadius: radio.m,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: espacio.m,
  },
  presionado: {
    opacity: 0.85,
  },
  botonTexto: {
    color: colores.sobreAcento,
    fontSize: 16,
    fontWeight: "bold",
  },
  botonBorrar: {
    alignItems: "center",
    paddingVertical: 12,
  },
  botonBorrarTexto: {
    color: colores.peligro,
    fontSize: 15,
    fontWeight: "bold",
  },
});