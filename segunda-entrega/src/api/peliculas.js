const URL_API = "http://localhost:3001/peliculas";

export const obtenerPeliculas = async () => {
  const respuesta = await fetch(URL_API);

  if (!respuesta.ok) {
    throw new Error("No se pudieron cargar las películas.");
  }

  return await respuesta.json();
};

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

export const eliminarPelicula = async (id) => {
  const respuesta = await fetch(`${URL_API}/${id}`, { method: "DELETE" });

  if (!respuesta.ok) {
    throw new Error("No se pudo eliminar la película.");
  }
};