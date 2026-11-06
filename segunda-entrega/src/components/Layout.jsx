import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "@components/Header";
import Footer from "@components/Footer";
import useLocalStorage from "@hooks/useLocalStorage";

const TITULOS = {
  "/": "Cineteca - Catálogo",
  "/agregar": "Cineteca - Agregar",
  "/perfil": "Cineteca - Perfil",
  "/login": "Cineteca - Login",
};

const Layout = () => {
  const { pathname } = useLocation();
  const [isLogged, setIsLogged] = useLocalStorage("cineteca-isLogged", false);

  useEffect(() => {
    document.title = TITULOS[pathname] ?? "Cineteca";
  }, [pathname]);

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;