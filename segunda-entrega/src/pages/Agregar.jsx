import { useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { agregarPelicula, GENEROS, COMPANIAS } from "@api/peliculas";
import Campo from "@components/Campo";
import Boton from "@components/Boton";


const ANIO_MIN = 1888;
const ANIO_MAX = new Date().getFullYear();
const CAMPOS_NUMERICOS = ["anio", "puntuacion"];

const VALORES_INICIALES = {
  titulo: "",
  director: "",
  anio: "",
  genero: "",
  estado: "Pendiente",
  puntuacion: "",
  compania: "",
  enCine: false,
  sinopsis: "",
  resena: "",
};

/**
 * Valida los campos del formulario de alta de película.
 * @param {Object} valores - Valores actuales del formulario.
 * @param {string} valores.titulo - Título ingresado.
 * @param {string} valores.anio - Año ingresado, como texto.
 * @param {string} valores.puntuacion - Puntuación ingresada, como texto.
 * @returns {Object<string, string>} Mensaje de error por nombre de campo; vacío si no hay errores.
 */
const validar = (valores) => {
  const errores = {};
  const anio = Number(valores.anio);
  const puntuacion = Number(valores.puntuacion);

  if (valores.titulo.trim() === "") {
    errores.titulo = "Ingresá el título de la película.";
  }

  if (anio < ANIO_MIN || anio > ANIO_MAX) {
    errores.anio = `Ingresá un año válido entre ${ANIO_MIN} y ${ANIO_MAX}.`;
  }

  if (valores.puntuacion !== "" && (puntuacion < 1 || puntuacion > 10)) {
    errores.puntuacion = "La puntuación debe ser un número entero del 1 al 10.";
  }

  return errores;
};

const Agregar = () => {
  const navigate = useNavigate();
  const { isLogged } = useOutletContext();
  const [valores, setValores] = useState(VALORES_INICIALES);
  const [tocados, setTocados] = useState({});
  const [intentoEnvio, setIntentoEnvio] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState("");

  const errores = validar(valores);
  const esVista = valores.estado === "Vista";

  const mostrarError = (nombre) =>
    tocados[nombre] || intentoEnvio ? errores[nombre] : undefined;

  const cambiar = (e) => {
    const { name, type, checked } = e.target;
    let valor = type === "checkbox" ? checked : e.target.value;

    if (CAMPOS_NUMERICOS.includes(name)) {
      valor = valor.replace(/\D/g, "");
    }

    setValores((actuales) => {
      const nuevos = { ...actuales, [name]: valor };

      if (name === "estado" && valor === "Pendiente") {
        return { ...nuevos, puntuacion: "", compania: "", enCine: false };
      }

      return nuevos;
    });
    setTocados((actuales) => ({ ...actuales, [name]: true }));
  };

  const guardar = async (e) => {
    e.preventDefault();
    setIntentoEnvio(true);

    const [primerError] = Object.keys(errores);
    if (primerError) {
      e.currentTarget.elements[primerError].focus();
      return;
    }

    setGuardando(true);
    setErrorEnvio("");

    try {
      await agregarPelicula({
        titulo: valores.titulo.trim(),
        director: valores.director.trim() || "Director desconocido",
        anio: Number(valores.anio),
        genero: valores.genero || "Otro",
        estado: valores.estado,
        puntuacion: Number(valores.puntuacion) || 0,
        compania: valores.compania,
        enCine: valores.enCine,
        sinopsis: valores.sinopsis.trim(),
        resena: valores.resena.trim(),
        favorita: false,
      });
      navigate("/");
    } catch {
      setErrorEnvio("No se pudo guardar la película. Probá de nuevo.");
      setGuardando(false);
    }
  };

  return (
    <div className="contenedor-form">
      <h2>Agregar nueva película</h2>

      <form className="form-pelicula" noValidate onSubmit={guardar}>
        <Campo
          id="input-titulo"
          name="titulo"
          etiqueta="Título:"
          claseContenedor="campo-largo"
          placeholder="Ej: Taken"
          maxLength={60}
          value={valores.titulo}
          onChange={cambiar}
          error={mostrarError("titulo")}
        />

        <Campo
          id="input-director"
          name="director"
          etiqueta="Director:"
          placeholder="Nombre del director"
          maxLength={50}
          value={valores.director}
          onChange={cambiar}
        />

        <Campo
          id="input-anio"
          name="anio"
          etiqueta="Año:"
          placeholder="Ej: 2008"
          maxLength={4}
          inputMode="numeric"
          value={valores.anio}
          onChange={cambiar}
          error={mostrarError("anio")}
        />

        <Campo
          id="input-genero"
          name="genero"
          etiqueta="Género:"
          elemento="select"
          value={valores.genero}
          onChange={cambiar}
        >
          <option value="">Seleccioná un género</option>
          {GENEROS.map((genero) => (
            <option key={genero} value={genero}>
              {genero}
            </option>
          ))}
        </Campo>

        <Campo
          id="input-estado"
          name="estado"
          etiqueta="Estado:"
          elemento="select"
          value={valores.estado}
          onChange={cambiar}
        >
          <option value="Pendiente">Pendiente</option>
          <option value="Vista">Vista</option>
        </Campo>

        <Campo
          id="input-puntuacion"
          name="puntuacion"
          etiqueta="Puntuación:"
          placeholder="Del 1 al 10"
          maxLength={2}
          inputMode="numeric"
          disabled={!esVista}
          value={valores.puntuacion}
          onChange={cambiar}
          error={mostrarError("puntuacion")}
        />

        <Campo
          id="input-compania"
          name="compania"
          etiqueta="¿Con quién la viste?"
          elemento="select"
          disabled={!esVista}
          value={valores.compania}
          onChange={cambiar}
        >
          <option value="">No especificar</option>
          {COMPANIAS.map((compania) => (
            <option key={compania} value={compania}>
              {compania}
            </option>
          ))}
        </Campo>

        <div className="campo-form campo-checkbox campo-largo">
          <input
            type="checkbox"
            id="input-cine"
            name="enCine"
            disabled={!esVista}
            checked={valores.enCine}
            onChange={cambiar}
          />
          <label htmlFor="input-cine">Vista en el cine</label>
        </div>

        <Campo
          id="input-sinopsis"
          name="sinopsis"
          etiqueta="Sinopsis:"
          elemento="textarea"
          claseContenedor="campo-largo"
          placeholder="Breve descripción de la película"
          rows={4}
          maxLength={500}
          value={valores.sinopsis}
          onChange={cambiar}
        />

        <Campo
          id="input-resena"
          name="resena"
          etiqueta="Reseña personal:"
          elemento="textarea"
          claseContenedor="campo-largo"
          placeholder="Escribí tu opinión de la película..."
          rows={4}
          maxLength={500}
          value={valores.resena}
          onChange={cambiar}
        />

        {errorEnvio && (
          <p className="aviso campo-largo" role="alert">
            {errorEnvio}
          </p>
        )}

        {!isLogged && (
          <p className="ayuda campo-largo">
            Iniciá sesión para poder guardar la película.{" "}
            <Link to="/login">Ir al login</Link>
          </p>
        )}

        <div className="acciones-form campo-largo">
          <Boton type="submit" variante="principal" disabled={guardando || !isLogged}>
            {guardando ? "Guardando..." : "Guardar"}
          </Boton>
          <Link to="/" className="btn-filtro">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Agregar;