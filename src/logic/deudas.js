import { hoy, mesDe, moverMes, fechaDelDia, diasEntre, fechaCorta } from "../utils/formato";
import { sumarMontos } from "./calculos";

// Los pagos (si la debo) o los cobros (si me la deben) de una deuda
export function movimientosDeDeuda(deuda, datos) {
  const lista = deuda.tipo === "debo" ? datos.gastos : datos.cobros;
  return lista.filter((m) => m.deudaId === deuda.id);
}

// Todo lo que se calcula de una deuda. Nada de esto se guarda.
export function calcularDeuda(deuda, datos) {
  const movimientos = movimientosDeDeuda(deuda, datos);
  const pagado = deuda.yaPagadoAntes + sumarMontos(movimientos);
  const falta = Math.max(0, deuda.montoTotal - pagado);
  const porcentaje = Math.min(100, Math.round((pagado / deuda.montoTotal) * 100));

  if (falta === 0) {
    return { movimientos, pagado, falta, porcentaje, estado: "saldada" };
  }

  let vence;
  let proximo;
  if (deuda.forma === "cuotas") {
    const mesActual = mesDe(hoy());
    const pagadoEsteMes = sumarMontos(movimientos.filter((m) => mesDe(m.fecha) === mesActual));
    const cuotaDelMes = Math.min(deuda.cuota, falta + pagadoEsteMes);

    if (pagadoEsteMes >= cuotaDelMes) {
      // La cuota de este mes ya está pagada: la próxima vence el mes que viene
      vence = fechaDelDia(moverMes(mesActual, 1), deuda.diaVencimiento);
      proximo = Math.min(deuda.cuota, falta);
    } else {
      // Todavía falta (todo o parte de) la cuota de este mes
      vence = fechaDelDia(mesActual, deuda.diaVencimiento);
      proximo = cuotaDelMes - pagadoEsteMes;
    }
  } else {
    vence = deuda.fechaLimite;
    proximo = falta;
  }

  const dias = diasEntre(hoy(), vence);
  let estado = "aldia";
  if (dias < 0) estado = "vencida";
  else if (dias <= 7) estado = "pronto";

  return { movimientos, pagado, falta, porcentaje, estado, vence, proximo, dias };
}

// El texto de la etiqueta de color: "Venció hace 2 días", "Vence mañana", etc.
export function textoEstado(deuda, calculo) {
  if (calculo.estado === "saldada") return deuda.tipo === "debo" ? "Pagada" : "Cobrada";
  const d = calculo.dias;
  if (d < -1) return `Venció hace ${-d} días`;
  if (d === -1) return "Venció ayer";
  if (d === 0) return "Vence hoy";
  if (d === 1) return "Vence mañana";
  if (d <= 7) return `Vence en ${d} días`;
  return `Vence el ${fechaCorta(calculo.vence)}`;
}

// Cuántas deudas están vencidas o vencen en 7 días o menos.
// Si le pasás un tipo ("debo" o "meDeben"), cuenta solo las de ese tipo.
export function contarUrgentes(datos, tipo) {
  return datos.deudas.filter((d) => {
    if (tipo && d.tipo !== tipo) return false;
    const estado = calcularDeuda(d, datos).estado;
    return estado === "vencida" || estado === "pronto";
  }).length;
}