import { useState } from "react";
import { ScrollView, View, Text, TextInput, Pressable, Alert, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import CampoMonto from "../components/CampoMonto";
import SelectorOpciones from "../components/SelectorOpciones";
import SelectorFecha from "../components/SelectorFecha";
import { useDatos } from "../context/DatosContext";
import { colores, espacio, letra, radio } from "../constants/tema";
import { hoy, miles, leerMonto, sumarDias, formatearMonto } from "../utils/formato";

const TIPOS = [
  { valor: "debo", texto: "Yo debo" },
  { valor: "meDeben", texto: "Me deben" },
];

const FORMAS = [
  { valor: "cuotas", texto: "En cuotas" },
  { valor: "fecha", texto: "Una sola fecha" },
];

// Botones para elegir rápido la fecha límite
const ATAJOS = [
  { texto: "1 semana", dias: 7 },
  { texto: "15 días", dias: 15 },
  { texto: "1 mes", dias: 30 },
  { texto: "3 meses", dias: 90 },
];

export default function DeudaScreen() {
  const { id, tipo: tipoInicial } = useLocalSearchParams();
  const { datos, agregarDeuda, editarDeuda, borrarDeuda } = useDatos();

  const deuda = datos.deudas.find((d) => d.id === id);
  const esEdicion = deuda !== undefined;

  // Si ya tiene pagos o cobros, no se puede cambiar el tipo (se mezclarían gastos y cobros)
  const tieneMovimientos = esEdicion && [...datos.gastos, ...datos.cobros].some((m) => m.deudaId === deuda.id);

  const [tipo, setTipo] = useState(esEdicion ? deuda.tipo : tipoInicial === "meDeben" ? "meDeben" : "debo");
  const [nombre, setNombre] = useState(esEdicion ? deuda.nombre : "");
  const [total, setTotal] = useState(esEdicion ? miles(deuda.montoTotal) : "");
  const [previo, setPrevio] = useState(esEdicion && deuda.yaPagadoAntes > 0 ? miles(deuda.yaPagadoAntes) : "");
  const [forma, setForma] = useState(esEdicion ? deuda.forma : "cuotas");
  const [cuota, setCuota] = useState(esEdicion && deuda.cuota ? miles(deuda.cuota) : "");
  const [dia, setDia] = useState(esEdicion && deuda.diaVencimiento ? String(deuda.diaVencimiento) : "");
  const [fechaLimite, setFechaLimite] = useState(esEdicion && deuda.fechaLimite ? deuda.fechaLimite : sumarDias(hoy(), 30));
  const [error, setError] = useState("");

  const debo = tipo === "debo";
  const montoTotal = leerMonto(total);
  const yaPagadoAntes = leerMonto(previo) || 0;
  const montoCuota = leerMonto(cuota);
  const diaVencimiento = Number(dia);
  const falta = (montoTotal || 0) - yaPagadoAntes;

  // Texto de ayuda: "Te falta pagar ₲3.500.000 en 7 cuotas"
  let ayuda = "";
  if (montoTotal > 0 && falta > 0) {
    ayuda = (debo ? "Te falta pagar " : "Te falta cobrar ") + formatearMonto(falta);
    if (forma === "cuotas" && montoCuota > 0) {
      const cantidad = Math.ceil(falta / montoCuota);
      ayuda += ` en ${cantidad} ${cantidad === 1 ? "cuota" : "cuotas"}`;
    }
  }

  // Devuelve el mensaje de error, o "" si está todo bien
  function validar() {
    if (nombre.trim() === "") return "Poné un nombre para reconocer la deuda.";
    if (!(montoTotal > 0)) return "Escribí el monto total, por ejemplo 1.000.000.";
    if (yaPagadoAntes >= montoTotal) return "Lo que ya se pagó antes tiene que ser menor al total.";
    if (forma === "cuotas" && !(montoCuota > 0)) return "Escribí cuánto es la cuota mensual.";
    if (forma === "cuotas" && !(diaVencimiento >= 1 && diaVencimiento <= 31)) {
      return "El día de vencimiento tiene que ser un número del 1 al 31.";
    }
    return "";
  }

  function guardar() {
    const mensaje = validar();
    if (mensaje !== "") {
      setError(mensaje);
      return;
    }

    const datosDeLaDeuda = {
      tipo,
      nombre: nombre.trim(),
      montoTotal,
      yaPagadoAntes,
      forma,
      cuota: forma === "cuotas" ? montoCuota : null,
      diaVencimiento: forma === "cuotas" ? diaVencimiento : null,
      fechaLimite: forma === "fecha" ? fechaLimite : null,
    };

    if (esEdicion) {
      editarDeuda(deuda.id, datosDeLaDeuda);
    } else {
      agregarDeuda(datosDeLaDeuda);
    }
    router.back();
  }

  function confirmarBorrado() {
    const aviso = debo ? "Los pagos que registraste quedan en tus gastos." : "También se borran sus cobros.";
    Alert.alert("¿Borrar esta deuda?", aviso, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Borrar",
        style: "destructive",
        onPress: () => {
          borrarDeuda(deuda.id);
          router.back();
        },
      },
    ]);
  }

  return (
    <ScrollView
      contentContainerStyle={styles.hoja}
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
    >
      <Text style={styles.titulo}>{esEdicion ? "Editar deuda" : "Nueva deuda"}</Text>

      <SelectorOpciones opciones={TIPOS} elegida={tipo} alElegir={setTipo} deshabilitado={tieneMovimientos} />
      {tieneMovimientos && (
        <Text style={styles.nota}>El tipo no se puede cambiar porque ya tiene movimientos registrados.</Text>
      )}

      <Text style={styles.etiqueta}>{debo ? "¿Qué es o a quién le debés?" : "¿Quién te debe?"}</Text>
      <TextInput
        style={styles.input}
        value={nombre}
        onChangeText={setNombre}
        placeholder={debo ? "Ej: Préstamo del banco" : "Ej: Juan"}
        placeholderTextColor={colores.textoSuave}
        maxLength={40}
        autoFocus={!esEdicion}
      />

      <Text style={styles.etiqueta}>Monto total</Text>
      <CampoMonto valor={total} alCambiar={setTotal} />

      <Text style={styles.etiqueta}>
        {debo ? "Ya pagado antes de usar la app" : "Ya cobrado antes de usar la app"} (opcional)
      </Text>
      <CampoMonto valor={previo} alCambiar={setPrevio} />

      <Text style={styles.etiqueta}>¿Cómo se paga?</Text>
      <SelectorOpciones opciones={FORMAS} elegida={forma} alElegir={setForma} />

      {forma === "cuotas" ? (
        <View style={styles.columnas}>
          <View style={styles.columnaAncha}>
            <Text style={styles.etiqueta}>Cuota mensual</Text>
            <CampoMonto valor={cuota} alCambiar={setCuota} />
          </View>
          <View style={styles.columnaAngosta}>
            <Text style={styles.etiqueta}>Vence el día</Text>
            <TextInput
              style={[styles.input, styles.inputDia]}
              value={dia}
              onChangeText={(texto) => setDia(texto.replace(/\D/g, "").slice(0, 2))}
              keyboardType="number-pad"
              placeholder="1-31"
              placeholderTextColor={colores.textoSuave}
            />
          </View>
        </View>
      ) : (
        <View style={styles.bloque}>
          <Text style={styles.etiqueta}>Fecha límite</Text>
          <SelectorFecha fecha={fechaLimite} alCambiar={setFechaLimite} permitirFuturo />
          <View style={styles.atajos}>
            {ATAJOS.map((a) => (
              <Pressable key={a.dias} style={styles.atajo} onPress={() => setFechaLimite(sumarDias(hoy(), a.dias))}>
                <Text style={styles.atajoTexto}>{a.texto}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {ayuda !== "" && (
        <View style={styles.ayuda}>
          <Text style={styles.ayudaTexto}>{ayuda}</Text>
        </View>
      )}

      {error !== "" && <Text style={styles.error}>{error}</Text>}

      <Pressable style={({ pressed }) => [styles.boton, pressed && styles.presionado]} onPress={guardar}>
        <Text style={styles.botonTexto}>{esEdicion ? "Guardar cambios" : "Guardar deuda"}</Text>
      </Pressable>

      {esEdicion && (
        <Pressable style={styles.botonBorrar} onPress={confirmarBorrado}>
          <Text style={styles.botonBorrarTexto}>Borrar deuda</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  hoja: {
    padding: espacio.xl,
    gap: espacio.s,
  },
  titulo: {
    fontSize: letra.titulo,
    fontWeight: "bold",
    color: colores.texto,
    marginBottom: espacio.s,
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
  input: {
    backgroundColor: colores.superficie2,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: radio.m,
    paddingHorizontal: espacio.l,
    paddingVertical: 12,
    fontSize: 16,
    color: colores.texto,
  },
  columnas: {
    flexDirection: "row",
    gap: espacio.m,
  },
  columnaAncha: {
    flex: 2,
    gap: espacio.s,
  },
  columnaAngosta: {
    flex: 1,
    gap: espacio.s,
  },
  inputDia: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 16,
  },
  bloque: {
    gap: espacio.s,
  },
  atajos: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: espacio.s,
  },
  atajo: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colores.acento,
  },
  atajoTexto: {
    fontSize: 13,
    fontWeight: "bold",
    color: colores.acento,
  },
  ayuda: {
    backgroundColor: colores.acentoSuave,
    borderRadius: radio.s,
    padding: espacio.m,
    marginTop: espacio.s,
  },
  ayudaTexto: {
    fontSize: letra.normal,
    fontWeight: "bold",
    color: colores.acento,
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
  botonBorrar: {
    alignItems: "center",
    paddingVertical: 12,
  },
  botonBorrarTexto: {
    color: colores.peligro,
    fontSize: 15,
    fontWeight: "bold",
  },
});
