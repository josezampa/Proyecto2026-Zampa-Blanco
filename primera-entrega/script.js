const CLAVE_STORAGE = 'cineteca_pelis';
const MAX_FAVORITAS = 3;
const ANIO_MIN = 1888;
const ANIO_MAX = new Date().getFullYear();
const FILTROS_ESTADO = {
    Todas: () => true,
    Vistas: (peli) => peli.estado === 'Vista',
    Pendientes: (peli) => peli.estado === 'Pendiente',
    Favoritas: (peli) => peli.favorita === true
};

/**
 * Lee las películas guardadas en localStorage.
 * @method obtenerPeliculas
 * @return {Array} Arreglo de películas (vacío si no hay datos o están dañados)
 */
const obtenerPeliculas = () => {
    try {
        const guardadas = JSON.parse(localStorage.getItem(CLAVE_STORAGE));
        return Array.isArray(guardadas) ? guardadas : [];
    } catch (error) {
        return [];
    }
};

const peliculas = obtenerPeliculas();
let filtroEstadoActual = 'Todas';
let filtroGeneroActual = 'Todos';
let ordenAnioDescendente = true;
let indicePeliActual = null;

/**
 * Guarda el arreglo de películas en localStorage.
 * @method guardarPeliculas
 * @return {void}
 */
const guardarPeliculas = () => {
    try {
        localStorage.setItem(CLAVE_STORAGE, JSON.stringify(peliculas));
    } catch (error) {
        alert('Error: No se pudieron guardar los cambios en el navegador.');
    }
};

/**
 * Cuenta cuántas películas están marcadas como favoritas.
 * @method contarFavoritas
 * @return {number} Cantidad de películas favoritas
 */
const contarFavoritas = () => peliculas.filter((peli) => peli.favorita).length;

/**
 * Comprueba si una película puede pasar a ser favorita y avisa al usuario si no es posible.
 * @method puedeSerFavorita
 * @param {Object} peli - Película que se quiere marcar como favorita
 * @return {boolean} true si se puede marcar, false si no
 */
const puedeSerFavorita = (peli) => {
    if (peli.estado !== 'Vista') {
        alert('Error: Solo podés marcar como favoritas las películas que ya viste.');
        return false;
    }
    if (contarFavoritas() >= MAX_FAVORITAS) {
        alert(`Error: Solo podés seleccionar un máximo de ${MAX_FAVORITAS} películas como favoritas.`);
        return false;
    }
    return true;
};

/**
 * Genera el HTML de la tarjeta de una película del catálogo.
 * @method crearTarjeta
 * @param {Object} peli - Película a mostrar
 * @return {string} HTML de la tarjeta
 */
const crearTarjeta = (peli) => {
    const indice = peliculas.indexOf(peli);
    const puntuacion = Number(peli.puntuacion) || '-';
    const textoBoton = peli.estado === 'Vista' ? 'Vista ✓' : '+ Marcar';
    const simboloFavorito = peli.favorita ? '♥' : '♡';

    return `
        <article class="tarjeta-peli" onclick="abrirDetalle(${indice})">
            <div class="cont-portada">
                <span class="puntuacion">${puntuacion}/10</span>
                <span class="genero-portada">${peli.genero}</span>
                <button type="button" class="icono-favorito" aria-label="Alternar favorita" onclick="event.stopPropagation(); alternarFavorito(${indice})">${simboloFavorito}</button>
                <button type="button" class="btn-hover-vista" onclick="event.stopPropagation(); alternarEstado(${indice})">${textoBoton}</button>
            </div>
            <div class="info-tarjeta">
                <p class="gen-year">${peli.genero} - ${peli.anio}</p>
                <h3>${peli.titulo}</h3>
                <p class="director">${peli.director}</p>
            </div>
        </article>
    `;
};

/**
 * Dibuja en la grilla del catálogo las películas recibidas.
 * @method renderizarPeliculas
 * @param {Array} listaPeliculas - Películas a mostrar
 * @return {void}
 */
