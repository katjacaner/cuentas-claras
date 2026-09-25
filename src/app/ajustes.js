import { ScrollView, View, Text, Pressable, Alert, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useDatos } from "../context/DatosContext";
import { presupuestoDelMes } from "../logic/calculos";
import NuevaCategoria from "../components/NuevaCategoria";
import { colores, espacio, letra, radio } from "../constants/tema";
import { formatearMonto, hoy, mesDe } from "../utils/formato";

export default function AjustesScreen() {
  const { datos, borrarCategoria } = useDatos();

  const presupuesto = presupuestoDelMes(datos.presupuestos, mesDe(hoy()));
  const categorias = datos.categorias.filter((c) => !c.delSistema);

  function cantidadDeGastos(id) {
    return datos.gastos.filter((g) => g.categoriaId === id).length;
  }

  function quitar(categoria) {
    const cantidad = cantidadDeGastos(categoria.id);

    if (cantidad > 0) {
      Alert.alert(
        "No se puede quitar",
        `"${categoria.nombre}" tiene ${cantidad} ${cantidad === 1 ? "gasto" : "gastos"}. ` +
          `Para quitarla, primero cambiá ${cantidad === 1 ? "ese gasto" : "esos gastos"} a otra categoría.`
      );
      return;
    }

    Alert.alert(`¿Quitar "${categoria.nombre}"?`, "Podés volver a crearla cuando quieras.", [
      { text: "Cancelar", style: "cancel" },
      { text: "Quitar", style: "destructive", onPress: () => borrarCategoria(categoria.id) },
    ]);
  }

  return (
    <ScrollView
      contentContainerStyle={styles.hoja}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
    >
      <Text style={styles.titulo}>Ajustes</Text>

      {/* Presupuesto */}
      <View style={styles.panel}>
        <Text style={styles.panelTitulo}>Presupuesto mensual</Text>
        <View style={styles.fila}>
          <Text style={styles.textoSuave}>Por mes</Text>
          <Text style={styles.negrita}>{presupuesto > 0 ? formatearMonto(presupuesto) : "Sin configurar"}</Text>
        </View>
        <Pressable style={styles.botonSecundario} onPress={() => router.push("/presupuesto")}>
          <Text style={styles.botonSecundarioTexto}>Cambiar presupuesto</Text>
        </Pressable>
      </View>

      {/* Categorías */}
      <View style={styles.panel}>
        <Text style={styles.panelTitulo}>Categorías</Text>

        {categorias.map((c) => {
          const cantidad = cantidadDeGastos(c.id);
          return (
            <View key={c.id} style={styles.categoria}>
              <View style={[styles.punto, { backgroundColor: c.color }]} />
              <Text style={styles.categoriaNombre}>{c.nombre}</Text>
              <Text style={styles.textoSuave}>
                {cantidad} {cantidad === 1 ? "gasto" : "gastos"}
              </Text>
              <Pressable onPress={() => quitar(c)} hitSlop={8}>
                <Text style={styles.quitar}>Quitar</Text>
              </Pressable>
            </View>
          );
        })}

        <NuevaCategoria />

        <Text style={styles.nota}>
          Solo se puede quitar una categoría que no tenga gastos. La categoría "Deudas" la usa la app para los pagos
          de deudas y no aparece acá.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hoja: {
    padding: espacio.xl,
    gap: espacio.l,
  },
  titulo: {
    fontSize: letra.titulo,
    fontWeight: "bold",
    color: colores.texto,
  },
  panel: {
    backgroundColor: colores.fondo,
    borderRadius: radio.l,
    padding: espacio.l,
    gap: espacio.m,
  },
  panelTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: colores.texto,
  },
  fila: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  textoSuave: {
    fontSize: 14,
    color: colores.textoSuave,
  },
  negrita: {
    fontSize: 14,
    fontWeight: "bold",
    color: colores.texto,
  },
  botonSecundario: {
    borderWidth: 1,
    borderColor: colores.borde,
    backgroundColor: colores.superficie,
    borderRadius: radio.s,
    paddingVertical: 12,
    alignItems: "center",
  },
  botonSecundarioTexto: {
    fontSize: 14,
    fontWeight: "bold",
    color: colores.texto,
  },
  categoria: {
    flexDirection: "row",
    alignItems: "center",
    gap: espacio.s,
    paddingVertical: espacio.xs,
  },
  punto: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  categoriaNombre: {
    flex: 1,
    fontSize: 15,
    color: colores.texto,
  },
  quitar: {
    fontSize: 14,
    fontWeight: "bold",
    color: colores.peligro,
    marginLeft: espacio.s,
  },
  nota: {
    fontSize: 12,
    color: colores.textoSuave,
  },
});