import { createContext, useContext, useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { colores, radio } from "../constants/tema";

const AvisoContext = createContext(null);

// Muestra un mensajito abajo por unos segundos, por ejemplo "Gasto registrado"
export function AvisoProvider({ children }) {
  const [texto, setTexto] = useState("");
  const temporizador = useRef(null);

  function mostrarAviso(nuevoTexto) {
    setTexto(nuevoTexto);
    // Si ya había un aviso esperando para irse, lo cancelamos y empezamos de nuevo
    clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => setTexto(""), 2500);
  }

  return (
    <AvisoContext.Provider value={mostrarAviso}>
      {children}
      {texto !== "" && (
        <View style={styles.contenedor}>
          <View style={styles.aviso}>
            <Text style={styles.texto}>✓  {texto}</Text>
          </View>
        </View>
      )}
    </AvisoContext.Provider>
  );
}

// Para mostrar un aviso desde cualquier pantalla
export function useAviso() {
  return useContext(AvisoContext);
}

const styles = StyleSheet.create({
  contenedor: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 150,
    alignItems: "center",
    pointerEvents: "none",
  },
  aviso: {
    backgroundColor: colores.texto,
    borderRadius: radio.m,
    paddingVertical: 12,
    paddingHorizontal: 18,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  texto: {
    color: colores.fondo,
    fontSize: 15,
    fontWeight: "bold",
  },
});