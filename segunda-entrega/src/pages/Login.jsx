import { useState } from "react";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import { obtenerCuentas } from "@api/accounts";
import Campo from "@components/Campo";
import Boton from "@components/Boton";

const VALORES_INICIALES = {
  usuario: "",
  clave: "",
};

/**
 * Valida los campos del formulario de login.
 * @param {{usuario: string, clave: string}} valores - Valores actuales del formulario.
 * @returns {{usuario?: string, clave?: string}} Mensaje de error por campo; vacío si no hay errores.
 */
const validar = (valores) => {
  const errores = {};

  if (valores.usuario.trim() === "") {
    errores.usuario = "Ingresá tu nombre de usuario.";
  }

  if (valores.clave === "") {
    errores.clave = "Ingresá tu contraseña.";
  }

  return errores;
};

const Login = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { isLogged, setIsLogged } = useOutletContext();
  const [valores, setValores] = useState(VALORES_INICIALES);
  const [tocados, setTocados] = useState({});
  const [intentoEnvio, setIntentoEnvio] = useState(false);
  const [verificando, setVerificando] = useState(false);
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

  const ingresar = async (e) => {
    e.preventDefault();
    setIntentoEnvio(true);

    const [primerError] = Object.keys(errores);
    if (primerError) {
      e.currentTarget.elements[primerError].focus();
      return;
    }

    setVerificando(true);
    setErrorEnvio("");

    try {
      const cuentas = await obtenerCuentas();
      const usuario = valores.usuario.trim().toLowerCase();
      const cuenta = cuentas.find(
        (c) => c.usuario.toLowerCase() === usuario && c.clave === valores.clave
      );

      if (!cuenta) {
        setErrorEnvio("Usuario o contraseña incorrectos.");
        setVerificando(false);
        return;
      }

      setIsLogged(true);
      navigate("/");
    } catch {
      setErrorEnvio("No se pudo conectar con el servidor. Probá de nuevo más tarde.");
      setVerificando(false);
    }
  };

  if (isLogged) return <Navigate to="/" replace />;

  return (
    <div className="contenedor-form contenedor-login">
      <h2>Iniciar sesión</h2>

      {state?.cuentaCreada && (
        <p className="ayuda" role="status">
          Cuenta creada. Ya podés iniciar sesión.
        </p>
      )}

      <form className="form-pelicula form-login" noValidate onSubmit={ingresar}>
        <Campo
          id="input-usuario"
          name="usuario"
          etiqueta="Usuario:"
          claseContenedor="campo-largo"
          placeholder="Tu nombre de usuario"
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
          placeholder="Tu contraseña"
          maxLength={20}
          autoComplete="current-password"
          value={valores.clave}
          onChange={cambiar}
          error={mostrarError("clave")}
        />

        {errorEnvio && (
          <p className="aviso campo-largo" role="alert">
            {errorEnvio}
          </p>
        )}

        <div className="acciones-form campo-largo">
          <Boton type="submit" variante="principal" disabled={verificando}>
            {verificando ? "Verificando..." : "Ingresar"}
          </Boton>
        </div>
      </form>

      <p className="ayuda">
        ¿No tenés cuenta? <Link to="/registro">Creá una</Link>
      </p>
    </div>
  );
};

export default Login;