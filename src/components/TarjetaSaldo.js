import { View, Text, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { colores, espacio, letra, radio } from "../constants/tema";
import { formatearMonto } from "../utils/formato";

// esMesActual: si es false, estamos mirando un mes pasado (no se puede editar el presupuesto)
export default function TarjetaSaldo({ presupuesto, gastado, esMesActual = true }) {
  function abrirPresupuesto() {
    router.push("/presupuesto");
  }

  // No hay presupuesto para este mes
  if (presupuesto === 0) {
    if (!esMesActual) {
      return (
        <View style={styles.tarjeta}>
          <Text style={styles.detalle}>No tenías un presupuesto configurado en este mes.</Text>
          <Text style={styles.detalle}>
            Gastaste <Text style={styles.negrita}>{formatearMonto(gastado)}</Text>
          </Text>
        </View>
      );
    }
    return (
      <Pressable style={({ pressed }) => [styles.tarjeta, pressed && styles.presionado]} onPress={abrirPresupuesto}>
        <Text style={styles.detalle}>Todavía no configuraste cuánto tenés para gastar por mes.</Text>
        <Text style={styles.enlace}>Configurar presupuesto ›</Text>
      </Pressable>
    );
  }

  const queda = presupuesto - gastado;
  const pasado = queda < 0;
  const porcentaje = Math.round((gastado / presupuesto) * 100);
  const anchoBarra = Math.min(porcentaje, 100);

  let titulo = "Te quedan";
  if (pasado) titulo = "Te pasaste por";
  else if (!esMesActual) titulo = "Te sobraron";

  return (
    <Pressable
      style={({ pressed }) => [styles.tarjeta, pressed && styles.presionado]}
      onPress={abrirPresupuesto}
      disabled={!esMesActual}
    >
      <Text style={styles.etiqueta}>{titulo}</Text>
      <Text style={[styles.monto, pasado && styles.rojo]}>{formatearMonto(Math.abs(queda))}</Text>

      <View style={styles.barra}>
        <View style={[styles.relleno, { width: `${anchoBarra}%` }, pasado && styles.rellenoRojo]} />
      </View>

      <Text style={styles.detalle}>
        Gastaste <Text style={styles.negrita}>{formatearMonto(gastado)}</Text> de {formatearMonto(presupuesto)} · {porcentaje}%
      </Text>
      {esMesActual && <Text style={styles.enlace}>Editar presupuesto ›</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: colores.superficie,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: radio.l,
    padding: 18,
    gap: espacio.s,
  },
  presionado: {
    borderColor: colores.acento,
  },
  etiqueta: {
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colores.textoSuave,
  },
  monto: {
    fontSize: letra.grande,
    fontWeight: "bold",
    color: colores.texto,
  },
  rojo: {
    color: colores.peligro,
  },
  barra: {
    height: 10,
    borderRadius: 5,
    backgroundColor: colores.superficie2,
    overflow: "hidden",
  },
  relleno: {
    height: 10,
    borderRadius: 5,
    backgroundColor: colores.acento,
  },
  rellenoRojo: {
    backgroundColor: colores.peligro,
  },
  detalle: {
    fontSize: letra.normal,
    color: colores.textoSuave,
  },
  negrita: {
    fontWeight: "bold",
    color: colores.texto,
  },
  enlace: {
    fontSize: letra.chica,
    fontWeight: "bold",
    color: colores.acento,
  },
});