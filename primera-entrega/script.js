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

// Ejecución inicial 
renderizarPeliculas(peliculas);