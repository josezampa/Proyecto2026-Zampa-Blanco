import { useEffect, useState } from "react";

/**
 * Hook que se usa como useState, pero guarda el valor en localStorage
 * y lo recupera al volver a montar el componente.
 * @template T
 * @param {string} clave - Clave bajo la que se guarda el valor.
 * @param {T} valorInicial - Valor a usar si no hay nada guardado o no se puede leer.
 * @returns {[T, function(T | function(T): T): void]} El valor actual y su función para actualizarlo.
 */
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