/**
 * Genera la lista de películas para seleccionar favoritas, la lista de pendientes y calcula las estadísticas en el perfil.
 * @method cargarPerfil
 * @param Ninguno
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
        document.getElementById("stat-nota-media").textContent = "0 / 10";
        document.getElementById("stat-genero-top").textContent = "N/A";
        actualizarContadorFavoritos();
        return;
    }

    const pendientes = peliculas.filter((p) => p.estado === "Pendiente");
    const vistas = peliculas.filter((p) => p.estado === "Vista");

    peliculas.forEach((pelicula) => {
        const div = document.createElement("div");
        div.className = "item-favorita";

        const checkedAttr = pelicula.esFavorita ? "checked" : "";

        div.innerHTML = `
            <input type="checkbox" id="fav-pelicula-${pelicula.id}" class="check-favorito" ${checkedAttr} onchange="marcarFavorito('${pelicula.id}')">
            <label for="fav-pelicula-${pelicula.id}">${pelicula.nombre} (${pelicula.genero}) - ${pelicula.estado}</label>
        `;
        contenedorFavoritas.appendChild(div);
    });

    if (pendientes.length === 0) {
        listaPendientes.innerHTML = "<li class='tarjeta-pendiente'>No tienes películas pendientes.</li>";
    } else {
        pendientes.forEach((p) => {
            const item = document.createElement("li");
            item.className = "tarjeta-pendiente";
            item.innerHTML = `<strong>${p.nombre}</strong> - ${p.genero} (Pendiente)`;
            listaPendientes.appendChild(item);
        });
    }

    let sumaNotas = 0;
    const generosContador = {};

    peliculas.forEach((p) => {
        sumaNotas += Number(p.calificacion);
        generosContador[p.genero] = (generosContador[p.genero] || 0) + 1;
    });

    const notaMedia = (sumaNotas / peliculas.length).toFixed(1);

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
 * Controla que el usuario no marque más de 3 películas como favoritas y persiste la elección.
 * @method marcarFavorito
 * @param {string} idPelicula - Identificador unívoco de la película
 * @return {boolean} Retorna verdadero si se aceptó el cambio, falso si excedió el límite de 3
 */
const marcarFavorito = (idPelicula) => {
    const peliculas = obtenerPeliculasGuardadas();
    const favoritasActuales = peliculas.filter((p) => p.esFavorita);
    const targetPelicula = peliculas.find((p) => p.id === Number(idPelicula));

    if (!targetPelicula) return false;

    const checkbox = document.getElementById(`fav-pelicula-${idPelicula}`);

    if (checkbox.checked) {
        if (favoritasActuales.length >= 3) {
            alert("Error: Solo puedes seleccionar un máximo de 3 películas como favoritas.");
            checkbox.checked = false;
            return false;
        }
        targetPelicula.esFavorita = true;
    } else {
        targetPelicula.esFavorita = false;
    }

    guardarPeliculasEnStorage(peliculas);
    actualizarContadorFavoritos();
    return true;
};

/**
 * Actualiza el indicador textual del límite de favoritas en la pantalla de perfil.
 * @method actualizarContadorFavoritos
 * @param Ninguno
 * @return {void} No retorna valor
 */
const actualizarContadorFavoritos = () => {
    const seleccionados = document.querySelectorAll('.check-favorito:checked');
    const contadorElemento = document.getElementById("contador-favoritos");
    if (contadorElemento) {
        contadorElemento.textContent = `Favoritas seleccionadas: ${seleccionados.length} / 3`;
    }
};