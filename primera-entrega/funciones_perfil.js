// Misma clave de localStorage que usa script.js en el catálogo
const CLAVE_STORAGE = "cineteca_pelis";
const MAX_FAVORITAS = 3;

/**
 * Lee las películas que guardó el catálogo (index.html) en localStorage.
 * @method obtenerPeliculasGuardadas
 * @return {Array} Arreglo de películas (vacío si no hay nada guardado)
 */
const obtenerPeliculasGuardadas = () => {
    try {
        const guardadas = localStorage.getItem(CLAVE_STORAGE);
        return guardadas ? JSON.parse(guardadas) : [];
    } catch (error) {
        return [];
    }
};

/**
 * Guarda el arreglo de películas en localStorage.
 * @method guardarPeliculasEnStorage
 * @param {Array} peliculas - Arreglo completo de películas
 * @return {void}
 */
const guardarPeliculasEnStorage = (peliculas) => {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(peliculas));
};

/**
 * Genera la lista de películas para elegir favoritas, la lista de pendientes y calcula las estadísticas.
 * @method cargarPerfil
 * @return {void} Actualiza la vista de perfil.html con datos reales
 */
const cargarPerfil = () => {
    const contenedorFavoritas = document.getElementById("contenedor-favoritas-lista");
    const listaPendientes = document.querySelector(".lista-pendientes");

    if (!contenedorFavoritas || !listaPendientes) return;

    const peliculas = obtenerPeliculasGuardadas();

    contenedorFavoritas.innerHTML = "";
    listaPendientes.innerHTML = "";

    if (peliculas.length === 0) {
        contenedorFavoritas.innerHTML = "<p class='mensaje-vacio'>Registra películas para elegirlas como favoritas.</p>";
        listaPendientes.innerHTML = "<li class='tarjeta-pendiente'>No hay películas pendientes registradas.</li>";

        document.getElementById("stat-vistas").textContent = "0";
        document.getElementById("stat-pendientes").textContent = "0";
        document.getElementById("stat-nota-media").textContent = "- / 10";
        document.getElementById("stat-genero-top").textContent = "N/A";
        actualizarContadorFavoritos();
        return;
    }

    const pendientes = peliculas.filter((p) => p.estado === "Pendiente");
    const vistas = peliculas.filter((p) => p.estado === "Vista");

    // Favoritas: el identificador es la posición en el arreglo (igual que en el catálogo)
    peliculas.forEach((pelicula, indice) => {
        const div = document.createElement("div");
        div.className = "item-favorita";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `fav-pelicula-${indice}`;
        checkbox.className = "check-favorito";
        checkbox.checked = pelicula.favorita === true;
        checkbox.addEventListener("change", () => marcarFavorito(indice));

        const etiqueta = document.createElement("label");
        etiqueta.htmlFor = checkbox.id;
        etiqueta.textContent = `${pelicula.titulo} (${pelicula.genero}) - ${pelicula.estado}`;

        div.append(checkbox, etiqueta);
        contenedorFavoritas.appendChild(div);
    });

    // Pendientes
    if (pendientes.length === 0) {
        listaPendientes.innerHTML = "<li class='tarjeta-pendiente'>No tienes películas pendientes.</li>";
    } else {
        pendientes.forEach((p) => {
            const item = document.createElement("li");
            item.className = "tarjeta-pendiente";

            const titulo = document.createElement("strong");
            titulo.textContent = p.titulo;

            const detalle = document.createElement("span");
            detalle.textContent = p.genero;

            item.append(titulo, detalle);
            listaPendientes.appendChild(item);
        });
    }

    // Estadísticas
    // La nota media solo cuenta las películas que tienen puntuación (puede venir vacía "")
    const puntuadas = peliculas.filter((p) => Number(p.puntuacion) > 0);
    const sumaNotas = puntuadas.reduce((suma, p) => suma + Number(p.puntuacion), 0);
    const notaMedia = puntuadas.length > 0 ? (sumaNotas / puntuadas.length).toFixed(1) : "-";

    // Género más visto: se cuenta solo entre las películas vistas
    const generosContador = {};
    vistas.forEach((p) => {
        generosContador[p.genero] = (generosContador[p.genero] || 0) + 1;
    });

    let generoMasVisto = "N/A";
    let maxConteo = 0;
    Object.entries(generosContador).forEach(([genero, conteo]) => {
        if (conteo > maxConteo) {
            maxConteo = conteo;
            generoMasVisto = genero;
        }
    });

    document.getElementById("stat-vistas").textContent = vistas.length;
    document.getElementById("stat-pendientes").textContent = pendientes.length;
    document.getElementById("stat-nota-media").textContent = `${notaMedia} / 10`;
    document.getElementById("stat-genero-top").textContent = generoMasVisto;

    actualizarContadorFavoritos();
};

/**
 * Controla que no se marquen más de 3 películas como favoritas y persiste la elección.
 * @method marcarFavorito
 * @param {number} indice - Posición de la película en el arreglo guardado
 * @return {boolean} true si se aceptó el cambio, false si excedió el límite de 3
 */
const marcarFavorito = (indice) => {
    const peliculas = obtenerPeliculasGuardadas();
    const pelicula = peliculas[indice];
    const checkbox = document.getElementById(`fav-pelicula-${indice}`);

    if (!pelicula || !checkbox) return false;

    if (checkbox.checked) {
        const cantidadFavoritas = peliculas.filter((p) => p.favorita).length;
        if (cantidadFavoritas >= MAX_FAVORITAS) {
            alert(`Error: Solo puedes seleccionar un máximo de ${MAX_FAVORITAS} películas como favoritas.`);
            checkbox.checked = false;
            return false;
        }
        pelicula.favorita = true;
    } else {
        pelicula.favorita = false;
    }

    guardarPeliculasEnStorage(peliculas);
    actualizarContadorFavoritos();
    return true;
};

/**
 * Actualiza el indicador textual del límite de favoritas.
 * @method actualizarContadorFavoritos
 * @return {void}
 */
const actualizarContadorFavoritos = () => {
    const seleccionados = document.querySelectorAll(".check-favorito:checked");
    const contadorElemento = document.getElementById("contador-favoritos");
    if (contadorElemento) {
        contadorElemento.textContent = `Favoritas seleccionadas: ${seleccionados.length} / ${MAX_FAVORITAS}`;
    }
};

document.addEventListener("DOMContentLoaded", cargarPerfil);