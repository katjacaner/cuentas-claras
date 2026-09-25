import { View, ScrollView, Text, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { colores, espacio, letra, radio } from "../../constants/tema";
import { hoy, nombreDelMes, mesDe } from "../../utils/formato";
import { useDatos } from "../../context/DatosContext";
import {
  presupuestoDelMes,
  gastosDelMes,
  sumarMontos,
  buscarCategoria,
  ordenarPorFecha,
  totalesPorCategoria,
} from "../../logic/calculos";
import TarjetaSaldo from "../../components/TarjetaSaldo";
import GraficoCategorias from "../../components/GraficoCategorias";
import FilaGasto from "../../components/FilaGasto";
import BotonPrincipal from "../../components/BotonPrincipal";

export default function ResumenScreen() {
  const { datos } = useDatos();

  const mes = mesDe(hoy());
  const presupuesto = presupuestoDelMes(datos.presupuestos, mes);
  const gastosMes = gastosDelMes(datos.gastos, mes);
  const gastado = sumarMontos(gastosMes);
  const totales = totalesPorCategoria(gastosMes, datos.categorias);
  const ultimos = ordenarPorFecha(gastosMes).slice(0, 3);

  return (
    <View style={styles.pantalla}>
      <ScrollView contentContainerStyle={styles.contenido}>
        <Text style={styles.mes}>{nombreDelMes(mes)}</Text>

        <TarjetaSaldo presupuesto={presupuesto} gastado={gastado} />

        <GraficoCategorias totales={totales} />

        <View style={styles.panel}>
          <View style={styles.cabecera}>
            <Text style={styles.panelTitulo}>
              Últimos gastos <Text style={styles.cantidad}>· {gastosMes.length} este mes</Text>
            </Text>
            <Pressable onPress={() => router.navigate("/gastos")} hitSlop={8}>
              <Text style={styles.verTodos}>Ver todos ›</Text>
            </Pressable>
          </View>
          {ultimos.length === 0 ? (
            <Text style={styles.vacio}>Todavía no registraste gastos este mes.</Text>
          ) : (
            ultimos.map((g) => (
              <FilaGasto key={g.id} gasto={g} categoria={buscarCategoria(datos.categorias, g.categoriaId)} />
            ))
          )}
        </View>
      </ScrollView>

      <BotonPrincipal texto="+ Registrar gasto" alTocar={() => router.push("/gasto")} />
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
  cabecera: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
  },
  panelTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: colores.texto,
  },
  cantidad: {
    fontSize: letra.chica,
    fontWeight: "normal",
    color: colores.textoSuave,
  },
  verTodos: {
    fontSize: letra.chica,
    fontWeight: "bold",
    color: colores.acento,
  },
  vacio: {
    fontSize: letra.normal,
    color: colores.textoSuave,
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
});