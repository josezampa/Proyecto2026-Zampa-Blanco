import { useState } from "react";
import {
  Link,
  Navigate,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import { obtenerCuentas, crearCuenta } from "@api/accounts";
import Campo from "@components/Campo";
import Boton from "@components/Boton";

const USUARIO_MIN = 3;
const CLAVE_MIN = 4;

const VALORES_INICIALES = {
  usuario: "",
  clave: "",
  confirmar: "",
};

/**
 * Valida los campos del formulario de creación de cuenta.
 * @param {{usuario: string, clave: string, confirmar: string}} valores - Valores actuales del formulario.
 * @returns {{usuario?: string, clave?: string, confirmar?: string}} Mensaje de error por campo; vacío si no hay errores.
 */
const validar = (valores) => {
  const errores = {};
  const usuario = valores.usuario.trim();

  if (usuario === "") {
    errores.usuario = "Ingresá un nombre de usuario.";
  } else if (usuario.length < USUARIO_MIN) {
    errores.usuario = `El usuario debe tener al menos ${USUARIO_MIN} caracteres.`;
  } else if (/\s/.test(usuario)) {
    errores.usuario = "El usuario no puede tener espacios.";
  }

  if (valores.clave === "") {
    errores.clave = "Ingresá una contraseña.";
  } else if (valores.clave.length < CLAVE_MIN) {
    errores.clave = `La contraseña debe tener al menos ${CLAVE_MIN} caracteres.`;
  }

  if (valores.confirmar === "") {
    errores.confirmar = "Repetí la contraseña.";
  } else if (valores.confirmar !== valores.clave) {
    errores.confirmar = "Las contraseñas no coinciden.";
  }

  return errores;
};

const Registro = () => {
  const navigate = useNavigate();
  const { isLogged } = useOutletContext();
  const [valores, setValores] = useState(VALORES_INICIALES);
  const [tocados, setTocados] = useState({});
  const [intentoEnvio, setIntentoEnvio] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [errorEnvio, setErrorEnvio] = useState("");

  const errores = validar(valores);

  const mostrarError = (nombre) =>
    tocados[nombre] || intentoEnvio ? errores[nombre] : undefined;

  const cambiar = (e) => {
    const { name, value } = e.target;

    setValores((actuales) => ({ ...actuales, [name]: value }));
    setTocados((actuales) => ({ ...actuales, [name]: true }));
    setErrorEnvio("");
  };

  const crear = async (e) => {
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
      const usuario = valores.usuario.trim().toLowerCase();
      const cuentas = await obtenerCuentas();

      if (cuentas.some((c) => c.usuario.toLowerCase() === usuario)) {
        setErrorEnvio("Ese nombre de usuario ya existe. Elegí otro.");
        setGuardando(false);
        return;
      }

      await crearCuenta({ usuario, clave: valores.clave });
      navigate("/login", { state: { cuentaCreada: true } });
    } catch {
      setErrorEnvio("No se pudo crear la cuenta. Probá de nuevo.");
      setGuardando(false);
    }
  };

  if (isLogged) return <Navigate to="/" replace />;

  return (
    <div className="contenedor-form contenedor-login">
      <h2>Crear cuenta</h2>

      <form className="form-pelicula form-login" noValidate onSubmit={crear}>
        <Campo
          id="input-usuario"
          name="usuario"
          etiqueta="Usuario:"
          claseContenedor="campo-largo"
          placeholder="Elegí un nombre de usuario"
          maxLength={20}
          autoComplete="username"
          value={valores.usuario}
          onChange={cambiar}
          error={mostrarError("usuario")}
        />

        <Campo
          id="input-clave"
          name="clave"
          etiqueta="Contraseña:"
          type="password"
          claseContenedor="campo-largo"
          placeholder="Elegí una contraseña"
          maxLength={20}
          autoComplete="new-password"
          value={valores.clave}
          onChange={cambiar}
          error={mostrarError("clave")}
        />

        <Campo
          id="input-confirmar"
          name="confirmar"
          etiqueta="Repetir contraseña:"
          type="password"
          claseContenedor="campo-largo"
          placeholder="Repetí la contraseña"
          maxLength={20}
          autoComplete="new-password"
          value={valores.confirmar}
          onChange={cambiar}
          error={mostrarError("confirmar")}
        />

        {errorEnvio && (
          <p className="aviso campo-largo" role="alert">
            {errorEnvio}
          </p>
        )}

        <div className="acciones-form campo-largo">
          <Boton type="submit" variante="principal" disabled={guardando}>
            {guardando ? "Creando..." : "Crear cuenta"}
          </Boton>
        </div>
      </form>

      <p className="ayuda">
        ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
      </p>
    </div>
  );
};

export default Registro;