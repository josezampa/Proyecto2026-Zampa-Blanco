import { useEffect, useState } from "react";

const useLocalStorage = (clave, valorInicial) => {
  const [valor, setValor] = useState(() => {
    try {
      const guardado = localStorage.getItem(clave);
      return guardado === null ? valorInicial : JSON.parse(guardado);
    } catch {
      return valorInicial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(clave, JSON.stringify(valor));
    } catch {
      console.warn("No se pudo guardar la preferencia.");
    }
  }, [clave, valor]);

  return [valor, setValor];
};

export default useLocalStorage;