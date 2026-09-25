import { useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useDatos } from "../../context/DatosContext";
import SelectorOpciones from "../../components/SelectorOpciones";
import BotonPrincipal from "../../components/BotonPrincipal";
import { colores, espacio, letra, radio } from "../../constants/tema";
import { formatearMonto, fechaCorta } from "../../utils/formato";

const TIPOS = [
  { valor: "debo", texto: "Debo" },
  { valor: "meDeben", texto: "Me deben" },
];

export default function DeudasScreen() {
  const { datos } = useDatos();
  const [tipo, setTipo] = useState("debo");

  const lista = datos.deudas.filter((d) => d.tipo === tipo);

  return (
    <View style={styles.pantalla}>
      <ScrollView contentContainerStyle={styles.contenido}>
        <SelectorOpciones opciones={TIPOS} elegida={tipo} alElegir={setTipo} />

        {lista.length === 0 ? (
          <Text style={styles.vacio}>
            {tipo === "debo" ? "No tenés deudas cargadas." : "No anotaste plata que te deban."}
          </Text>
        ) : (
          lista.map((d) => (
            <Pressable
              key={d.id}
              style={({ pressed }) => [styles.tarjeta, pressed && styles.presionada]}
              onPress={() => router.push({ pathname: "/deuda", params: { id: d.id } })}
            >
              <Text style={styles.nombre}>{d.nombre}</Text>
              <Text style={styles.detalle}>
                Total {formatearMonto(d.montoTotal)} ·{" "}
                {d.forma === "cuotas"
                  ? `cuotas de ${formatearMonto(d.cuota)}, vence el día ${d.diaVencimiento}`
                  : `hasta el ${fechaCorta(d.fechaLimite)}`}
              </Text>
            </Pressable>
          ))
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
  tarjeta: {
    backgroundColor: colores.superficie,
    borderRadius: radio.l,
    borderWidth: 1,
    borderColor: colores.borde,
    padding: espacio.l,
    gap: espacio.xs,
  },
  presionada: {
    borderColor: colores.acento,
  },
  nombre: {
    fontSize: 17,
    fontWeight: "bold",
    color: colores.texto,
  },
  detalle: {
    fontSize: letra.chica,
    color: colores.textoSuave,
  },
});