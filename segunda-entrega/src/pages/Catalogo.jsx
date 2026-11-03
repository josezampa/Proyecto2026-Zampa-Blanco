import { useEffect, useState } from "react";
import {
  obtenerPeliculas,
  actualizarPelicula,
  eliminarPelicula,
} from "@api/peliculas";
import PeliculaCard from "@components/PeliculaCard";
import FiltroGrupo from "@components/FiltroGrupo";
import DetallePelicula from "@components/DetallePelicula";

const MAX_FAVORITAS = 3;

const FILTROS_ESTADO = {
  Todas: () => true,
  Vistas: (peli) => peli.estado === "Vista",
  Pendientes: (peli) => peli.estado === "Pendiente",
  Favoritas: (peli) => peli.favorita,
};

const GENEROS = [
  "Todos",
  "Drama",
  "Terror",
  "Comedia",
  "Acción",
  "Romance",
  "Ciencia ficción",
  "Thriller",
  "Otro",
];

const Catalogo = () => {
  const [peliculas, setPeliculas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [ordenDescendente, setOrdenDescendente] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState("Todas");
  const [filtroGenero, setFiltroGenero] = useState("Todos");
  const [aviso, setAviso] = useState("");
  const [peliculaAbiertaId, setPeliculaAbiertaId] = useState(null);

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
      setPeliculaAbiertaId(null);
      setAviso("");
    } catch {
      setAviso("No se pudo eliminar la película. Probá de nuevo.");
    }
  };

  const cerrarDetalle = () => {
    setPeliculaAbiertaId(null);
    setAviso("");
  };

  if (cargando) return <p>Cargando películas...</p>;
  if (error) return <p role="alert">{error}</p>;

  const texto = busqueda.trim().toLowerCase();

  const peliculasVisibles = peliculas
    .filter(FILTROS_ESTADO[filtroEstado])
    .filter((peli) => filtroGenero === "Todos" || peli.genero === filtroGenero)
    .filter(
      (peli) =>
        peli.titulo.toLowerCase().includes(texto) ||
        peli.director.toLowerCase().includes(texto)
    )
    .sort((a, b) => (ordenDescendente ? b.anio - a.anio : a.anio - b.anio));

  const peliculaAbierta = peliculas.find((peli) => peli.id === peliculaAbiertaId);

  return (
    <div className="cont-catalogo">
      <aside className="menu-lateral">
        <FiltroGrupo
          titulo="Estado"
          opciones={Object.keys(FILTROS_ESTADO)}
          activa={filtroEstado}
          onSeleccionar={setFiltroEstado}
        />
        <FiltroGrupo
          titulo="Género"
          opciones={GENEROS}
          activa={filtroGenero}
          onSeleccionar={setFiltroGenero}
        />
      </aside>

      <div className="resultados">
        <div className="busqueda">
          <label htmlFor="buscar-peli">Buscar película:</label>
          <input
            type="search"
            id="buscar-peli"
            className="campo"
            placeholder="Título o director..."
            maxLength={50}
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button
            type="button"
            className="btn-filtro"
            onClick={() => setOrdenDescendente((actual) => !actual)}
          >
            Año {ordenDescendente ? "▼" : "▲"}
          </button>
        </div>

        {aviso && !peliculaAbierta && (
          <p className="aviso" role="alert">
            {aviso}
          </p>
        )}

        {peliculasVisibles.length === 0 ? (
          <p className="mensaje-vacio">
            {peliculas.length === 0
              ? "Todavía no cargaste películas. Sumá la primera desde la sección Agregar."
              : "No hay películas que coincidan con la búsqueda o los filtros."}
          </p>
        ) : (
          <div className="grilla-pelis">
            {peliculasVisibles.map((peli) => (
              <PeliculaCard
                key={peli.id}
                pelicula={peli}
                onAbrir={setPeliculaAbiertaId}
                onAlternarEstado={alternarEstado}
                onAlternarFavorito={alternarFavorito}
              />
            ))}
          </div>
        )}
      </div>

      {peliculaAbierta && (
        <DetallePelicula
          pelicula={peliculaAbierta}
          aviso={aviso}
          onCerrar={cerrarDetalle}
          onAlternarEstado={alternarEstado}
          onAlternarFavorito={alternarFavorito}
          onPuntuar={puntuar}
          onGuardarResena={guardarResena}
          onEliminar={eliminar}
        />
      )}
    </div>
  );
};

export default Catalogo;