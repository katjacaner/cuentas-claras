// Crea un código único, por ejemplo "m1a2b3c4x9k2p"
export function crearId() {
  const tiempo = Date.now().toString(36);
  const azar = Math.random().toString(36).slice(2, 7);
  return tiempo + azar;
}