const renderizarPeliculas = (listaPeliculas) => {
    const grilla = document.getElementById('grilla-pelis');

    if (listaPeliculas.length === 0) {
        const mensaje = peliculas.length === 0
            ? 'Todavía no cargaste películas. Sumá la primera desde la sección Agregar.'
            : 'No hay películas que coincidan con los filtros.';
        grilla.innerHTML = `<p class="mensaje-vacio">${mensaje}</p>`;
        return;
    }

    grilla.innerHTML = listaPeliculas.map(crearTarjeta).join('');
};

/**
 * Filtra por estado, género y texto de búsqueda, ordena por año y actualiza el catálogo.
 * @method aplicarFiltros
 * @return {void}
 */
const aplicarFiltros = () => {
    const textoBusqueda = document.getElementById('buscar-peli').value.trim().toLowerCase();

    const pelisFiltradas = peliculas
        .filter((peli) => FILTROS_ESTADO[filtroEstadoActual](peli))
        .filter((peli) => filtroGeneroActual === 'Todos' || peli.genero === filtroGeneroActual)
        .filter((peli) => peli.titulo.toLowerCase().includes(textoBusqueda)
            || peli.director.toLowerCase().includes(textoBusqueda))
        .sort((a, b) => (ordenAnioDescendente ? b.anio - a.anio : a.anio - b.anio));

    renderizarPeliculas(pelisFiltradas);
};

/**
 * Cambia el filtro de estado o de género según el botón presionado.
 * @method cambiarFiltro
 * @param {string} tipo - Tipo de filtro: 'estado' o 'genero'
 * @param {HTMLButtonElement} boton - Botón presionado en el menú lateral
 * @return {void}
 */
const cambiarFiltro = (tipo, boton) => {
    boton.closest('ul').querySelectorAll('button').forEach((b) => b.classList.remove('activa'));
    boton.classList.add('activa');

    if (tipo === 'estado') {
        filtroEstadoActual = boton.textContent;
    } else {
        filtroGeneroActual = boton.textContent;
    }
    aplicarFiltros();
};

/**
 * Invierte el orden por año (ascendente o descendente) y actualiza el catálogo.
 * @method alternarOrdenAnio
 * @param {HTMLButtonElement} boton - Botón de orden, cuyo texto indica el sentido actual
 * @return {void}
 */
const alternarOrdenAnio = (boton) => {
    ordenAnioDescendente = !ordenAnioDescendente;
    boton.textContent = ordenAnioDescendente ? 'Año ▼' : 'Año ▲';
    aplicarFiltros();
};

/**
 * Alterna una película entre Vista y Pendiente. Si pasa a Pendiente deja de ser favorita y se borra con quién y dónde la vio.
 * @method alternarEstado
 * @param {number} index - Posición de la película en el arreglo principal
 * @return {void}
 */
const alternarEstado = (index) => {
    const peli = peliculas[index];
    peli.estado = peli.estado === 'Vista' ? 'Pendiente' : 'Vista';

    if (peli.estado === 'Pendiente') {
        peli.favorita = false;
        peli.compania = '';
        peli.enCine = false;
    }

    guardarPeliculas();
    aplicarFiltros();
    refrescarDetalle(index);
};

/**
 * Marca o desmarca una película como favorita respetando las reglas (vista y máximo 3).
 * @method alternarFavorito
 * @param {number} index - Posición de la película en el arreglo principal
 * @return {void}
 */
const alternarFavorito = (index) => {
    const peli = peliculas[index];

    if (!peli.favorita && !puedeSerFavorita(peli)) {
        return;
    }

    peli.favorita = !peli.favorita;
    guardarPeliculas();
    aplicarFiltros();
    refrescarDetalle(index);
};

/**
 * Dibuja los diez cuadrados de puntuación del detalle según el puntaje recibido.
 * @method marcarPuntos
 * @param {number} puntaje - Puntaje actual de la película (0 si no tiene)
 * @return {void}
 */
