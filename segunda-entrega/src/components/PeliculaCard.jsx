const PeliculaCard = ({ pelicula, onAlternarEstado, onAlternarFavorito }) => {
  const puntuacion = pelicula.puntuacion || "-";

  return (
    <article className="tarjeta-peli">
      <div className="cont-portada">
        <span className="puntuacion">{puntuacion}/10</span>
        <span className="genero-portada">{pelicula.genero}</span>
        <button
          type="button"
          className="icono-favorito"
          aria-label="Favorita"
          aria-pressed={pelicula.favorita}
          onClick={() => onAlternarFavorito(pelicula)}
        >
          {pelicula.favorita ? "♥" : "♡"}
        </button>
        <button
          type="button"
          className="btn-hover-vista"
          onClick={() => onAlternarEstado(pelicula)}
        >
          {pelicula.estado === "Vista" ? "Vista ✓" : "+ Marcar"}
        </button>
      </div>
      <div className="info-tarjeta">
        <p className="gen-year">
          {pelicula.genero} - {pelicula.anio}
        </p>
        <h3>{pelicula.titulo}</h3>
        <p className="director">{pelicula.director}</p>
      </div>
    </article>
  );
};

export default PeliculaCard;