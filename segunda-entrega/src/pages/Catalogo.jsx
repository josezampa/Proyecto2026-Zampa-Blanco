import { useState } from "react";
import { GENEROS } from "@api/peliculas";
import usePeliculas from "@hooks/usePeliculas";
import useLocalStorage from "@hooks/useLocalStorage";
import Boton from "@components/Boton";
import PeliculaCard from "@components/PeliculaCard";
import FiltroGrupo from "@components/FiltroGrupo";
import DetallePelicula from "@components/DetallePelicula";

const FILTROS_ESTADO = {
  Todas: () => true,
  Vistas: (peli) => peli.estado === "Vista",
  Pendientes: (peli) => peli.estado === "Pendiente",
  Favoritas: (peli) => peli.favorita,
};

const OPCIONES_GENERO = ["Todos", ...GENEROS];

const Catalogo = () => {
  const {
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
  } = usePeliculas();
  const [busqueda, setBusqueda] = useState("");
  const [ordenDescendente, setOrdenDescendente] = useLocalStorage(
    "cineteca-orden-descendente",
    true
  );
  const [filtroEstado, setFiltroEstado] = useLocalStorage(
    "cineteca-filtro-estado",
    "Todas"
  );
  const [filtroGenero, setFiltroGenero] = useLocalStorage(
    "cineteca-filtro-genero",
    "Todos"
  );
  const [peliculaAbiertaId, setPeliculaAbiertaId] = useState(null);

  const cerrarDetalle = () => {
    setPeliculaAbiertaId(null);
    limpiarAviso();
  };

  const eliminarAbierta = async (id) => {
    if (await eliminar(id)) setPeliculaAbiertaId(null);
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
          opciones={OPCIONES_GENERO}
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
          <Boton onClick={() => setOrdenDescendente((actual) => !actual)}>
            Año {ordenDescendente ? "▼" : "▲"}
          </Boton>
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
          onEliminar={eliminarAbierta}
        />
      )}
    </div>
  );
};

export default Catalogo;