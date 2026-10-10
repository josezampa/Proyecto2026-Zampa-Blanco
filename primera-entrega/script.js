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

// Ejecución inicial 
renderizarPeliculas(peliculas);