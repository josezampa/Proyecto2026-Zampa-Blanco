import { useEffect, useState } from "react";
import { obtenerPeliculas } from "@api/peliculas";
import PeliculaCard from "@components/PeliculaCard";

const Catalogo = () => {
  const [peliculas, setPeliculas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [ordenDescendente, setOrdenDescendente] = useState(true);

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

  if (cargando) return <p>Cargando películas...</p>;
  if (error) return <p role="alert">{error}</p>;

  const texto = busqueda.trim().toLowerCase();

  const peliculasVisibles = peliculas
    .filter(
      (peli) =>
        peli.titulo.toLowerCase().includes(texto) ||
        peli.director.toLowerCase().includes(texto)
    )
    .sort((a, b) => (ordenDescendente ? b.anio - a.anio : a.anio - b.anio));

  return (
    <>
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

      {peliculasVisibles.length === 0 ? (
        <p className="mensaje-vacio">
          {peliculas.length === 0
            ? "Todavía no cargaste películas. Sumá la primera desde la sección Agregar."
            : "No hay películas que coincidan con la búsqueda."}
        </p>
      ) : (
        <div className="grilla-pelis">
          {peliculasVisibles.map((peli) => (
            <PeliculaCard key={peli.id} pelicula={peli} />
          ))}
        </div>
      )}
    </>
  );
};

export default Catalogo;