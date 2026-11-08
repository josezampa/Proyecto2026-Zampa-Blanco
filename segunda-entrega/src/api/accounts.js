const URL_CUENTAS = "http://localhost:3001/accounts";

/**
 * Obtiene todas las cuentas registradas en el mock.
 * @returns {Promise<Array<{id: string, usuario: string, clave: string}>>} Lista de cuentas.
 * @throws {Error} Si el servidor responde con un error.
 */
export const obtenerCuentas = async () => {
  const respuesta = await fetch(URL_CUENTAS);

  if (!respuesta.ok) {
    throw new Error("No se pudieron cargar las cuentas.");
  }

  return await respuesta.json();
};

/**
 * Guarda una cuenta nueva en el mock.
 * @param {{usuario: string, clave: string}} cuenta - Datos de la cuenta a crear.
 * @returns {Promise<{id: string, usuario: string, clave: string}>} Cuenta creada, con su id.
 * @throws {Error} Si el servidor responde con un error.
 */
export const crearCuenta = async (cuenta) => {
  const respuesta = await fetch(URL_CUENTAS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cuenta),
  });

  if (!respuesta.ok) {
    throw new Error("No se pudo crear la cuenta.");
  }

  return await respuesta.json();
};