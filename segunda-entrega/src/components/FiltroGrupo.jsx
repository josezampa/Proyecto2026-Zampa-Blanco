const FiltroGrupo = ({ titulo, opciones, activa, onSeleccionar }) => {
  return (
    <section className="filtro-grupo">
      <h2>{titulo}</h2>
      <ul>
        {opciones.map((opcion) => (
          <li key={opcion}>
            <button
              type="button"
              className={opcion === activa ? "activa" : ""}
              aria-pressed={opcion === activa}
              onClick={() => onSeleccionar(opcion)}
            >
              {opcion}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default FiltroGrupo;