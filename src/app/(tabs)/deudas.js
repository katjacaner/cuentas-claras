import { useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useDatos } from "../../context/DatosContext";
import { calcularDeuda, contarUrgentes } from "../../logic/deudas";
import { sumarMontos } from "../../logic/calculos";
import SelectorOpciones from "../../components/SelectorOpciones";
import TarjetaDeuda from "../../components/TarjetaDeuda";
import BotonPrincipal from "../../components/BotonPrincipal";
import { colores, espacio, letra } from "../../constants/tema";
import { formatearMonto, hoy, mesDe } from "../../utils/formato";

export default function DeudasScreen() {
  const { datos } = useDatos();
  const [tipo, setTipo] = useState("debo");
  const [verTerminadas, setVerTerminadas] = useState(false);
  const debo = tipo === "debo";

  // Las opciones de arriba, con un globito si hay deudas vencidas o por vencer
  const opciones = [
    { valor: "debo", texto: "Debo", aviso: contarUrgentes(datos, "debo") },
    { valor: "meDeben", texto: "Me deben", aviso: contarUrgentes(datos, "meDeben") },
  ];

  // Cada deuda del tipo elegido, junto con sus cálculos
  const calculadas = datos.deudas
    .filter((d) => d.tipo === tipo)
    .map((d) => ({ deuda: d, calculo: calcularDeuda(d, datos) }));

  // Las que faltan pagar, de la que vence antes a la que vence después
  const activas = calculadas
    .filter((x) => x.calculo.estado !== "saldada")
    .sort((a, b) => a.calculo.vence.localeCompare(b.calculo.vence));

  // Las que ya se terminaron de pagar
  const terminadas = calculadas.filter((x) => x.calculo.estado === "saldada");

  const pendiente = sumarMontos(activas.map((x) => ({ monto: x.calculo.falta })));
  const esteMes = sumarMontos(
    activas
      .filter((x) => mesDe(x.calculo.vence) <= mesDe(hoy()))
      .map((x) => ({ monto: x.calculo.proximo }))
  );

  return (
    <View style={styles.pantalla}>
      <ScrollView contentContainerStyle={styles.contenido}>
        <SelectorOpciones opciones={opciones} elegida={tipo} alElegir={setTipo} />

        {calculadas.length === 0 ? (
          <Text style={styles.vacio}>{debo ? "No tenés deudas cargadas." : "No anotaste plata que te deban."}</Text>
        ) : (
          <>
            <View style={styles.resumen}>
              <Text style={styles.eyebrow}>{debo ? "Debés en total" : "Te deben en total"}</Text>
              <Text style={styles.total}>{formatearMonto(pendiente)}</Text>
              <Text style={styles.sub}>
                {activas.length === 0 ? (
                  debo ? "No tenés deudas pendientes." : "Ya te devolvieron todo."
                ) : (
                  <>
                    {debo ? "A pagar este mes: " : "A cobrar este mes: "}
                    <Text style={styles.negrita}>{formatearMonto(esteMes)}</Text>
                  </>
                )}
              </Text>
            </View>

            {activas.map((x) => (
              <TarjetaDeuda key={x.deuda.id} deuda={x.deuda} calculo={x.calculo} />
            ))}

            {terminadas.length > 0 && (
              <Pressable style={styles.plegable} onPress={() => setVerTerminadas(!verTerminadas)}>
                <Text style={styles.plegableTexto}>Terminadas ({terminadas.length})</Text>
                <Ionicons name={verTerminadas ? "chevron-up" : "chevron-down"} size={18} color={colores.textoSuave} />
              </Pressable>
            )}

            {verTerminadas &&
              terminadas.map((x) => <TarjetaDeuda key={x.deuda.id} deuda={x.deuda} calculo={x.calculo} />)}
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
  plegable: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colores.borde,
    paddingTop: espacio.l,
    paddingHorizontal: espacio.xs,
  },
  plegableTexto: {
    fontSize: 14,
    fontWeight: "bold",
    color: colores.textoSuave,
  },
});