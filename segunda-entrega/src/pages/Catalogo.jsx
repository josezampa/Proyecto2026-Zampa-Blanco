import { useEffect, useState } from "react";
import { obtenerPeliculas, actualizarPelicula } from "@api/peliculas";
import PeliculaCard from "@components/PeliculaCard";
import FiltroGrupo from "@components/FiltroGrupo";

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
    } catch {
      setAviso("No se pudieron guardar los cambios. Probá de nuevo.");
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

        {aviso && (
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
                onAlternarEstado={alternarEstado}
                onAlternarFavorito={alternarFavorito}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalogo;