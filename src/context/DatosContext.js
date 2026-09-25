import { createContext, useContext, useEffect, useState } from "react";
import { cargarDatos, guardarDatos } from "../data/storage";
import { crearId } from "../utils/id";
import { COLORES_EXTRA } from "../constants/categorias";

const DatosContext = createContext(null);

export function DatosProvider({ children }) {
  // null = todavía se están cargando los datos del celular
  const [datos, setDatos] = useState(null);

  // Al abrir la app, cargamos los datos guardados (una sola vez)
  useEffect(() => {
    cargarDatos().then(setDatos);
  }, []);

  // Cambia los datos en pantalla Y los guarda en el celular
  function cambiar(nuevosDatos) {
    setDatos(nuevosDatos);
    guardarDatos(nuevosDatos);
  }

  // ---------- Gastos ----------

  function agregarGasto(gasto) {
    const nuevo = { id: crearId(), deudaId: null, ...gasto };
    cambiar({ ...datos, gastos: [...datos.gastos, nuevo] });
  }

  function editarGasto(id, cambios) {
    const gastos = datos.gastos.map((g) => (g.id === id ? { ...g, ...cambios } : g));
    cambiar({ ...datos, gastos });
  }

  function borrarGasto(id) {
    const gastos = datos.gastos.filter((g) => g.id !== id);
    cambiar({ ...datos, gastos });
  }

  // ---------- Presupuesto ----------

  // Si ya había un presupuesto para ese mes, lo reemplaza
  function guardarPresupuesto(monto, mes) {
    const otros = datos.presupuestos.filter((p) => p.desde !== mes);
    const presupuestos = [...otros, { desde: mes, monto }].sort((a, b) => a.desde.localeCompare(b.desde));
    cambiar({ ...datos, presupuestos });
  }

  // ---------- Categorías ----------

  // Crea una categoría. Devuelve { error: "..." } si algo está mal, o { categoria } si salió bien.
  function agregarCategoria(nombreEscrito) {
    const nombre = nombreEscrito.trim().replace(/\s+/g, " ");
    if (nombre === "") return { error: "Escribí un nombre para la categoría." };
    if (nombre.length > 20) return { error: "Usá un nombre de hasta 20 letras." };

    const repetida = datos.categorias.some((c) => c.nombre.toLowerCase() === nombre.toLowerCase());
    if (repetida) return { error: `Ya existe la categoría "${nombre}".` };

    const creadas = datos.categorias.filter((c) => c.creadaPorUsuario).length;
    const categoria = {
      id: crearId(),
      nombre: nombre[0].toUpperCase() + nombre.slice(1),
      color: COLORES_EXTRA[creadas % COLORES_EXTRA.length],
      delSistema: false,
      creadaPorUsuario: true,
    };

    // "Deudas" (la del sistema) queda siempre al final de la lista
    const normales = datos.categorias.filter((c) => !c.delSistema);
    const delSistema = datos.categorias.filter((c) => c.delSistema);
    cambiar({ ...datos, categorias: [...normales, categoria, ...delSistema] });
    return { categoria };
  }

  function borrarCategoria(id) {
    const categorias = datos.categorias.filter((c) => c.id !== id);
    cambiar({ ...datos, categorias });
  }

  // ---------- Deudas y cobros ----------

  function agregarDeuda(deuda) {
    const nueva = { id: crearId(), ...deuda };
    cambiar({ ...datos, deudas: [...datos.deudas, nueva] });
  }

  function editarDeuda(id, cambios) {
    const deudas = datos.deudas.map((d) => (d.id === id ? { ...d, ...cambios } : d));
    cambiar({ ...datos, deudas });
  }

  // Los pagos (que son gastos) se quedan: esa plata sí se gastó.
  // Los cobros sí se borran junto con la deuda.
  function borrarDeuda(id) {
    const deudas = datos.deudas.filter((d) => d.id !== id);
    const cobros = datos.cobros.filter((c) => c.deudaId !== id);
    cambiar({ ...datos, deudas, cobros });
  }

  function agregarCobro(cobro) {
    const nuevo = { id: crearId(), ...cobro };
    cambiar({ ...datos, cobros: [...datos.cobros, nuevo] });
  }

  function borrarCobro(id) {
    const cobros = datos.cobros.filter((c) => c.id !== id);
    cambiar({ ...datos, cobros });
  }

  // Mientras carga no mostramos nada (dura un instante)
  if (datos === null) return null;

  const valor = {
    datos,
    agregarGasto,
    editarGasto,
    borrarGasto,
    guardarPresupuesto,
    agregarCategoria,
    borrarCategoria,
    agregarDeuda,
    editarDeuda,
    borrarDeuda,
    agregarCobro,
    borrarCobro,
  };

  return <DatosContext.Provider value={valor}>{children}</DatosContext.Provider>;
}

// Para usar la caja desde cualquier pantalla
export function useDatos() {
  return useContext(DatosContext);
}