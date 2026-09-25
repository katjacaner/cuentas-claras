import { mesDe } from "../utils/formato";

// El presupuesto que rige en un mes (el último cambio hecho en ese mes o antes)
export function presupuestoDelMes(presupuestos, mes) {
  const vigentes = presupuestos.filter((p) => p.desde <= mes);
  if (vigentes.length === 0) return 0;
  return vigentes[vigentes.length - 1].monto;
}

// Solo los gastos de un mes: "2026-09"
export function gastosDelMes(gastos, mes) {
  return gastos.filter((g) => mesDe(g.fecha) === mes);
}

// Suma los montos de una lista de gastos
export function sumarMontos(gastos) {
  return gastos.reduce((total, g) => total + g.monto, 0);
}