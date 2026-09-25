import { createContext, useContext, useEffect, useState } from "react";
import { cargarDatos, guardarDatos } from "../data/storage";
import { crearId } from "../utils/id";

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

  // Si ya había un presupuesto para ese mes, lo reemplaza
  function guardarPresupuesto(monto, mes) {
    const otros = datos.presupuestos.filter((p) => p.desde !== mes);
    const presupuestos = [...otros, { desde: mes, monto }].sort((a, b) => a.desde.localeCompare(b.desde));
    cambiar({ ...datos, presupuestos });
  }

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

  // Mientras carga no mostramos nada (dura un instante)
  if (datos === null) return null;

  return (
        <DatosContext.Provider value={{ datos, agregarGasto, editarGasto, borrarGasto, guardarPresupuesto, agregarDeuda, editarDeuda, borrarDeuda }}>
      {children}
    </DatosContext.Provider>
  );
}

// Para usar la caja desde cualquier pantalla
export function useDatos() {
  return useContext(DatosContext);
}