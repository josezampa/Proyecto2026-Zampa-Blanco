const Campo = ({
  id,
  etiqueta,
  error,
  elemento: Elemento = "input",
  claseContenedor = "",
  children,
  ...resto
}) => {
  const idError = `${id}-error`;

  return (
    <div className={`campo-form ${claseContenedor}`.trim()}>
      <label htmlFor={id}>{etiqueta}</label>
      <Elemento
        id={id}
        className="campo"
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? idError : undefined}
        {...resto}
      >
        {children}
      </Elemento>
      {error && (
        <p id={idError} className="error-campo" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default Campo;