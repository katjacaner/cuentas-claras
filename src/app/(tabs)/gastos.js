import { View, Text, SectionList, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useDatos } from "../../context/DatosContext";
import { agruparPorDia, buscarCategoria } from "../../logic/calculos";
import { etiquetaDia, formatearMonto } from "../../utils/formato";
import { colores, espacio, letra } from "../../constants/tema";
import FilaGasto from "../../components/FilaGasto";
import BotonPrincipal from "../../components/BotonPrincipal";

export default function GastosScreen() {
  const { datos } = useDatos();
  const dias = agruparPorDia(datos.gastos);

  return (
    <View style={styles.pantalla}>
      <SectionList
        sections={dias}
        keyExtractor={(g) => g.id}
        ListHeaderComponent={
          <Text style={styles.resumen}>
            {datos.gastos.length} gastos en total · tocá uno para editarlo
          </Text>
        }
        ListEmptyComponent={<Text style={styles.vacio}>Todavía no registraste gastos.</Text>}
        renderSectionHeader={({ section }) => (
          <View style={styles.dia}>
            <Text style={styles.diaTexto}>{etiquetaDia(section.fecha)}</Text>
            <Text style={styles.diaTexto}>{formatearMonto(section.total)}</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <FilaGasto
            gasto={item}
            categoria={buscarCategoria(datos.categorias, item.categoriaId)}
            mostrarFecha={false}
          />
        )}
      />

      <BotonPrincipal texto="+ Registrar gasto" alTocar={() => router.push("/gasto")} />
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: colores.fondo,
  },
  resumen: {
    fontSize: letra.chica,
    color: colores.textoSuave,
    padding: espacio.l,
  },
  vacio: {
    fontSize: letra.normal,
    color: colores.textoSuave,
    textAlign: "center",
    padding: espacio.xl,
  },
  dia: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colores.fondo,
    paddingHorizontal: espacio.l,
    paddingTop: espacio.l,
    paddingBottom: espacio.s,
  },
  diaTexto: {
    fontSize: letra.chica,
    fontWeight: "bold",
    color: colores.textoSuave,
  },
});