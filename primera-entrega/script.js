// Declaración de variables y selección del DOM
const contenedorPelis = document.querySelector('.grilla-pelis');
const selectAnio = document.getElementById('input-anio');

// Cargar años en el select
for (let i = 2026; i >= 1820; i--) {
    selectAnio.innerHTML += `<option value="${i}">${i}</option>`;
}

// Inicialización del arreglo de películas desde localStorage
let peliculas = [];
const peliculasGuardadas = localStorage.getItem('cineteca_pelis');
if (peliculasGuardadas) {
    peliculas = JSON.parse(peliculasGuardadas);
}

/**
 * @method renderizarPeliculas
 * @param {Array} listaPeliculas
 * @return {void}
 */
const renderizarPeliculas = (listaPeliculas) => {
    let contenidoHTML = ''; 
    
    listaPeliculas.forEach((peli) => {
        const indexReal = peliculas.indexOf(peli);
        const textoBoton = peli.estado === 'Vista' ? 'Vista ✓' : '+ Marcar';
        const iconoFavoritoHTML = `<div class="icono-favorito" onclick="event.stopPropagation(); alternarFavorito(${indexReal})">${peli.favorita ? '♥' : '♡'}</div>`;
        
        // Tarjeta
        const htmlPeli = `
            <article class="tarjeta-peli" style="cursor: pointer;" onclick="abrirDetalle(${indexReal})">
                <div class="cont-portada">
                    <span class="puntuacion">${peli.puntuacion ? peli.puntuacion + '/10' : '-/10'}</span>
                    <img src="${peli.portada}" alt="Portada" class="portada-peli">
                    ${iconoFavoritoHTML}
                    <button class="btn-hover-vista" onclick="event.stopPropagation(); alternarEstado(${indexReal})">${textoBoton}</button>
                </div>
                <div class="info-tarjeta">
                    <p class="gen-year">${peli.genero} - ${peli.anio}</p>
                    <h3>${peli.titulo}</h3>
                    <p class="director">${peli.director}</p>
                </div>
            </article>
        `;
        contenidoHTML += htmlPeli; 
    });

    contenedorPelis.innerHTML = contenidoHTML; 
};

const inputBusqueda = document.getElementById('buscar-peli');
const btnOrdenarAnio = document.getElementById('btn-ordenar-anio');
let ordenAnioDescendente = true;

const botonesEstado = document.querySelectorAll('.cat-menu:nth-child(1) button');
const botonesGenero = document.querySelectorAll('.cat-menu:nth-child(2) button');

let filtroEstadoActual = 'Todas';
let filtroGeneroActual = 'Todos';

/**
 * @method aplicarFiltros
 * @return {void}
 */
const aplicarFiltros = () => {
    const textoBusqueda = inputBusqueda.value.toLowerCase();

    const pelisFiltradas = peliculas.filter((peli) => {
        let coincideEstado = false;
        if (filtroEstadoActual === 'Todas') coincideEstado = true;
        else if (filtroEstadoActual === 'Vistas' && peli.estado === 'Vista') coincideEstado = true;
        else if (filtroEstadoActual === 'Pendientes' && peli.estado === 'Pendiente') coincideEstado = true;
        else if (filtroEstadoActual === 'Favoritas' && peli.favorita === true) coincideEstado = true;

        const coincideGenero = filtroGeneroActual === 'Todos' || peli.genero === filtroGeneroActual;
        const coincideBusqueda = peli.titulo.toLowerCase().includes(textoBusqueda) || 
                                 peli.director.toLowerCase().includes(textoBusqueda);

        return coincideEstado && coincideGenero && coincideBusqueda;
    });

    // Ordenar las películas filtradas según la variable de estado
    pelisFiltradas.sort((a, b) => {
        return ordenAnioDescendente ? b.anio - a.anio : a.anio - b.anio;
    });

    renderizarPeliculas(pelisFiltradas);
};

// Eventos Laterales y Buscador
botonesEstado.forEach((boton) => {
    boton.onclick = () => {
        botonesEstado.forEach(b => b.classList.remove('activa'));
        boton.classList.add('activa');
        filtroEstadoActual = boton.innerText; 
        aplicarFiltros();
    };
});

botonesGenero.forEach((boton) => {
    boton.onclick = () => {
        botonesGenero.forEach(b => b.classList.remove('activa'));
        boton.classList.add('activa');
        filtroGeneroActual = boton.innerText; 
        aplicarFiltros();
    };
});

inputBusqueda.oninput = () => aplicarFiltros();

// Evento para el boton de ordenar por año
btnOrdenarAnio.onclick = () => {
    ordenAnioDescendente = !ordenAnioDescendente; 
    btnOrdenarAnio.innerText = ordenAnioDescendente ? 'Año ▼' : 'Año ▲';
    aplicarFiltros();
};

const btnAgregar = document.getElementById('btn-agregar');
const modalAgregar = document.getElementById('modal-agregar');
const formPelicula = document.getElementById('form-pelicula');
const btnCerrarModal = document.getElementById('btn-cerrar-modal');

// Modal agregar peli
btnAgregar.onclick = () => modalAgregar.showModal(); 
btnCerrarModal.onclick = () => modalAgregar.close(); 

