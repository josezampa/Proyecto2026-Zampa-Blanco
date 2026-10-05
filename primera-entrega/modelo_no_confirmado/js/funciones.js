/**
 * Obtiene el arreglo de películas guardadas en localStorage. Si no existe nada registrado, retorna un arreglo vacío.
 * @method obtenerPeliculasGuardadas
 * @param Ninguno
 * @return {Array} Arreglo con los objetos de las películas registradas
 */
const obtenerPeliculasGuardadas = () => {
    const peliculas = localStorage.getItem("peliculasCineteca");
    return peliculas ? JSON.parse(peliculas) : [];
};

/**
 * Guarda el arreglo actualizado de películas en localStorage.
 * @method guardarPeliculasEnStorage
 * @param {Array} peliculas - Arreglo de objetos de películas a guardar
 * @return {void} No retorna ningún valor
 */
const guardarPeliculasEnStorage = (peliculas) => {
    localStorage.setItem("peliculasCineteca", JSON.stringify(peliculas));
};

/**
 * Captura los datos del formulario de registro, utiliza la URL de portada ingresada y guarda la nueva película.
 * @method guardarPelicula
 * @param Ninguno
 * @return {void} Notifica al usuario y limpia el formulario
 */
const guardarPelicula = () => {
    const nombre = document.getElementById("input-nombre-pelicula").value.trim();
    let urlPortada = document.getElementById("input-url-portada").value.trim();
    const director = document.getElementById("input-director").value.trim();
    const genero = document.getElementById("select-genero").value;
    const calificacion = document.getElementById("input-calificacion").value.trim();
    const estado = document.getElementById("select-estado").value;

    if (nombre === "" || director === "" || calificacion === "") {
        alert("Por favor, complete todos los campos obligatorios antes de guardar.");
        return;
    }

    if (urlPortada === "") {
        urlPortada = "imagenes/portada_el_padrino.jpg";
    }

    const nuevaPelicula = {
        id: Date.now(),
        nombre: nombre,
        urlPortada: urlPortada,
        director: director,
        genero: genero,
        calificacion: calificacion,
        estado: estado,
        esFavorita: false
    };

    const peliculas = obtenerPeliculasGuardadas();
    peliculas.push(nuevaPelicula);
    guardarPeliculasEnStorage(peliculas);

    alert(`¡La película "${nombre}" ha sido registrada con éxito!`);
    limpiarFormularioRegistro();
};

/**
 * Lee las películas de localStorage y renderiza sus portadas e información en la cartelera principal (index.html).
 * @method cargarPeliculas
 * @param Ninguno
 * @return {void} Renderiza las tarjetas dentro del grid
 */
const cargarPeliculas = () => {
    const contenedor = document.getElementById("grid-peliculas");
    if (!contenedor) return;

    const peliculas = obtenerPeliculasGuardadas();
    contenedor.innerHTML = "";

    if (peliculas.length === 0) {
        contenedor.innerHTML = "<p class='mensaje-vacio'>No hay películas registradas. Agrega una desde la sección 'Agregar Película'.</p>";
        return;
    }

    peliculas.forEach((pelicula) => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "tarjeta-pelicula";
        tarjeta.setAttribute("data-genero", pelicula.genero);

        tarjeta.innerHTML = `
            <img src="${pelicula.urlPortada}" alt="Portada de la película ${pelicula.nombre}" class="imagen-portada">
            <div class="info-pelicula">
                <h3>${pelicula.nombre}</h3>
                <p><strong>Director:</strong> ${pelicula.director}</p>
                <p><strong>Género:</strong> ${pelicula.genero}</p>
                <p><strong>Calificación:</strong> ${pelicula.calificacion}/10</p>
                <p class="estado-vista"><strong>Estado:</strong> ${pelicula.estado}</p>
            </div>
        `;

        contenedor.appendChild(tarjeta);
    });
};

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
    for (const genero in generosContador) {
        if (generosContador[genero] > maxConteo) {
            maxConteo = generosContador[genero];
            generoMasVisto = genero;
        }
    }

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

/**
 * Filtra las películas del catálogo en index.html según el texto tipeado por el usuario.
 * @method filtrarPorTitulo
 * @param Ninguno
 * @return {void} Muestra u oculta tarjetas del DOM
 */
const filtrarPorTitulo = () => {
    const textoBuscado = document.getElementById("input-buscador").value.toLowerCase();
    const tarjetas = document.querySelectorAll(".tarjeta-pelicula");

    tarjetas.forEach((tarjeta) => {
        const titulo = tarjeta.querySelector("h3").textContent.toLowerCase();
        if (titulo.includes(textoBuscado)) {
            tarjeta.style.display = "block";
        } else {
            tarjeta.style.display = "none";
        }
    });
};

/**
 * Filtra el catálogo de la página principal según el género elegido en el select.
 * @method filtrarPorGenero
 * @param Ninguno
 * @return {void} Oculta o muestra elementos del DOM
 */
const filtrarPorGenero = () => {
    const generoSeleccionado = document.getElementById("select-genero-filtro").value;
    const tarjetas = document.querySelectorAll(".tarjeta-pelicula");

    tarjetas.forEach((tarjeta) => {
        const generoTarjeta = tarjeta.getAttribute("data-genero");
        if (generoSeleccionado === "todos" || generoTarjeta === generoSeleccionado) {
            tarjeta.style.display = "block";
        } else {
            tarjeta.style.display = "none";
        }
    });
};

/**
 * Comprueba que la calificación ingresada sea un entero entre 1 y 10.
 * @method validarCalificacion
 * @param {string} idInput - Identificador del input de calificación
 * @return {boolean} Retorna verdadero si es correcto, falso si fue rechazado
 */
const validarCalificacion = (idInput) => {
    const campo = document.getElementById(idInput);
    const valor = Number(campo.value.trim());

    if (campo.value.trim() !== "" && (isNaN(valor) || valor < 1 || valor > 10)) {
        alert("Error: La calificación debe ser un número entero entre 1 y 10.");
        campo.value = "";
        return false;
    }
    return true;
};

/**
 * Valida que un campo de texto no se envíe ni pierda el foco estando vacío.
 * @method validarTextoNoVacio
 * @param {string} idInput - Identificador del input a validar
 * @return {boolean} Retorna verdadero si tiene contenido, falso si está vacío
 */
const validarTextoNoVacio = (idInput) => {
    const campo = document.getElementById(idInput);
    if (campo.value.trim() === "") {
        alert("Atención: Este campo es obligatorio.");
        campo.value = "";
        return false;
    }
    return true;
};

/**
 * Vacía el formulario de alta de películas.
 * @method limpiarFormularioRegistro
 * @param Ninguno
 * @return {void} Reinicia los campos
 */
const limpiarFormularioRegistro = () => {
    const formulario = document.getElementById("form-registro-pelicula");
    if (formulario) {
        formulario.reset();
    }
};