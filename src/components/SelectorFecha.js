import { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colores, espacio, letra, radio } from "../constants/tema";
import { hoy, sumarDias, etiquetaDia, fechaATexto, textoAFecha } from "../utils/formato";

// Elegir la fecha con las flechas (día por día) o escribiéndola: "12/08" o "12/08/2026".
// Por defecto no deja elegir días futuros (para gastos). Con permitirFuturo sí (para deudas).
export default function SelectorFecha({ fecha, alCambiar, permitirFuturo = false }) {
  const [texto, setTexto] = useState(fechaATexto(fecha));
  const [escribiendo, setEscribiendo] = useState(false);
  const [error, setError] = useState("");

  // Si la fecha cambia (con las flechas) y no estás escribiendo, actualizamos lo que se ve
  useEffect(() => {
    if (!escribiendo) setTexto(fechaATexto(fecha));
  }, [fecha, escribiendo]);

  const bloquearSiguiente = !permitirFuturo && fecha >= hoy();

  function mover(dias) {
    setEscribiendo(false);
    setError("");
    alCambiar(sumarDias(fecha, dias));
  }

  function cambiarTexto(nuevo) {
    // Solo números, máximo 8 (DDMMAAAA). Las barras se agregan solas.
    const digitos = nuevo.replace(/\D/g, "").slice(0, 8);
    let conBarras = digitos.slice(0, 2);
    if (digitos.length > 2) conBarras += "/" + digitos.slice(2, 4);
    if (digitos.length > 4) conBarras += "/" + digitos.slice(4);
    setTexto(conBarras);

    // Probamos la fecha recién cuando está completa: "12/08" (4 números) o "12/08/2026" (8)
    if (digitos.length !== 4 && digitos.length !== 8) {
      setError("");
      return;
    }

    const nueva = textoAFecha(conBarras, permitirFuturo);
    if (nueva === null) {
      setError("Esa fecha no existe.");
    } else if (!permitirFuturo && nueva > hoy()) {
      setError("No puede ser una fecha futura.");
    } else {
      setError("");
      alCambiar(nueva);
    }
  }

  function terminarDeEscribir() {
    // Si quedó a medias o mal, vuelve a mostrar la última fecha válida
    setEscribiendo(false);
    setError("");
  }

  return (
    <View style={styles.bloque}>
      <View style={[styles.caja, error !== "" && styles.cajaError]}>
        <Pressable onPress={() => mover(-1)} style={styles.flecha} hitSlop={8} accessibilityLabel="Día anterior">
          <Ionicons name="chevron-back" size={22} color={colores.texto} />
        </Pressable>

        <View style={styles.centro}>
          <TextInput
            style={styles.input}
            value={texto}
            onChangeText={cambiarTexto}
            onFocus={() => setEscribiendo(true)}
            onBlur={terminarDeEscribir}
            keyboardType="number-pad"
            placeholder="DD/MM"
            placeholderTextColor={colores.textoSuave}
            selectTextOnFocus
            maxLength={10}
            accessibilityLabel="Fecha. Escribila como día y mes"
          />
          <Text style={styles.etiqueta}>{etiquetaDia(fecha)}</Text>
        </View>

        <Pressable
          onPress={() => mover(1)}
          disabled={bloquearSiguiente}
          style={[styles.flecha, bloquearSiguiente && styles.apagada]}
          hitSlop={8}
          accessibilityLabel="Día siguiente"
        >
          <Ionicons name="chevron-forward" size={22} color={colores.texto} />
        </Pressable>
      </View>

      {error !== "" && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  bloque: {
    gap: espacio.xs,
  },
  caja: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colores.superficie2,
    borderWidth: 1,
    borderColor: colores.borde,
    borderRadius: radio.m,
    padding: espacio.xs,
  },
  cajaError: {
    borderColor: colores.peligro,
  },
  flecha: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  apagada: {
    opacity: 0.3,
  },
  centro: {
    flex: 1,
    alignItems: "center",
  },
  input: {
    fontSize: 18,
    fontWeight: "bold",
    color: colores.texto,
    textAlign: "center",
    minWidth: 130,
    paddingVertical: 2,
  },
  etiqueta: {
    fontSize: 12,
    color: colores.textoSuave,
  },
  error: {
    fontSize: letra.chica,
    fontWeight: "bold",
    color: colores.peligro,
  },
});