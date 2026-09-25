import AsyncStorage from "@react-native-async-storage/async-storage";
import { CATEGORIAS_BASE } from "../constants/categorias";

const CLAVE = "mis-gastos:datos";
const VERSION = 1;

// Los datos de alguien que abre la app por primera vez
export function datosIniciales() {
  return {
    version: VERSION,
    presupuestos: [],
    categorias: CATEGORIAS_BASE,
    gastos: [],
    deudas: [],
    cobros: [],
  };
}

// Lee los datos guardados en el celular
export async function cargarDatos() {
  try {
    const texto = await AsyncStorage.getItem(CLAVE);
    if (texto === null) return datosIniciales();
    return JSON.parse(texto);
  } catch (error) {
    console.warn("No se pudieron cargar los datos", error);
    return datosIniciales();
  }
}

// Guarda todos los datos en el celular
export async function guardarDatos(datos) {
  try {
    await AsyncStorage.setItem(CLAVE, JSON.stringify(datos));
  } catch (error) {
    console.warn("No se pudieron guardar los datos", error);
  }
}