formPelicula.onsubmit = (evento) => {
    evento.preventDefault(); 
    
    //input de la portada
    const portadaIngresada = document.getElementById('input-portada').value;
    const portadaGenerica = "https://via.placeholder.com/300x450/141417/888888?text=Sin+Portada";

    const nuevaPeli = {
        titulo: document.getElementById('input-titulo').value,
        director: document.getElementById('input-director').value || "Director desconocido",
        anio: document.getElementById('input-anio').value,
        genero: document.getElementById('input-genero').value || "Otro",
        estado: document.getElementById('input-estado').value || "Pendiente",
        portada: portadaIngresada ? portadaIngresada : portadaGenerica,
        puntuacion: document.getElementById('input-puntuacion').value,
        sinopsis: document.getElementById('input-sinopsis').value,
        compania: document.getElementById('input-compania').value,
        enCine: document.getElementById('input-cine').checked,
        resena: "",
        favorita: false
    };

    peliculas.push(nuevaPeli);
    localStorage.setItem('cineteca_pelis', JSON.stringify(peliculas));
    formPelicula.reset();
    modalAgregar.close(); 
    aplicarFiltros(); 
};

/**
 * @method alternarEstado
 * @param {number} index - Índice de la película en el arreglo principal
 * @return {void}
 */
const alternarEstado = (index) => {
    peliculas[index].estado = peliculas[index].estado === 'Vista' ? 'Pendiente' : 'Vista';
    localStorage.setItem('cineteca_pelis', JSON.stringify(peliculas));
    aplicarFiltros(); 
};

/**
 * @method alternarFavorito
 * @param {number} index - Índice de la película en el arreglo principal
 * @return {void}
 */
const alternarFavorito = (index) => {
    peliculas[index].favorita = !peliculas[index].favorita;
    localStorage.setItem('cineteca_pelis', JSON.stringify(peliculas));
    aplicarFiltros();
};


// MODAL DE DETALLE 
const modalDetalle = document.getElementById('modal-detalle');
const btnCerrarDetalle = document.getElementById('btn-cerrar-detalle');
let indicePeliActual = null;

/**
 * @method marcarPuntos
 * @param {string|number} puntaje - El puntaje actual de la película
 * @return {void}
 */
const marcarPuntos = (puntaje) => {
    const contPuntos = document.getElementById('cont-puntos');
    let htmlPuntos = '';
    const limite = puntaje ? parseInt(puntaje) : 0;

    for (let i = 1; i <= 10; i++) {
        const simbolo = i <= limite ? '■' : '□';
        htmlPuntos += `<span class="rating-peli" onclick="actualizarPuntuacion(${i}, ${limite})">${simbolo}</span>`;
    }
    
    contPuntos.innerHTML = htmlPuntos;
    document.getElementById('detalle-puntuacion-num').innerText = limite > 0 ? limite + '/10' : '-/10';
};

/**
 * @method actualizarPuntuacion
 * @param {number} valorTocado - El número del cuadrado en el que se hizo click
 * @param {number} limiteActual - El puntaje que la película tenía antes del click
 * @return {void}
 */
const actualizarPuntuacion = (valorTocado, limiteActual) => {
    const nuevoPuntaje = (valorTocado === limiteActual) ? valorTocado - 1 : valorTocado;
    peliculas[indicePeliActual].puntuacion = nuevoPuntaje > 0 ? nuevoPuntaje.toString() : "";
    localStorage.setItem('cineteca_pelis', JSON.stringify(peliculas));
    
    marcarPuntos(nuevoPuntaje);
    aplicarFiltros(); 
};

/**
 * @method abrirDetalle
 * @param {number} index - Índice de la película para mostrar en el modal
 * @return {void}
 */
const abrirDetalle = (index) => {
    indicePeliActual = index;
    const peli = peliculas[index];

    document.getElementById('detalle-portada').src = peli.portada;
    document.getElementById('detalle-genero').innerText = peli.genero;
    document.getElementById('detalle-anio').innerText = peli.anio;
    document.getElementById('detalle-titulo').innerText = peli.titulo;
    document.getElementById('detalle-director').innerText = peli.director;
    document.getElementById('detalle-sinopsis').innerText = peli.sinopsis || "No hay sinopsis disponible.";
    document.getElementById('detalle-resena').value = peli.resena || "";

    document.getElementById('detalle-compania').innerText = peli.compania ? peli.compania : ' ';
    document.getElementById('detalle-cine').innerText = peli.enCine ? '  - En el cine' : '';

    document.getElementById('btn-detalle-vista').innerText = peli.estado === 'Vista' ? '✓ Vista' : 'Marcar como Vista';
    document.getElementById('btn-detalle-favorita').innerText = peli.favorita ? '♥ Favorita' : '♡ Marcar Favorita';

    marcarPuntos(peli.puntuacion);
    modalDetalle.showModal();
};

btnCerrarDetalle.onclick = () => modalDetalle.close();

document.getElementById('btn-guardar-resena').onclick = () => {
    const textoResena = document.getElementById('detalle-resena').value;
    peliculas[indicePeliActual].resena = textoResena;
    localStorage.setItem('cineteca_pelis', JSON.stringify(peliculas));
    alert("Reseña guardada exitosamente");
};

document.getElementById('btn-detalle-vista').onclick = () => {
    alternarEstado(indicePeliActual);
    abrirDetalle(indicePeliActual); 
};

document.getElementById('btn-detalle-favorita').onclick = () => {
    alternarFavorito(indicePeliActual);
    abrirDetalle(indicePeliActual); 
};

document.getElementById('btn-detalle-eliminar').onclick = () => {
    const confirmacion = confirm("¿Estás segura de que querés eliminar esta película?");
    if(confirmacion) {
        peliculas.splice(indicePeliActual, 1); 
        localStorage.setItem('cineteca_pelis', JSON.stringify(peliculas));
        modalDetalle.close();
        aplicarFiltros();
    }
};


// Ejecución inicial 
renderizarPeliculas(peliculas);