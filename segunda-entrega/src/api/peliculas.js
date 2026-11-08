const URL_API = "http://localhost:3001/peliculas";

/**
 * @typedef {Object} Pelicula
 * @property {string|number} id - Identificador generado por json-server.
 * @property {string} titulo
 * @property {string} director
 * @property {number} anio
 * @property {string} genero
 * @property {"Vista"|"Pendiente"} estado
 * @property {number} puntuacion - De 1 a 10; 0 si no está puntuada.
 * @property {string} compania - Con quién se vio; vacío si no se especificó.
 * @property {boolean} enCine
 * @property {string} sinopsis
 * @property {string} resena
 * @property {boolean} favorita
 */

export const GENEROS = [
  "Drama",
  "Terror",
  "Comedia",
  "Acción",
  "Romance",
  "Ciencia ficción",
  "Thriller",
  "Otro",
];

export const COMPANIAS = ["Solo/a", "Con amigos", "Con familia", "En pareja"];

/**
 * Obtiene todas las películas del servidor simulado.
 * @returns {Promise<Pelicula[]>} Listado de películas.
 * @throws {Error} Si la respuesta del servidor no es exitosa.
 */
export const obtenerPeliculas = async () => {
  const respuesta = await fetch(URL_API);

  if (!respuesta.ok) {
    throw new Error("No se pudieron cargar las películas.");
  }

  return await respuesta.json();
};

/**
 * Guarda una película nueva en el servidor simulado.
 * @param {Omit<Pelicula, "id">} pelicula - Datos de la película, sin id.
 * @returns {Promise<Pelicula>} La película creada, con su id.
 * @throws {Error} Si la respuesta del servidor no es exitosa.
 */
export const agregarPelicula = async (pelicula) => {
  const respuesta = await fetch(URL_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pelicula),
  });

  if (!respuesta.ok) {
    throw new Error("No se pudo guardar la película.");
  }

  return await respuesta.json();
};

/**
 * Actualiza parcialmente una película existente (PATCH).
 * @param {string|number} id - Id de la película a modificar.
 * @param {Partial<Pelicula>} cambios - Campos a actualizar.
 * @returns {Promise<Pelicula>} La película ya actualizada.
 * @throws {Error} Si la respuesta del servidor no es exitosa.
 */
export const actualizarPelicula = async (id, cambios) => {
  const respuesta = await fetch(`${URL_API}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(cambios),
  });

  if (!respuesta.ok) {
    throw new Error("No se pudo actualizar la película.");
  }

  return await respuesta.json();
};

/**
 * Elimina una película del servidor simulado.
 * @param {string|number} id - Id de la película a eliminar.
 * @returns {Promise<void>}
 * @throws {Error} Si la respuesta del servidor no es exitosa.
 */
export const eliminarPelicula = async (id) => {
  const respuesta = await fetch(`${URL_API}/${id}`, { method: "DELETE" });

  if (!respuesta.ok) {
    throw new Error("No se pudo eliminar la película.");
  }
};