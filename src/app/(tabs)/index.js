import { View, Text, StyleSheet } from "react-native";

export default function ResumenScreen() {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Resumen del mes</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEF1EC",
  },
  titulo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#18221D",
  },
});