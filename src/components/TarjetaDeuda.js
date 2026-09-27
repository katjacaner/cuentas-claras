import { useState } from "react";
import { View, Text, Pressable, Alert, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useDatos } from "../context/DatosContext";
import { colores, espacio, letra, radio } from "../constants/tema";
import { formatearMonto, fechaCorta } from "../utils/formato";
import { textoEstado } from "../logic/deudas";
import { confirmar } from "../utils/dialogos";

// Colores de la etiqueta según el estado
const TONOS = {
  vencida: { fondo: colores.peligroSuave, texto: colores.peligro },
  pronto: { fondo: colores.avisoSuave, texto: colores.aviso },
  aldia: { fondo: colores.superficie2, texto: colores.textoSuave },
  saldada: { fondo: colores.acentoSuave, texto: colores.acento },
};

export default function TarjetaDeuda({ deuda, calculo }) {
  const { borrarCobro } = useDatos();
  const [verHistorial, setVerHistorial] = useState(false);

  const debo = deuda.tipo === "debo";
  const terminada = calculo.estado === "saldada";
  const tono = TONOS[calculo.estado];

  const detalle =
    deuda.forma === "cuotas"
      ? `Cuotas de ${formatearMonto(deuda.cuota)} · vence el día ${deuda.diaVencimiento}`
      : `Pago único · hasta el ${fechaCorta(deuda.fechaLimite)}`;

  // Los pagos o cobros, del más nuevo al más viejo
  const historial = [...calculo.movimientos].sort((a, b) => b.fecha.localeCompare(a.fecha));
  const cantidad = historial.length + (deuda.yaPagadoAntes > 0 ? 1 : 0);

  function editar() {
    router.push({ pathname: "/deuda", params: { id: deuda.id } });
  }

  function registrarPago() {
    router.push({ pathname: "/pago", params: { deudaId: deuda.id } });
  }

    function tocarMovimiento(m) {
    if (debo) {
      // Los pagos son gastos: se editan o borran en la hoja del gasto
      router.push({ pathname: "/gasto", params: { id: m.id } });
    } else {
      confirmar("¿Borrar este cobro?", `${formatearMonto(m.monto)} del ${fechaCorta(m.fecha)}`, "Borrar", () =>
        borrarCobro(m.id)
      );
    }
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
        {!terminada && (
          <Text style={styles.texto}>
            Faltan <Text style={styles.negrita}>{formatearMonto(calculo.falta)}</Text>
          </Text>
        )}
      </View>

      {/* Próximo vencimiento */}
      {!terminada && (
        <View style={[styles.proximo, { backgroundColor: tono.fondo }]}>
          <Text style={styles.texto}>
            {deuda.forma === "cuotas" ? "Próxima cuota" : "Plazo"} · {calculo.dias < 0 ? "venció" : "vence"} el{" "}
            {fechaCorta(calculo.vence)}
          </Text>
          <Text style={styles.negrita}>{formatearMonto(calculo.proximo)}</Text>
        </View>
      )}

      {/* Botones */}
      <View style={styles.acciones}>
        {!terminada && (
          <Pressable style={({ pressed }) => [styles.botonPagar, pressed && styles.presionada]} onPress={registrarPago}>
            <Text style={styles.botonPagarTexto}>{debo ? "Registrar pago" : "Registrar cobro"}</Text>
          </Pressable>
        )}
        <Pressable style={styles.botonHistorial} onPress={() => setVerHistorial(!verHistorial)}>
          <Text style={styles.botonHistorialTexto}>
            {verHistorial ? "Ocultar" : `${debo ? "Pagos" : "Cobros"} (${cantidad})`}
          </Text>
        </Pressable>
      </View>

      {/* Historial desplegable */}
      {verHistorial && (
        <View style={styles.historial}>
          {historial.map((m) => (
            <Pressable key={m.id} style={styles.movimiento} onPress={() => tocarMovimiento(m)}>
              <Text style={styles.textoSuave}>{fechaCorta(m.fecha)}</Text>
              <Text style={styles.negrita}>{formatearMonto(m.monto)}</Text>
            </Pressable>
          ))}
          {deuda.yaPagadoAntes > 0 && (
            <View style={styles.movimiento}>
              <Text style={styles.textoSuave}>Antes de usar la app</Text>
              <Text style={styles.negrita}>{formatearMonto(deuda.yaPagadoAntes)}</Text>
            </View>
          )}
          <Text style={styles.pista}>
            {cantidad === 0
              ? `Todavía no hay ${debo ? "pagos" : "cobros"} registrados.`
              : debo
                ? "Tocá un pago para editarlo o borrarlo."
                : "Tocá un cobro para borrarlo."}
          </Text>
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
  textoSuave: {
    fontSize: 14,
    color: colores.textoSuave,
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
  acciones: {
    flexDirection: "row",
    gap: espacio.s,
  },
  botonPagar: {
    flex: 1,
    backgroundColor: colores.acento,
    borderRadius: radio.s,
    paddingVertical: 12,
    alignItems: "center",
  },
  botonPagarTexto: {
    color: colores.sobreAcento,
    fontSize: 14,
    fontWeight: "bold",
  },
  botonHistorial: {
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: radio.s,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: "center",
  },
  botonHistorialTexto: {
    color: colores.texto,
    fontSize: 14,
    fontWeight: "bold",
  },
  historial: {
    borderTopWidth: 1,
    borderTopColor: colores.borde,
    paddingTop: espacio.s,
  },
  movimiento: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: espacio.s,
  },
  pista: {
    fontSize: 12,
    color: colores.textoSuave,
    marginTop: espacio.xs,
  },
});