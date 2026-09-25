import { useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useDatos } from "../../context/DatosContext";
import { calcularDeuda } from "../../logic/deudas";
import { sumarMontos } from "../../logic/calculos";
import SelectorOpciones from "../../components/SelectorOpciones";
import TarjetaDeuda from "../../components/TarjetaDeuda";
import BotonPrincipal from "../../components/BotonPrincipal";
import { colores, espacio, letra } from "../../constants/tema";
import { formatearMonto, hoy, mesDe } from "../../utils/formato";

const TIPOS = [
  { valor: "debo", texto: "Debo" },
  { valor: "meDeben", texto: "Me deben" },
];

export default function DeudasScreen() {
  const { datos } = useDatos();
  const [tipo, setTipo] = useState("debo");
  const debo = tipo === "debo";

  // Cada deuda del tipo elegido, junto con sus cálculos
  const calculadas = datos.deudas
    .filter((d) => d.tipo === tipo)
    .map((d) => ({ deuda: d, calculo: calcularDeuda(d, datos) }));

  // Las que faltan pagar, de la que vence antes a la que vence después
  const activas = calculadas
    .filter((x) => x.calculo.estado !== "saldada")
    .sort((a, b) => a.calculo.vence.localeCompare(b.calculo.vence));

  const pendiente = sumarMontos(activas.map((x) => ({ monto: x.calculo.falta })));
  const esteMes = sumarMontos(
    activas
      .filter((x) => mesDe(x.calculo.vence) <= mesDe(hoy()))
      .map((x) => ({ monto: x.calculo.proximo }))
  );

  return (
    <View style={styles.pantalla}>
      <ScrollView contentContainerStyle={styles.contenido}>
        <SelectorOpciones opciones={TIPOS} elegida={tipo} alElegir={setTipo} />

        {calculadas.length === 0 ? (
          <Text style={styles.vacio}>{debo ? "No tenés deudas cargadas." : "No anotaste plata que te deban."}</Text>
        ) : (
          <>
            <View style={styles.resumen}>
              <Text style={styles.eyebrow}>{debo ? "Debés en total" : "Te deben en total"}</Text>
              <Text style={styles.total}>{formatearMonto(pendiente)}</Text>
              <Text style={styles.sub}>
                {debo ? "A pagar este mes: " : "A cobrar este mes: "}
                <Text style={styles.negrita}>{formatearMonto(esteMes)}</Text>
              </Text>
            </View>

            {activas.map((x) => (
              <TarjetaDeuda key={x.deuda.id} deuda={x.deuda} calculo={x.calculo} />
            ))}
          </>
        )}
      </ScrollView>

      <BotonPrincipal
        texto="+ Nueva deuda"
        alTocar={() => router.push({ pathname: "/deuda", params: { tipo } })}
      />
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
  vacio: {
    fontSize: letra.normal,
    color: colores.textoSuave,
    textAlign: "center",
    padding: espacio.xl,
  },
  resumen: {
    gap: 2,
    paddingVertical: espacio.s,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colores.textoSuave,
  },
  total: {
    fontSize: letra.grande,
    fontWeight: "bold",
    color: colores.texto,
  },
  sub: {
    fontSize: 14,
    color: colores.textoSuave,
  },
  negrita: {
    fontWeight: "bold",
    color: colores.texto,
  },
});
