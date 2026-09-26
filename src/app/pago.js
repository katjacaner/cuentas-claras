import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import CampoMonto from "../components/CampoMonto";
import SelectorFecha from "../components/SelectorFecha";
import { useDatos } from "../context/DatosContext";
import { calcularDeuda } from "../logic/deudas";
import { colores, espacio, letra, radio, fuentes } from "../constants/tema";
import { hoy, miles, leerMonto, formatearMonto } from "../utils/formato";

export default function PagoScreen() {
  const { deudaId } = useLocalSearchParams();
  const { datos, agregarGasto, agregarCobro } = useDatos();

  const deuda = datos.deudas.find((d) => d.id === deudaId);
  const calculo = deuda ? calcularDeuda(deuda, datos) : null;

  // El monto arranca con lo que toca pagar ahora (la cuota del mes, o lo que falta)
  const [monto, setMonto] = useState(calculo && calculo.proximo ? miles(calculo.proximo) : "");
  const [fecha, setFecha] = useState(hoy());
  const [error, setError] = useState("");

  // Si la deuda no existe (por ejemplo, se borró), no mostramos nada
  if (!deuda) return null;

  const debo = deuda.tipo === "debo";
  const numero = leerMonto(monto);
  const palabra = debo ? "pago" : "cobro";

  // Texto de ayuda que se actualiza mientras escribís
  let ayuda = "";
  if (numero > calculo.falta) {
    ayuda = `Es más de lo que falta (${formatearMonto(calculo.falta)}).`;
  } else if (numero === calculo.falta) {
    ayuda = `Con este ${palabra} la deuda queda saldada.`;
  } else if (numero > 0) {
    ayuda = `Después de este ${palabra} faltan ${formatearMonto(calculo.falta - numero)}.`;
  }

  function guardar() {
    if (!(numero > 0)) {
      setError("Escribí un monto mayor a cero.");
      return;
    }
    if (numero > calculo.falta) {
      setError(`El monto no puede ser mayor a lo que falta: ${formatearMonto(calculo.falta)}.`);
      return;
    }

    if (debo) {
      // Un pago de algo que debo es un GASTO de la categoría "Deudas"
      agregarGasto({
        monto: numero,
        categoriaId: "deudas",
        fecha,
        descripcion: `Pago · ${deuda.nombre}`,
        deudaId: deuda.id,
      });
    } else {
      // Un cobro de algo que me deben va a la lista de cobros
      agregarCobro({ monto: numero, fecha, deudaId: deuda.id });
    }
    router.back();
  }

  return (
    <View style={styles.hoja}>
      <Text style={styles.titulo}>
        {debo ? "Pago" : "Cobro"} · {deuda.nombre}
      </Text>
      <Text style={styles.nota}>
        {deuda.forma === "cuotas"
          ? `Cuota de este período: ${formatearMonto(calculo.proximo)}. Si ${debo ? "pagaste" : "te pagaron"} otro monto, cambialo.`
          : `Falta ${debo ? "pagar" : "cobrar"} ${formatearMonto(calculo.falta)}. Podés anotar pagos parciales.`}
      </Text>

      <Text style={styles.etiqueta}>{debo ? "Monto que pagaste" : "Monto que te pagaron"}</Text>
      <CampoMonto valor={monto} alCambiar={setMonto} autoFocus />

      <Text style={styles.etiqueta}>Fecha</Text>
      <SelectorFecha fecha={fecha} alCambiar={setFecha} />

      {ayuda !== "" && <Text style={styles.ayuda}>{ayuda}</Text>}

      <Text style={styles.nota}>
        {debo
          ? "Se guarda como un gasto en la categoría Deudas y se descuenta de tu presupuesto."
          : "Los cobros no cambian tu presupuesto del mes."}
      </Text>

      {error !== "" && <Text style={styles.error}>{error}</Text>}

      <Pressable style={({ pressed }) => [styles.boton, pressed && styles.presionado]} onPress={guardar}>
        <Text style={styles.botonTexto}>{debo ? "Registrar pago" : "Registrar cobro"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  hoja: {
    padding: espacio.xl,
    gap: espacio.s,
    backgroundColor: colores.superficie,
  },
    titulo: {
    fontSize: letra.titulo,
    fontFamily: fuentes.titulo,
    color: colores.texto,
  },
  etiqueta: {
    fontSize: letra.chica,
    fontWeight: "bold",
    color: colores.textoSuave,
    marginTop: espacio.s,
  },
  nota: {
    fontSize: letra.chica,
    color: colores.textoSuave,
  },
  ayuda: {
    fontSize: letra.normal,
    fontWeight: "bold",
    color: colores.acento,
    backgroundColor: colores.acentoSuave,
    borderRadius: radio.s,
    padding: espacio.m,
    marginTop: espacio.s,
    overflow: "hidden",
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
    marginTop: espacio.m,
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