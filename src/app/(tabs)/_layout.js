import { Pressable } from "react-native";
import { Tabs, router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { colores } from "../../constants/tema";
import { useDatos } from "../../context/DatosContext";
import { contarUrgentes } from "../../logic/deudas";

// La ruedita de arriba a la derecha que abre Ajustes
function BotonAjustes() {
  return (
    <Pressable
      onPress={() => router.push("/ajustes")}
      hitSlop={10}
      style={{ marginRight: 16 }}
      accessibilityLabel="Ajustes"
    >
      <Ionicons name="settings-outline" size={22} color={colores.texto} />
    </Pressable>
  );
}

export default function TabsLayout() {
  const { datos } = useDatos();
  const urgentes = contarUrgentes(datos);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colores.acento,
        headerRight: () => <BotonAjustes />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Resumen",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="pie-chart-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="gastos"
        options={{
          title: "Gastos",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="deudas"
        options={{
          title: "Deudas",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="card-outline" size={size} color={color} />
          ),
          tabBarBadge: urgentes > 0 ? urgentes : undefined,
          tabBarBadgeStyle: { backgroundColor: colores.peligro },
        }}
      />
    </Tabs>
  );
}