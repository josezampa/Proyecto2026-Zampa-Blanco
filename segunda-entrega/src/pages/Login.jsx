import { useState } from "react";
import { Navigate, useNavigate, useOutletContext } from "react-router-dom";
import Campo from "@components/Campo";
import Boton from "@components/Boton";

const USUARIOS_VALIDOS = ["jose", "juli"];
const CLAVE_VALIDA = "1234";

const VALORES_INICIALES = {
  usuario: "",
  clave: "",
};

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
  const { isLogged, setIsLogged } = useOutletContext();
  const [valores, setValores] = useState(VALORES_INICIALES);
  const [tocados, setTocados] = useState({});
  const [intentoEnvio, setIntentoEnvio] = useState(false);
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

  const ingresar = (e) => {
    e.preventDefault();
    setIntentoEnvio(true);

    const [primerError] = Object.keys(errores);
    if (primerError) {
      e.currentTarget.elements[primerError].focus();
      return;
    }

    const usuario = valores.usuario.trim().toLowerCase();

    if (!USUARIOS_VALIDOS.includes(usuario) || valores.clave !== CLAVE_VALIDA) {
      setErrorEnvio("Usuario o contraseña incorrectos.");
      return;
    }

    setIsLogged(true);
    navigate("/");
  };

  if (isLogged) return <Navigate to="/" replace />;

  return (
    <div className="contenedor-form">
      <h2>Iniciar sesión</h2>

      <form className="form-pelicula" noValidate onSubmit={ingresar}>
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
          <Boton type="submit" variante="principal">
            Ingresar
          </Boton>
        </div>
      </form>
    </div>
  );
};

export default Login;