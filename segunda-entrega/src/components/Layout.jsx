import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "@components/Header";
import Footer from "@components/Footer";

const TITULOS = {
  "/": "Cineteca - Catálogo",
  "/agregar": "Cineteca - Agregar",
  "/perfil": "Cineteca - Perfil",
};

const Layout = () => {
  const { pathname } = useLocation();

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