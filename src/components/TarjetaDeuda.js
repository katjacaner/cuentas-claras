import { View, Text, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { colores, espacio, letra, radio } from "../constants/tema";
import { formatearMonto, fechaCorta } from "../utils/formato";
import { textoEstado } from "../logic/deudas";

// Colores de la etiqueta según el estado
const TONOS = {
  vencida: { fondo: colores.peligroSuave, texto: colores.peligro },
  pronto: { fondo: colores.avisoSuave, texto: colores.aviso },
  aldia: { fondo: colores.superficie2, texto: colores.textoSuave },
  saldada: { fondo: colores.acentoSuave, texto: colores.acento },
};

export default function TarjetaDeuda({ deuda, calculo }) {
  const debo = deuda.tipo === "debo";
  const tono = TONOS[calculo.estado];

  const detalle =
    deuda.forma === "cuotas"
      ? `Cuotas de ${formatearMonto(deuda.cuota)} · vence el día ${deuda.diaVencimiento}`
      : `Pago único · hasta el ${fechaCorta(deuda.fechaLimite)}`;

  function editar() {
    router.push({ pathname: "/deuda", params: { id: deuda.id } });
  }

  return (
    <Pressable
      onPress={editar}
      style={({ pressed }) => [
        styles.tarjeta,
        calculo.estado === "vencida" && styles.bordeRojo,
        calculo.estado === "pronto" && styles.bordeNaranja,
        pressed && styles.presionada,
      ]}
    >
      {/* Nombre y etiqueta de estado */}
      <View style={styles.cabecera}>
        <View style={styles.titulos}>
          <Text style={styles.nombre}>{deuda.nombre}</Text>
          <Text style={styles.detalle}>
            {detalle} · total {formatearMonto(deuda.montoTotal)}
          </Text>
        </View>
        <View style={[styles.etiqueta, { backgroundColor: tono.fondo }]}>
          <Text style={[styles.etiquetaTexto, { color: tono.texto }]}>{textoEstado(deuda, calculo)}</Text>
        </View>
      </View>

      {/* Barra de progreso */}
      <View style={styles.barra}>
        <View style={[styles.relleno, { width: `${calculo.porcentaje}%` }]} />
      </View>

      {/* Cuánto se pagó y cuánto falta */}
      <View style={styles.numeros}>
        <Text style={styles.texto}>
          {debo ? "Pagaste" : "Te pagaron"} <Text style={styles.negrita}>{formatearMonto(calculo.pagado)}</Text> (
          {calculo.porcentaje}%)
        </Text>
        <Text style={styles.texto}>
          Faltan <Text style={styles.negrita}>{formatearMonto(calculo.falta)}</Text>
        </Text>
      </View>

      {/* Próximo vencimiento (no aparece si ya está saldada) */}
      {calculo.estado !== "saldada" && (
        <View style={[styles.proximo, { backgroundColor: tono.fondo }]}>
          <Text style={styles.texto}>
            {deuda.forma === "cuotas" ? "Próxima cuota" : "Plazo"} · {calculo.dias < 0 ? "venció" : "vence"} el{" "}
            {fechaCorta(calculo.vence)}
          </Text>
          <Text style={styles.negrita}>{formatearMonto(calculo.proximo)}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: colores.superficie,
    borderRadius: radio.l,
    borderWidth: 1,
    borderColor: colores.borde,
    padding: espacio.l,
    gap: espacio.m,
  },
  bordeRojo: {
    borderColor: colores.peligro,
  },
  bordeNaranja: {
    borderColor: colores.aviso,
  },
  presionada: {
    opacity: 0.85,
  },
  cabecera: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: espacio.s,
  },
  titulos: {
    flex: 1,
    gap: 2,
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
  etiqueta: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 999,
  },
  etiquetaTexto: {
    fontSize: 12,
    fontWeight: "bold",
  },
  barra: {
    height: 12,
    borderRadius: 6,
    backgroundColor: colores.superficie2,
    overflow: "hidden",
  },
  relleno: {
    height: 12,
    borderRadius: 6,
    backgroundColor: colores.acento,
  },
  numeros: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: espacio.s,
  },
  texto: {
    fontSize: 14,
    color: colores.texto,
  },
  negrita: {
    fontSize: 14,
    fontWeight: "bold",
    color: colores.texto,
  },
  proximo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: espacio.s,
    borderRadius: radio.s,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
});