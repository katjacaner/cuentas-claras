import { Alert, Platform } from "react-native";

// Pide confirmación antes de hacer algo importante (por ejemplo, borrar).
// En el celular muestra el cartel del sistema; en la web, el del navegador.
export function confirmar(titulo, mensaje, textoBoton, alConfirmar) {
  if (Platform.OS === "web") {
    if (window.confirm(`${titulo}\n\n${mensaje}`)) alConfirmar();
    return;
  }
  Alert.alert(titulo, mensaje, [
    { text: "Cancelar", style: "cancel" },
    { text: textoBoton, style: "destructive", onPress: alConfirmar },
  ]);
}

// Muestra un aviso con un solo botón ("OK" / "Aceptar")
export function avisar(titulo, mensaje) {
  if (Platform.OS === "web") {
    window.alert(`${titulo}\n\n${mensaje}`);
    return;
  }
  Alert.alert(titulo, mensaje);
}