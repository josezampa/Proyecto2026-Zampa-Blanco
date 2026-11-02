import { useEffect, useState } from "react";
import { obtenerPeliculas } from "@api/peliculas";

const Catalogo = () => {
  const [peliculas, setPeliculas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarPeliculas = async () => {
      try {
        setPeliculas(await obtenerPeliculas());
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    cargarPeliculas();
  }, []);

  if (cargando) return <p>Cargando películas...</p>;
  if (error) return <p role="alert">{error}</p>;

  return (
    <ul>
      {peliculas.map((peli) => (
        <li key={peli.id}>
          {peli.titulo} ({peli.anio})
        </li>
      ))}
    </ul>
  );
};

export default Catalogo;