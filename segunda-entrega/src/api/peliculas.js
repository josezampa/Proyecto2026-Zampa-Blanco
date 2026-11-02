const URL_API = "http://localhost:3001/peliculas";

export const obtenerPeliculas = async () => {
  const respuesta = await fetch(URL_API);

  if (!respuesta.ok) {
    throw new Error("No se pudieron cargar las películas.");
  }

  return await respuesta.json();
};