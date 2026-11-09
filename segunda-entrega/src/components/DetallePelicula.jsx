import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const PUNTOS = Array.from({ length: 10 }, (_, indice) => indice + 1);

const DetallePelicula = ({
  pelicula,
  puedeEditar,
  aviso,
  onCerrar,
  onAlternarEstado,
  onAlternarFavorito,
  onPuntuar,
  onGuardarResena,
  onEliminar,
}) => {
  const dialogoRef = useRef(null);
  const [confirmando, setConfirmando] = useState(false);
  const [resena, setResena] = useState(pelicula.resena);
  const [resenaGuardada, setResenaGuardada] = useState(false);
  const esVista = pelicula.estado === "Vista";

  useEffect(() => {
    const dialogo = dialogoRef.current;
    if (!dialogo.open) dialogo.showModal();
  }, []);

  const contexto =
    pelicula.estado === "Pendiente"
      ? "Pendiente de ver"
      : [pelicula.compania, pelicula.enCine && "En el cine"]
          .filter(Boolean)
          .join(" · ") || "Vista";

  const cambiarResena = (e) => {
    setResena(e.target.value);
    setResenaGuardada(false);
  };

  const guardarResena = async () => {
    setResenaGuardada(await onGuardarResena(pelicula, resena.trim()));
  };

  return (
    <dialog
      ref={dialogoRef}
      className="modal"
      aria-labelledby="detalle-titulo"
      onClose={onCerrar}
      onClick={(e) => {
        if (e.target === e.currentTarget) onCerrar();
      }}
    >
      <div className="modal-contenido">
        <button
          type="button"
          className="btn-cerrar-x"
          aria-label="Cerrar detalle"
          onClick={onCerrar}
        >
          ✕
        </button>

        <p className="detalle-gen-year">
          {pelicula.genero} · {pelicula.anio}
        </p>
        <h2 id="detalle-titulo">{pelicula.titulo}</h2>
        <p className="detalle-director">{pelicula.director}</p>
        <p className="detalle-contexto">{contexto}</p>

        <div>
          <p id="etiqueta-puntuacion" className="detalle-puntuacion">
            Puntuación: {pelicula.puntuacion || "-"}/10
          </p>
          <div className="puntos" role="group" aria-labelledby="etiqueta-puntuacion">
            {PUNTOS.map((valor) => (
              <button
                key={valor}
                type="button"
                className="btn-punto"
                aria-label={`Puntuar con ${valor}`}
                aria-pressed={valor <= pelicula.puntuacion}
                disabled={!esVista || !puedeEditar}
                onClick={() => onPuntuar(pelicula, valor)}
              >
                {valor <= pelicula.puntuacion ? "■" : "□"}
              </button>
            ))}
          </div>
          {!esVista && puedeEditar && (
            <p className="ayuda">Marcá la película como vista para puntuarla.</p>
          )}
        </div>

        {pelicula.sinopsis && (
          <p className="detalle-sinopsis">{pelicula.sinopsis}</p>
        )}

        <div className="seccion-resena">
          <label htmlFor="detalle-resena">Reseña</label>
          <textarea
            id="detalle-resena"
            className="campo"
            rows={4}
            maxLength={500}
            placeholder="Escribí tu reseña personal..."
            value={resena}
            disabled={!puedeEditar}
            onChange={cambiarResena}
          />
          <div className="acciones-resena">
            <button
              type="button"
              className="btn-principal"
              disabled={!puedeEditar}
              onClick={guardarResena}
            >
              Guardar reseña
            </button>
            {resenaGuardada && <span role="status">Reseña guardada.</span>}
          </div>
        </div>

        {aviso && (
          <p className="aviso" role="alert">
            {aviso}
          </p>
        )}

        {!puedeEditar && (
          <p className="ayuda">
            Iniciá sesión para puntuar, reseñar o modificar esta película.{" "}
            <Link to="/login">Ir al login</Link>
          </p>
        )}

        <div className="acciones-detalle">
          <button
            type="button"
            className="btn-filtro"
            disabled={!puedeEditar}
            onClick={() => onAlternarEstado(pelicula)}
          >
            {esVista ? "Marcar como pendiente" : "✓ Marcar como vista"}
          </button>
          <button
            type="button"
            className="btn-filtro"
            aria-pressed={pelicula.favorita}
            disabled={!puedeEditar}
            onClick={() => onAlternarFavorito(pelicula)}
          >
            {pelicula.favorita ? "♥ Favorita" : "♡ Favorita"}
          </button>

          <div className="zona-eliminar">
            {confirmando ? (
              <>
                <span>¿Seguro?</span>
                <button
                  type="button"
                  className="btn-eliminar"
                  onClick={() => onEliminar(pelicula.id)}
                >
                  Sí, eliminar
                </button>
                <button
                  type="button"
                  className="btn-filtro"
                  onClick={() => setConfirmando(false)}
                >
                  Cancelar
                </button>
              </>
            ) : (
              <button
                type="button"
                className="btn-eliminar"
                disabled={!puedeEditar}
                onClick={() => setConfirmando(true)}
              >
                Eliminar
              </button>
            )}
          </div>
        </div>
      </div>
    </dialog>
  );
};

export default DetallePelicula;