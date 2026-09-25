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

// Busca una categoría por su id. Si no existe, devuelve una genérica.
export function buscarCategoria(categorias, id) {
  return categorias.find((c) => c.id === id) || { id, nombre: "Sin categoría", color: "#7C857F" };
}

// Ordena los gastos del más reciente al más antiguo
export function ordenarPorFecha(gastos) {
  return [...gastos].reverse().sort((a, b) => b.fecha.localeCompare(a.fecha));
}

// Junta los gastos del mismo día: [{ fecha, total, data: [gastos...] }]
export function agruparPorDia(gastos) {
  const grupos = [];
  for (const g of ordenarPorFecha(gastos)) {
    const ultimo = grupos[grupos.length - 1];
    if (ultimo && ultimo.fecha === g.fecha) {
      ultimo.data.push(g);
      ultimo.total += g.monto;
    } else {
      grupos.push({ fecha: g.fecha, total: g.monto, data: [g] });
    }
  }
  return grupos;
}

// Cuánto se gastó en cada categoría, de mayor a menor (sin las que están en cero)
export function totalesPorCategoria(gastos, categorias) {
  const total = sumarMontos(gastos);
  return categorias
    .map((c) => {
      const suma = sumarMontos(gastos.filter((g) => g.categoriaId === c.id));
      return { categoria: c, total: suma, porcentaje: total > 0 ? Math.round((suma / total) * 100) : 0 };
    })
    .filter((x) => x.total > 0)
    .sort((a, b) => b.total - a.total);
}