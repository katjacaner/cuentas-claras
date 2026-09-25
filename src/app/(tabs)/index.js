import { View, ScrollView, Text, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { colores, espacio, letra, radio } from "../../constants/tema";
import { hoy, nombreDelMes, mesDe } from "../../utils/formato";
import { useDatos } from "../../context/DatosContext";
import { presupuestoDelMes, gastosDelMes, sumarMontos, buscarCategoria, ordenarPorFecha } from "../../logic/calculos";
import TarjetaSaldo from "../../components/TarjetaSaldo";
import FilaGasto from "../../components/FilaGasto";

export default function ResumenScreen() {
  const { datos } = useDatos();

  const mes = mesDe(hoy());
  const presupuesto = presupuestoDelMes(datos.presupuestos, mes);
  const gastosMes = gastosDelMes(datos.gastos, mes);
  const gastado = sumarMontos(gastosMes);
  const ultimos = ordenarPorFecha(gastosMes).slice(0, 3);

  return (
    <View style={styles.pantalla}>
      <ScrollView contentContainerStyle={styles.contenido}>
        <Text style={styles.mes}>{nombreDelMes(mes)}</Text>

        <TarjetaSaldo presupuesto={presupuesto} gastado={gastado} />

        <View style={styles.panel}>
          <Text style={styles.panelTitulo}>
            Últimos gastos <Text style={styles.cantidad}>· {gastosMes.length} este mes</Text>
          </Text>
          {ultimos.length === 0 ? (
            <Text style={styles.vacio}>Todavía no registraste gastos este mes.</Text>
          ) : (
            ultimos.map((g) => (
              <FilaGasto key={g.id} gasto={g} categoria={buscarCategoria(datos.categorias, g.categoriaId)} />
            ))
          )}
        </View>
      </ScrollView>

      <Pressable
        style={({ pressed }) => [styles.botonRegistrar, pressed && styles.presionado]}
        onPress={() => router.push("/gasto")}
      >
        <Text style={styles.botonTexto}>+ Registrar gasto</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  contenido: {
    padding: espacio.l,
    gap: espacio.m,
  },
  mes: {
    fontSize: 20,
    fontWeight: "bold",
    color: colores.texto,
    textAlign: "center",
  },
  panel: {
    backgroundColor: colores.superficie,
    borderRadius: radio.l,
    borderWidth: 1,
    borderColor: colores.borde,
    overflow: "hidden",
  },
  panelTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: colores.texto,
    padding: 14,
  },
  cantidad: {
    fontSize: letra.chica,
    fontWeight: "normal",
    color: colores.textoSuave,
  },
  vacio: {
    fontSize: letra.normal,
    color: colores.textoSuave,
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  botonRegistrar: {
    backgroundColor: colores.acento,
    borderRadius: radio.m,
    paddingVertical: 16,
    alignItems: "center",
    margin: espacio.l,
  },
  presionado: {
    opacity: 0.85,
  },
  botonTexto: {
    color: colores.sobreAcento,
    fontSize: 16,
    fontWeight: "bold",
  },
});