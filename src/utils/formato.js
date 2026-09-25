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