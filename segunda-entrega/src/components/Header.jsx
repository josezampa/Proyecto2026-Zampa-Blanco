import { NavLink } from "react-router-dom";
import logo from "@assets/logo_cineteca.png";

const Header = () => {
  return (
    <header className="encabezado">
      <div className="cont-logo">
        <img src={logo} alt="Logo de Cineteca, rollo de película" />
        <div>
          <h1>Cineteca</h1>
          <p>Tu archivo personal de cine</p>
        </div>
      </div>
      <nav className="menu-superior">
        <NavLink to="/" end className="btn-nav">Catálogo</NavLink>
        <NavLink to="/agregar" className="btn-nav">Agregar</NavLink>
        <NavLink to="/perfil" className="btn-nav">Perfil</NavLink>
      </nav>
    </header>
  );
};

export default Header;