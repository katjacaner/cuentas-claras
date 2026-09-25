// Categorías que trae la app de fábrica.
// "Deudas" es del sistema: la app la usa sola para los pagos de deudas.
export const CATEGORIAS_BASE = [
  { id: "comida",     nombre: "Comida",     color: "#B8741A", delSistema: false },
  { id: "transporte", nombre: "Transporte", color: "#3A6EA5", delSistema: false },
  { id: "compras",    nombre: "Compras",    color: "#25614F", delSistema: false },
  { id: "servicios",  nombre: "Servicios",  color: "#7A5AA6", delSistema: false },
  { id: "deudas",     nombre: "Deudas",     color: "#9A5B2E", delSistema: true },
];

// Colores para las categorías que cree el usuario, en este orden.
export const COLORES_EXTRA = ["#4F8A3A", "#B3475E", "#1F7F8C", "#A0418C", "#56669A", "#6B7A1F", "#7C857F"];