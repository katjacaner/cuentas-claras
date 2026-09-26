import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import CampoMonto from "../components/CampoMonto";
import { useDatos } from "../context/DatosContext";
import { presupuestoDelMes } from "../logic/calculos";
import { colores, espacio, letra, radio, fuentes } from "../constants/tema";
import { hoy, mesDe, miles, leerMonto } from "../utils/formato";

export default function PresupuestoScreen() {
  const { datos, guardarPresupuesto } = useDatos();
  const mes = mesDe(hoy());
  const actual = presupuestoDelMes(datos.presupuestos, mes);

  const [texto, setTexto] = useState(actual > 0 ? miles(actual) : "");
  const [error, setError] = useState("");

  function guardar() {
    const monto = leerMonto(texto);
    if (!(monto > 0)) {
      setError("Escribí un monto mayor a cero, por ejemplo 3.500.000.");
      return;
    }
    guardarPresupuesto(monto, mes);
    router.back();
  }

  return (
    <View style={styles.hoja}>
      <Text style={styles.titulo}>Presupuesto mensual</Text>
      <Text style={styles.etiqueta}>¿Cuánto tenés para gastar por mes?</Text>

      <CampoMonto valor={texto} alCambiar={setTexto} autoFocus />

      <Text style={styles.nota}>Se repite todos los meses hasta que lo cambies.</Text>
      {error !== "" && <Text style={styles.error}>{error}</Text>}

      <Pressable
        style={({ pressed }) => [styles.boton, pressed && styles.presionado]}
        onPress={guardar}
      >
        <Text style={styles.botonTexto}>Guardar presupuesto</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  hoja: {
    padding: espacio.xl,
    gap: espacio.m,
    backgroundColor: colores.superficie,
  },
    titulo: {
    fontSize: letra.titulo,
    fontFamily: fuentes.titulo,
    color: colores.texto,
  },
  etiqueta: {
    fontSize: letra.normal,
    fontWeight: "600",
    color: colores.textoSuave,
  },
  nota: {
    fontSize: letra.chica,
    color: colores.textoSuave,
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
    marginTop: espacio.s,
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