const marcarPuntos = (puntaje) => {
    let htmlPuntos = '';

    for (let i = 1; i <= 10; i++) {
        const simbolo = i <= puntaje ? '■' : '□';
        htmlPuntos += `<span class="rating-peli" onclick="actualizarPuntuacion(${i})">${simbolo}</span>`;
    }

    document.getElementById('cont-puntos').innerHTML = htmlPuntos;
    document.getElementById('detalle-puntuacion-num').textContent = `${puntaje || '-'}/10`;
};

/**
 * Guarda el puntaje elegido en el detalle. Si se toca el puntaje actual, baja un punto.
 * @method actualizarPuntuacion
 * @param {number} valorTocado - Número del cuadrado en el que se hizo clic
 * @return {void}
 */
const actualizarPuntuacion = (valorTocado) => {
    const peli = peliculas[indicePeliActual];
    const puntajeActual = Number(peli.puntuacion) || 0;
    const nuevoPuntaje = valorTocado === puntajeActual ? valorTocado - 1 : valorTocado;

    peli.puntuacion = nuevoPuntaje;
    guardarPeliculas();
    marcarPuntos(nuevoPuntaje);
    aplicarFiltros();
};

/**
 * Completa el modal de detalle con los datos de una película y lo muestra.
 * @method abrirDetalle
 * @param {number} index - Posición de la película en el arreglo principal
 * @return {void}
 */
const abrirDetalle = (index) => {
    const modal = document.getElementById('modal-detalle');
    const peli = peliculas[index];
    const contexto = [peli.compania, peli.enCine ? 'En el cine' : ''].filter(Boolean).join(' · ');

    indicePeliActual = index;
    document.getElementById('detalle-genero').textContent = peli.genero;
    document.getElementById('detalle-anio').textContent = peli.anio;
    document.getElementById('detalle-titulo').textContent = peli.titulo;
    document.getElementById('detalle-director').textContent = peli.director;
    document.getElementById('detalle-contexto').textContent = contexto;
    document.getElementById('detalle-contexto').hidden = contexto === '';
    document.getElementById('detalle-sinopsis').textContent = peli.sinopsis || 'No hay sinopsis disponible.';
    document.getElementById('detalle-resena').value = peli.resena || '';
    document.getElementById('btn-detalle-vista').textContent = peli.estado === 'Vista' ? '✓ Vista' : 'Marcar como vista';
    document.getElementById('btn-detalle-favorita').textContent = peli.favorita ? '♥ Favorita' : '♡ Marcar favorita';

    marcarPuntos(Number(peli.puntuacion) || 0);

    if (!modal.open) {
        modal.showModal();
    }
};

/**
 * Actualiza el modal de detalle si está abierto para que refleje los últimos cambios.
 * @method refrescarDetalle
 * @param {number} index - Posición de la película en el arreglo principal
 * @return {void}
 */
const refrescarDetalle = (index) => {
    if (document.getElementById('modal-detalle').open) {
        abrirDetalle(index);
    }
};

/**
 * Cierra el modal de detalle.
 * @method cerrarDetalle
 * @return {void}
 */
const cerrarDetalle = () => {
    document.getElementById('modal-detalle').close();
};

/**
 * Guarda la reseña escrita en el detalle de la película.
 * @method guardarResena
 * @return {void}
 */
const guardarResena = () => {
    peliculas[indicePeliActual].resena = document.getElementById('detalle-resena').value.trim();
    guardarPeliculas();
    alert('Reseña guardada exitosamente');
};

/**
 * Elimina la película abierta en el detalle después de pedir confirmación.
 * @method eliminarPelicula
 * @return {void}
 */
const eliminarPelicula = () => {
    if (!confirm('¿Seguro que querés eliminar esta película?')) {
        return;
    }

    peliculas.splice(indicePeliActual, 1);
    guardarPeliculas();
    cerrarDetalle();
    aplicarFiltros();
};

