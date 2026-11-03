const PeliculaCard = ({ pelicula }) => {
  const puntuacion = pelicula.puntuacion || "-";

  return (
    <article className="tarjeta-peli">
      <div className="cont-portada">
        <span className="puntuacion">{puntuacion}/10</span>
        <span className="genero-portada">{pelicula.genero}</span>
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