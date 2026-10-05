/**
 * Comprueba que el valor ingresado en un campo numérico sea válido. Si es inválido, muestra una alerta y blanquea el campo.
 * @method validarNumero
 * @param {string} idInput - Identificador del elemento HTML input a validar
 * @return {boolean} Retorna verdadero si el valor es numérico y válido, falso en caso contrario
 */
const validarNumero = (idInput) => {
    const campo = document.getElementById(idInput);
    const valor = campo.value.trim();

    if (valor !== "" && (isNaN(valor) || Number(valor) < 0)) {
        alert("Error: Por favor, ingrese un número entero mayor o igual a cero.");
        campo.value = "";
        return false;
    }
    return true;
};

/**
 * Comprueba que la calificación ingresada esté en el rango de 1 a 10. Si es inválida, alerta y blanquea el campo.
 * @method validarCalificacion
 * @param {string} idInput - Identificador del campo de calificación
 * @return {boolean} Retorna verdadero si está en el rango correcto, falso si fue rechazado
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
 * Valida que un campo de texto obligatorio no quede vacío al perder el foco. Si está vacío, blanquea y advierte al usuario.
 * @method validarTextoNoVacio
 * @param {string} idInput - Identificador del campo de texto a verificar
 * @return {boolean} Retorna verdadero si contiene texto, falso si está vacío
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
 * Calcula las estadísticas de horas vistas, totales de películas y porcentajes en base a las entradas del usuario.
 * @method calcularEstadisticasCine
 * @param Ninguno
 * @return {void} No retorna ningún valor, actualiza el DOM directamente
 */
const calcularEstadisticasCine = () => {
    const vistasInput = document.getElementById("input-vistas");
    const pendientesInput = document.getElementById("input-pendientes");
    const duracionInput = document.getElementById("input-duracion-promedio");

    const vistas = Number(vistasInput.value.trim());
    const pendientes = Number(pendientesInput.value.trim());
    const duracion = Number(duracionInput.value.trim());

    if (vistasInput.value.trim() === "" || pendientesInput.value.trim() === "" || duracionInput.value.trim() === "") {
        alert("Por favor complete todos los campos de la calculadora.");
        return;
    }

    const totalPeliculas = vistas + pendientes;
    const porcentajeVistas = totalPeliculas > 0 ? Math.round((vistas / totalPeliculas) * 100) : 0;
    const porcentajePendientes = totalPeliculas > 0 ? (100 - porcentajeVistas) : 0;
    const horasTotales = Math.round((vistas * duracion) / 60);

    const elementoTexto = document.getElementById("texto-resultado");
    elementoTexto.innerHTML = `Has visto un total de <strong>${horasTotales} horas</strong> de cine (${vistas} películas). Progreso: <strong>${porcentajeVistas}% completado</strong>.`;

    document.getElementById("td-cant-vistas").textContent = vistas;
    document.getElementById("td-porc-vistas").textContent = `${porcentajeVistas}%`;
    document.getElementById("td-cant-pendientes").textContent = pendientes;
    document.getElementById("td-porc-pendientes").textContent = `${porcentajePendientes}%`;
};

/**
 * Filtra las películas mostradas en la pantalla principal según el título ingresado en el buscador.
 * @method filtrarPorTitulo
 * @param Ninguno
 * @return {void} Actualiza la visibilidad de los elementos en el catálogo
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
 * Filtra la vista del catálogo según la opción de género seleccionada en el select.
 * @method filtrarPorGenero
 * @param Ninguno
 * @return {void} Modifica la propiedad display de las tarjetas de películas
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
 * Procesa la carga de una nueva película ingresada mediante el formulario de registro.
 * @method guardarPelicula
 * @param Ninguno
 * @return {void} Muestra mensaje de éxito y blanquea el formulario
 */
const guardarPelicula = () => {
    const nombre = document.getElementById("input-nombre-pelicula").value.trim();
    const director = document.getElementById("input-director").value.trim();
    const calificacion = document.getElementById("input-calificacion").value.trim();

    if (nombre === "" || director === "" || calificacion === "") {
        alert("Por favor, complete los campos obligatorios antes de guardar.");
        return;
    }

    alert(`¡Película "${nombre}" registrada correctamente!`);
    limpiarFormularioRegistro();
};

/**
 * Resetea y blanquea todos los datos ingresados en el formulario de registro de película.
 * @method limpiarFormularioRegistro
 * @param Ninguno
 * @return {void} Limpia los valores del formulario
 */
const limpiarFormularioRegistro = () => {
    document.getElementById("form-registro-pelicula").reset();
};