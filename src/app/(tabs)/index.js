import { View, Text, StyleSheet, Button } from "react-native";
import { colores, espacio, letra } from "../../constants/tema";
import { formatearMonto, hoy, nombreDelMes, mesDe } from "../../utils/formato";
import { useDatos } from "../../context/DatosContext";
import { presupuestoDelMes, gastosDelMes, sumarMontos } from "../../logic/calculos";

export default function ResumenScreen() {
  const { datos, agregarGasto, borrarGasto, guardarPresupuesto } = useDatos();

  const mes = mesDe(hoy());
  const presupuesto = presupuestoDelMes(datos.presupuestos, mes);
  const gastosMes = gastosDelMes(datos.gastos, mes);
  const gastado = sumarMontos(gastosMes);
  const queda = presupuesto - gastado;

  function agregarPrueba() {
    agregarGasto({ monto: 35000, categoriaId: "comida", fecha: hoy(), descripcion: "Gasto de prueba" });
  }

  function borrarUltimo() {
    const ultimo = datos.gastos[datos.gastos.length - 1];
    if (ultimo) borrarGasto(ultimo.id);
  }

  return (
    <View style={styles.contenedor}>
      <Text style={styles.etiqueta}>{nombreDelMes(mes)}</Text>
      <Text style={styles.etiqueta}>Te quedan</Text>
      <Text style={styles.monto}>{formatearMonto(queda)}</Text>
      <Text style={styles.etiqueta}>
        Gastaste {formatearMonto(gastado)} de {formatearMonto(presupuesto)}
      </Text>
      <Text style={styles.etiqueta}>{gastosMes.length} gastos este mes</Text>

      {/* Botones de prueba: los vamos a sacar en la Parte 5 */}
      <View style={styles.pruebas}>
        <Button title="Poner presupuesto de ₲3.500.000" color={colores.acento} onPress={() => guardarPresupuesto(3500000, mes)} />
        <Button title="Agregar gasto de ₲35.000" color={colores.acento} onPress={agregarPrueba} />
        <Button title="Borrar el último gasto" color={colores.peligro} onPress={borrarUltimo} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: espacio.s,
    backgroundColor: colores.fondo,
  },
  etiqueta: {
    fontSize: letra.normal,
    color: colores.textoSuave,
  },
  monto: {
    fontSize: letra.grande,
    fontWeight: "bold",
    color: colores.texto,
  },
  pruebas: {
    marginTop: espacio.xl,
    gap: espacio.s,
  },
});