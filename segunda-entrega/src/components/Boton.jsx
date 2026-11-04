const Boton = ({
  variante = "filtro",
  type = "button",
  className = "",
  children,
  ...resto
}) => {
  const clases = `btn-${variante} ${className}`.trim();

  return (
    <button type={type} className={clases} {...resto}>
      {children}
    </button>
  );
};

export default Boton;