const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

// 3500000 -> "3.500.000"
export function miles(numero) {
  return String(Math.round(Math.abs(numero))).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// 3500000 -> "₲3.500.000"   |   -150000 -> "−₲150.000"
export function formatearMonto(numero) {
  const signo = numero < 0 ? "−" : "";
  return signo + "₲" + miles(numero);
}

// Lo que escribe el usuario -> número.  "35.000" -> 35000   |   "" -> NaN
export function leerMonto(texto) {
  const soloDigitos = String(texto).replace(/\D/g, "");
  return soloDigitos === "" ? NaN : Number(soloDigitos);
}

// La fecha de hoy como "2026-09-25", según el reloj del celular
export function hoy() {
  const d = new Date();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  const dia = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mes}-${dia}`;
}

// "2026-09-24" -> "2026-09"
export function mesDe(fecha) {
  return fecha.slice(0, 7);
}

// "2026-09" -> "Septiembre 2026"
export function nombreDelMes(mes) {
  const [anio, numero] = mes.split("-");
  const nombre = MESES[Number(numero) - 1];
  return nombre[0].toUpperCase() + nombre.slice(1) + " " + anio;
}

// "2026-09-24" -> "24 sep"   |   de otro año: "10 ene 2027"
export function fechaCorta(fecha) {
  const [anio, mes, dia] = fecha.split("-");
  const texto = Number(dia) + " " + MESES[Number(mes) - 1].slice(0, 3);
  return anio === hoy().slice(0, 4) ? texto : texto + " " + anio;
}

// "2026-09-25" y -1 -> "2026-09-24"
export function sumarDias(fecha, dias) {
  const [anio, mes, dia] = fecha.split("-").map(Number);
  const d = new Date(anio, mes - 1, dia + dias);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${dd}`;
}

// "2026-09-25" -> "Hoy"  |  "Ayer"  |  "Mañana"  |  "23 sep"
export function etiquetaDia(fecha) {
  if (fecha === hoy()) return "Hoy";
  if (fecha === sumarDias(hoy(), -1)) return "Ayer";
  if (fecha === sumarDias(hoy(), 1)) return "Mañana";
  return fechaCorta(fecha);
}

// "2026-09" y 1 -> "2026-10"   |   "2026-12" y 1 -> "2027-01"
export function moverMes(mes, cantidad) {
  const [anio, numero] = mes.split("-").map(Number);
  const d = new Date(anio, numero - 1 + cantidad, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

// El día "dia" de un mes: ("2026-09", 27) -> "2026-09-27"
// Si el mes es más corto (ej: 31 en febrero), usa el último día del mes.
export function fechaDelDia(mes, dia) {
  const [anio, numero] = mes.split("-").map(Number);
  const ultimoDia = new Date(anio, numero, 0).getDate();
  return `${mes}-${String(Math.min(dia, ultimoDia)).padStart(2, "0")}`;
}

// Días que faltan de una fecha a otra: ("2026-09-25", "2026-09-28") -> 3
export function diasEntre(desde, hasta) {
  const [a1, m1, d1] = desde.split("-").map(Number);
  const [a2, m2, d2] = hasta.split("-").map(Number);
  return Math.round((Date.UTC(a2, m2 - 1, d2) - Date.UTC(a1, m1 - 1, d1)) / 86400000);
}

// "2026-08-12" -> "12/08/2026"
export function fechaATexto(fecha) {
  const [anio, mes, dia] = fecha.split("-");
  return `${dia}/${mes}/${anio}`;
}

// Lo que escribe el usuario -> fecha.  "12/08" -> "2026-08-12"  |  "12/08/2025" -> "2025-08-12"
// Si la fecha no existe (ej: 31/02), devuelve null.
// Sin año usa el actual; si así quedaría en el futuro y no se permite, usa el año anterior.
export function textoAFecha(texto, permitirFuturo = true) {
  const [dia, mes, anioEscrito] = texto.split("/").map(Number);
  let anio = anioEscrito || Number(hoy().slice(0, 4));
  const armar = (a) => `${a}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;

  if (!anioEscrito && !permitirFuturo && armar(anio) > hoy()) anio -= 1;
  if (anio < 2000 || anio > 2100) return null;

  // ¿La fecha existe? Para el 31/02, JavaScript arma el 3 de marzo, así que no coincide
  const d = new Date(anio, mes - 1, dia);
  if (d.getFullYear() !== anio || d.getMonth() !== mes - 1 || d.getDate() !== dia) return null;

  return armar(anio);
}