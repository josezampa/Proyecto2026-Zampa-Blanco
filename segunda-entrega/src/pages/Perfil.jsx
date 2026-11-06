import { Navigate, useOutletContext } from "react-router-dom";
import usePeliculas, { MAX_FAVORITAS } from "@hooks/usePeliculas";
import Boton from "@components/Boton";

const calcularGeneroTop = (vistas) => {
  const cantidades = {};

  vistas.forEach((peli) => {
    cantidades[peli.genero] = (cantidades[peli.genero] || 0) + 1;
  });

  const [masVisto] = Object.entries(cantidades).sort((a, b) => b[1] - a[1]);

  return masVisto ? masVisto[0] : "N/A";
};

const Perfil = () => {
  const { isLogged, setIsLogged } = useOutletContext();
  const { peliculas, cargando, error, aviso, alternarEstado, alternarFavorito } =
    usePeliculas();
  
  if (!isLogged) return <Navigate to="/login" replace />;
  if (cargando) return <p>Cargando perfil...</p>;
  if (error) return <p role="alert">{error}</p>;

  const vistas = peliculas.filter((peli) => peli.estado === "Vista");
  const pendientes = peliculas.filter((peli) => peli.estado === "Pendiente");
  const cantidadFavoritas = vistas.filter((peli) => peli.favorita).length;
  const puntuadas = vistas.filter((peli) => peli.puntuacion > 0);
  const notaMedia =
    puntuadas.length > 0
      ? (
          puntuadas.reduce((suma, peli) => suma + peli.puntuacion, 0) /
          puntuadas.length
        ).toFixed(1)
      : "-";

  return (
    <div className="contenedor-perfil">
      <section className="seccion-usuario">
        <img
          className="foto-perfil"
          src="/perfil_usuario.jpeg"
          alt="Fotografía de perfil del usuario"
        />
        <div className="datos-usuario">
          <h2>JULI Y JOSE :D</h2>
          <p>Nos gusta ver peliculas !</p>
          <Boton onClick={() => setIsLogged(false)}>Cerrar sesión</Boton>
        </div>
      </section>

      {aviso && (
        <p className="aviso" role="alert">
          {aviso}
        </p>
      )}

      <div className="perfil-grid">
        <section className="seccion-perfil">
          <h2>Películas favoritas</h2>
          <p className="indicador-limite">
            Favoritas seleccionadas: {cantidadFavoritas} / {MAX_FAVORITAS}
          </p>
          {vistas.length === 0 ? (
            <p className="mensaje-vacio">
              Todavía no marcaste ninguna película como vista.
            </p>
          ) : (
            <ul className="lista-perfil">
              {vistas.map((peli) => (
                <li key={peli.id} className="item-perfil">
                  <input
                    type="checkbox"
                    id={`favorita-${peli.id}`}
                    checked={peli.favorita}
                    disabled={!peli.favorita && cantidadFavoritas >= MAX_FAVORITAS}
                    onChange={() => alternarFavorito(peli)}
                  />
                  <label htmlFor={`favorita-${peli.id}`}>{peli.titulo}</label>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="seccion-perfil">
          <h2>Pendientes</h2>
          <p className="subtitulo-seccion">
            Las películas cargadas que aún no marcaste como vistas:
          </p>
          {pendientes.length === 0 ? (
            <p className="mensaje-vacio">No tenés películas pendientes.</p>
          ) : (
            <ul className="lista-perfil lista-pendientes">
              {pendientes.map((peli) => (
                <li key={peli.id} className="item-perfil">
                  <span>{peli.titulo}</span>
                  <Boton onClick={() => alternarEstado(peli)}>✓ Vista</Boton>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="seccion-perfil">
          <h2>Stats</h2>
          <table className="tabla-stats">
            <caption>Estadísticas de Cineteca</caption>
            <thead>
              <tr>
                <th scope="col">Métrica</th>
                <th scope="col">Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row">Películas vistas</th>
                <td>{vistas.length}</td>
              </tr>
              <tr>
                <th scope="row">Pendientes</th>
                <td>{pendientes.length}</td>
              </tr>
              <tr>
                <th scope="row">Nota media</th>
                <td>{notaMedia} / 10</td>
              </tr>
              <tr>
                <th scope="row">Género más visto</th>
                <td>{calcularGeneroTop(vistas)}</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default Perfil;