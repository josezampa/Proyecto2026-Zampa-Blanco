import { Routes, Route } from "react-router-dom";
import Layout from "@components/Layout";
import Catalogo from "@pages/Catalogo";
import Agregar from "@pages/Agregar";
import Perfil from "@pages/Perfil";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Catalogo />} />
        <Route path="agregar" element={<Agregar />} />
        <Route path="perfil" element={<Perfil />} />
      </Route>
    </Routes>
  );
};

export default App;