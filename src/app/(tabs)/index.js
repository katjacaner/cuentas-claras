import { ScrollView, View, Text, StyleSheet, Button } from "react-native";
import { colores, espacio, letra } from "../../constants/tema";
import { hoy, nombreDelMes, mesDe } from "../../utils/formato";
import { useDatos } from "../../context/DatosContext";
import { presupuestoDelMes, gastosDelMes, sumarMontos } from "../../logic/calculos";
import TarjetaSaldo from "../../components/TarjetaSaldo";

export default function ResumenScreen() {
  const { datos, agregarGasto, borrarGasto } = useDatos();

  const mes = mesDe(hoy());
  const presupuesto = presupuestoDelMes(datos.presupuestos, mes);
  const gastosMes = gastosDelMes(datos.gastos, mes);
  const gastado = sumarMontos(gastosMes);

  function agregarPrueba() {
    agregarGasto({ monto: 35000, categoriaId: "comida", fecha: hoy(), descripcion: "Gasto de prueba" });
  }

  function borrarUltimo() {
    const ultimo = datos.gastos[datos.gastos.length - 1];
    if (ultimo) borrarGasto(ultimo.id);
  }

  return (
    <ScrollView style={styles.pantalla} contentContainerStyle={styles.contenido}>
      <Text style={styles.mes}>{nombreDelMes(mes)}</Text>

      <TarjetaSaldo presupuesto={presupuesto} gastado={gastado} />

      <Text style={styles.etiqueta}>{gastosMes.length} gastos este mes</Text>

      {/* Botones de prueba: se van en la Parte 5B */}
      <View style={styles.pruebas}>
        <Button title="Agregar gasto de ₲35.000" color={colores.acento} onPress={agregarPrueba} />
        <Button title="Borrar el último gasto" color={colores.peligro} onPress={borrarUltimo} />
      </View>
    </ScrollView>
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
  etiqueta: {
    fontSize: letra.normal,
    color: colores.textoSuave,
    textAlign: "center",
  },
  pruebas: {
    marginTop: espacio.xl,
    gap: espacio.s,
  },
});