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

// "2026-09-24" -> "24 sep"
export function fechaCorta(fecha) {
  const [, mes, dia] = fecha.split("-");
  return Number(dia) + " " + MESES[Number(mes) - 1].slice(0, 3);
}