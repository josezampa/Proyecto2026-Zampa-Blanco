import { useEffect, useState } from "react";
import {
  obtenerPeliculas,
  actualizarPelicula,
  eliminarPelicula,
} from "@api/peliculas";

export const MAX_FAVORITAS = 3;

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

  const alternarEstado = (peli) => {
    const cambios =
      peli.estado === "Vista"
        ? { estado: "Pendiente", favorita: false, compania: "", enCine: false }
        : { estado: "Vista" };

    guardarCambios(peli.id, cambios);
  };

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

  const puntuar = (peli, valor) => {
    const puntuacion = valor === peli.puntuacion ? valor - 1 : valor;
    guardarCambios(peli.id, { puntuacion });
  };

  const guardarResena = (peli, resena) => guardarCambios(peli.id, { resena });

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