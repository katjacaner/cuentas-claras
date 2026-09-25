import { View, Text, StyleSheet } from "react-native";

export default function GastosScreen() {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Todos tus gastos</Text>
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