/**
 * Avisa del error al usuario, blanquea el campo inválido y le devuelve el foco.
 * @method mostrarErrorCampo
 * @param {HTMLInputElement} campo - Campo con el valor incorrecto
 * @param {string} mensaje - Mensaje que se muestra al usuario
 * @return {boolean} Siempre false, para poder usarlo como resultado de la validación
 */
const mostrarErrorCampo = (campo, mensaje) => {
    alert(mensaje);
    campo.value = '';
    campo.focus();
    return false;
};

/**
 * Comprueba que los valores del formulario de alta sean correctos.
 * @method validarFormulario
 * @return {boolean} true si todos los valores son válidos, false si alguno no lo es
 */
const validarFormulario = () => {
    const titulo = document.getElementById('input-titulo');
    const anio = document.getElementById('input-anio');
    const puntuacion = document.getElementById('input-puntuacion');
    const estado = document.getElementById('input-estado');
    const anioNumero = Number(anio.value);
    const puntuacionNumero = Number(puntuacion.value);

    if (titulo.value.trim() === '') {
        return mostrarErrorCampo(titulo, 'Error: Ingresá el título de la película.');
    }

    if (!Number.isInteger(anioNumero) || anioNumero < ANIO_MIN || anioNumero > ANIO_MAX) {
        return mostrarErrorCampo(anio, `Error: Ingresá un año válido entre ${ANIO_MIN} y ${ANIO_MAX}.`);
    }

    if (puntuacion.value.trim() !== '') {
        if (!Number.isInteger(puntuacionNumero) || puntuacionNumero < 1 || puntuacionNumero > 10) {
            return mostrarErrorCampo(puntuacion, 'Error: La puntuación debe ser un número entero del 1 al 10.');
        }
        if (estado.value !== 'Vista') {
            return mostrarErrorCampo(puntuacion, 'Error: Solo podés puntuar las películas que ya viste.');
        }
    }

    return true;
};

/**
 * Habilita "¿Con quién la viste?" y "Vista en el cine" solo si el estado es Vista; si no, los deshabilita y los blanquea.
 * @method actualizarCamposVista
 * @return {void}
 */
const actualizarCamposVista = () => {
    const esVista = document.getElementById('input-estado').value === 'Vista';
    const compania = document.getElementById('input-compania');
    const cine = document.getElementById('input-cine');

    compania.disabled = !esVista;
    cine.disabled = !esVista;

    if (!esVista) {
        compania.value = '';
        cine.checked = false;
    }
};

/**
 * Valida el formulario, guarda la nueva película y vuelve al catálogo.
 * @method guardarPelicula
 * @param {Event} evento - Evento submit del formulario
 * @return {void}
 */
const guardarPelicula = (evento) => {
    evento.preventDefault();

    if (!validarFormulario()) {
        return;
    }

    peliculas.push({
        titulo: document.getElementById('input-titulo').value.trim(),
        director: document.getElementById('input-director').value.trim() || 'Director desconocido',
        anio: Number(document.getElementById('input-anio').value),
        genero: document.getElementById('input-genero').value || 'Otro',
        estado: document.getElementById('input-estado').value,
        puntuacion: Number(document.getElementById('input-puntuacion').value) || 0,
        compania: document.getElementById('input-compania').value,
        enCine: document.getElementById('input-cine').checked,
        sinopsis: document.getElementById('input-sinopsis').value.trim(),
        resena: document.getElementById('input-resena').value.trim(),
        favorita: false
    });

    guardarPeliculas();
    window.location.href = 'index.html';
};

/**
 * Actualiza el indicador de favoritas seleccionadas en el perfil.
 * @method actualizarContadorFavoritos
 * @return {void}
 */
const actualizarContadorFavoritos = () => {
    document.getElementById('contador-favoritos').textContent = `Favoritas seleccionadas: ${contarFavoritas()} / ${MAX_FAVORITAS}`;
};

/**
 * Marca o desmarca una favorita desde el perfil y revierte el cambio si supera el máximo.
 * @method marcarFavorito
 * @param {number} indice - Posición de la película en el arreglo principal
 * @param {HTMLInputElement} checkbox - Casilla que cambió de valor
 * @return {void}
 */
