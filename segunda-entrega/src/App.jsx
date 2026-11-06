import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "@components/Layout";
import Catalogo from "@pages/Catalogo";
import Agregar from "@pages/Agregar";
import Perfil from "@pages/Perfil";
import Login from "@pages/Login";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Catalogo />} />
        <Route path="agregar" element={<Agregar />} />
        <Route path="perfil" element={<Perfil />} />
        <Route path="login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default App;