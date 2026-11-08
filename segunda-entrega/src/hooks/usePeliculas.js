import { useEffect, useState } from "react";
import {
  obtenerPeliculas,
  actualizarPelicula,
  eliminarPelicula,
} from "@api/peliculas";


export const MAX_FAVORITAS = 3;

/**
 * Hook que carga las películas desde el servidor simulado y expone las acciones para modificarlas (estado, favorita, puntuación, reseña y baja).
 * Cada película tiene la forma del tipo Pelicula definido en api/peliculas.js.
 * @returns {{
 *   peliculas: Object[],
 *   cargando: boolean,
 *   error: string,
 *   aviso: string,
 *   limpiarAviso: function(): void,
 *   alternarEstado: function(Object): void,
 *   alternarFavorito: function(Object): void,
 *   puntuar: function(Object, number): void,
 *   guardarResena: function(Object, string): Promise<boolean>,
 *   eliminar: function(string|number): Promise<boolean>
 * }} Estado de la carga y funciones de edición.
 */
const usePeliculas = () => {
  const [peliculas, setPeliculas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [aviso, setAviso] = useState("");

  useEffect(() => {
    const cargarPeliculas = async () => {
      try {
        setPeliculas(await obtenerPeliculas());
      } catch {
        setError("No se pudo conectar con el servidor. Probá de nuevo más tarde.");
      } finally {
        setCargando(false);
      }
    };

    cargarPeliculas();
  }, []);

  /**
   * Aplica cambios parciales a una película en el servidor y en el estado local.
   * @param {string|number} id - Id de la película.
   * @param {Object} cambios - Campos a actualizar.
   * @returns {Promise<boolean>} true si se guardó; false si falló (y deja un aviso).
   */
  const guardarCambios = async (id, cambios) => {
    try {
      const actualizada = await actualizarPelicula(id, cambios);
      setPeliculas((actuales) =>
        actuales.map((peli) => (peli.id === id ? actualizada : peli))
      );
      setAviso("");
      return true;
    } catch {
      setAviso("No se pudieron guardar los cambios. Probá de nuevo.");
      return false;
    }
  };

  /**
   * Alterna una película entre Vista y Pendiente. Al volver a Pendiente
   * se reinician favorita, compañía y cine.
   * @param {Object} peli - Película a modificar.
   */
  const alternarEstado = (peli) => {
    const cambios =
      peli.estado === "Vista"
        ? { estado: "Pendiente", favorita: false, compania: "", enCine: false }
        : { estado: "Vista" };

    guardarCambios(peli.id, cambios);
  };

  /**
   * Marca o desmarca una película como favorita. Solo se pueden marcar
   * películas vistas y hasta MAX_FAVORITAS; si no se cumple, deja un aviso.
   * @param {Object} peli - Película a modificar.
   */
  const alternarFavorito = (peli) => {
    if (!peli.favorita) {
      if (peli.estado !== "Vista") {
        setAviso("Solo podés marcar como favoritas las películas que ya viste.");
        return;
      }
      if (peliculas.filter((p) => p.favorita).length >= MAX_FAVORITAS) {
        setAviso(`Solo podés tener ${MAX_FAVORITAS} películas favoritas como máximo.`);
        return;
      }
    }

    guardarCambios(peli.id, { favorita: !peli.favorita });
  };

  /**
   * Puntúa una película; si se elige otra vez la misma nota, baja un punto.
   * @param {Object} peli - Película a puntuar.
   * @param {number} valor - Puntuación elegida (de 1 a 10).
   */
  const puntuar = (peli, valor) => {
    const puntuacion = valor === peli.puntuacion ? valor - 1 : valor;
    guardarCambios(peli.id, { puntuacion });
  };

  /**
   * Guarda la reseña personal de una película.
   * @param {Object} peli - Película a modificar.
   * @param {string} resena - Texto de la reseña.
   * @returns {Promise<boolean>} true si se guardó correctamente.
   */
  const guardarResena = (peli, resena) => guardarCambios(peli.id, { resena });


  /**
   * Elimina una película del servidor y del estado local.
   * @param {string|number} id - Id de la película.
   * @returns {Promise<boolean>} true si se eliminó; false si falló (y deja un aviso).
   */
  const eliminar = async (id) => {
    try {
      await eliminarPelicula(id);
      setPeliculas((actuales) => actuales.filter((peli) => peli.id !== id));
      setAviso("");
      return true;
    } catch {
      setAviso("No se pudo eliminar la película. Probá de nuevo.");
      return false;
    }
  };
  
  /** Borra el aviso de error o advertencia actual. */
  const limpiarAviso = () => setAviso("");

  return {
    peliculas,
    cargando,
    error,
    aviso,
    limpiarAviso,
    alternarEstado,
    alternarFavorito,
    puntuar,
    guardarResena,
    eliminar,
  };
};

export default usePeliculas;