const marcarFavorito = (indice, checkbox) => {
    const peli = peliculas[indice];

    if (checkbox.checked && !puedeSerFavorita(peli)) {
        checkbox.checked = false;
        return;
    }

    peli.favorita = checkbox.checked;
    guardarPeliculas();
    actualizarContadorFavoritos();
};

/**
 * Dibuja la lista de películas vistas para elegir las favoritas.
 * @method renderizarFavoritas
 * @param {Array} vistas - Películas vistas
 * @return {void}
 */
const renderizarFavoritas = (vistas) => {
    const contenedor = document.getElementById('contenedor-favoritas-lista');

    if (vistas.length === 0) {
        contenedor.innerHTML = '<p class="mensaje-vacio">Marcá películas como vistas para poder elegirlas como favoritas.</p>';
        return;
    }

    contenedor.innerHTML = vistas.map((peli) => {
        const indice = peliculas.indexOf(peli);
        return `
            <div class="item-favorita">
                <input type="checkbox" id="fav-pelicula-${indice}" ${peli.favorita ? 'checked' : ''} onchange="marcarFavorito(${indice}, this)">
                <label for="fav-pelicula-${indice}">${peli.titulo} (${peli.genero})</label>
            </div>
        `;
    }).join('');
};

/**
 * Dibuja la lista de películas pendientes.
 * @method renderizarPendientes
 * @param {Array} pendientes - Películas pendientes
 * @return {void}
 */
const renderizarPendientes = (pendientes) => {
    const lista = document.getElementById('lista-pendientes');

    if (pendientes.length === 0) {
        lista.innerHTML = '<li class="tarjeta-pendiente">No tenés películas pendientes.</li>';
        return;
    }

    lista.innerHTML = pendientes.map((peli) => `
        <li class="tarjeta-pendiente">
            <strong>${peli.titulo}</strong>
            <span>${peli.genero}</span>
        </li>
    `).join('');
};

/**
 * Calcula la nota media de las películas vistas que tienen puntuación.
 * @method calcularNotaMedia
 * @param {Array} vistas - Películas vistas
 * @return {string} Nota media con un decimal, o '-' si no hay puntuaciones
 */
const calcularNotaMedia = (vistas) => {
    const puntuadas = vistas.filter((peli) => Number(peli.puntuacion) > 0);
    const suma = puntuadas.reduce((total, peli) => total + Number(peli.puntuacion), 0);
    return puntuadas.length > 0 ? (suma / puntuadas.length).toFixed(1) : '-';
};

/**
 * Busca el género con más películas vistas.
 * @method calcularGeneroMasVisto
 * @param {Array} vistas - Películas vistas
 * @return {string} Género más visto, o 'N/A' si no hay películas vistas
 */
const calcularGeneroMasVisto = (vistas) => {
    const conteo = {};
    vistas.forEach((peli) => {
        conteo[peli.genero] = (conteo[peli.genero] || 0) + 1;
    });

    const [generoTop] = Object.entries(conteo).sort((a, b) => b[1] - a[1])[0] || ['N/A'];
    return generoTop;
};

/**
 * Carga el perfil: favoritas, pendientes y estadísticas calculadas con las películas guardadas.
 * @method cargarPerfil
 * @return {void}
 */
const cargarPerfil = () => {
    const vistas = peliculas.filter((peli) => peli.estado === 'Vista');
    const pendientes = peliculas.filter((peli) => peli.estado === 'Pendiente');

    renderizarFavoritas(vistas);
    renderizarPendientes(pendientes);
    actualizarContadorFavoritos();

    document.getElementById('stat-vistas').textContent = vistas.length;
    document.getElementById('stat-pendientes').textContent = pendientes.length;
    document.getElementById('stat-nota-media').textContent = `${calcularNotaMedia(vistas)} / 10`;
    document.getElementById('stat-genero-top').textContent = calcularGeneroMasVisto(vistas);
};