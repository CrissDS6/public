////////////////////////// VARIABLES //////////////////////////
let busquedaTimer = null; // Guarda el temporizador del buscador para poder cancelarlo si el usuario sigue escribiendo

////////////////////////// FUNCIONES //////////////////////////

///// Dibuja la lista de ciudades favoritas usando el template del HTML /////
function pintarCiudades(ciudades) {
    const lista = document.querySelector('#lista-ciudades-favoritas');
    lista.innerHTML = '';

    if (ciudades.length == 0) {
        const p = document.createElement('p');
        p.classList.add('ciudades-vacio');
        p.textContent = 'No tienes ciudades favoritas. ¡Busca una arriba!';
        lista.appendChild(p);
        return;
    }

    const template = document.querySelector('#template-ciudad');

    ciudades.forEach(function (ciudad) {
        const clon = template.content.cloneNode(true);
        const card = clon.querySelector('.ciudad-card');

        if (ciudad.principal == 1) card.classList.add('principal');

        const badgePrincipal = ciudad.principal == 1
            ? ' <span class="ciudad-badge-principal">⭐ Principal</span>'
            : '';

        clon.querySelector('.ciudad-nombre').innerHTML = '📍 ' + ciudad.nombre_ciudad + badgePrincipal;
        clon.querySelector('.ciudad-provincia').textContent = ciudad.provincia;

        const acciones = clon.querySelector('.ciudad-acciones');

        if (ciudad.principal == 0) {
            const btnPrincipal = document.createElement('button');
            btnPrincipal.classList.add('btn-hacer-principal');
            btnPrincipal.title = 'Hacer principal';
            btnPrincipal.dataset.id = ciudad.id_ciudad;
            btnPrincipal.textContent = '⭐';
            acciones.appendChild(btnPrincipal);
        }

        const btnEliminar = document.createElement('button');
        btnEliminar.classList.add('btn-eliminar-ciudad');
        btnEliminar.title = 'Eliminar';
        btnEliminar.dataset.id = ciudad.id_ciudad;
        btnEliminar.textContent = '🗑️';
        acciones.appendChild(btnEliminar);

        lista.appendChild(clon);
    });
}

///// Pide las ciudades favoritas del usuario a la API y las pinta /////
async function cargarCiudadesFavoritas() {
    const response = await fetch('api/ciudades.php');
    const { success, datos } = await response.json();
    if (success) pintarCiudades(datos);
}

///// Busca ciudades en el catálogo según el texto escrito y muestra los resultados /////
async function buscarCiudades(texto) {
    if (texto.length < 2) {
        document.querySelector('#resultados-busqueda').classList.remove('visible');
        return;
    }

    const response = await fetch('api/ciudades.php?buscar=' + encodeURIComponent(texto));
    const { success, datos } = await response.json();

    const resultados = document.querySelector('#resultados-busqueda');
    resultados.innerHTML = '';

    if (!success || datos.length == 0) {
        const item = document.createElement('div');
        item.classList.add('resultado-item');
        item.textContent = 'No se encontraron ciudades o ya las tienes en favoritas';
        resultados.appendChild(item);
        resultados.classList.add('visible');
        return;
    }

    const template = document.querySelector('#template-resultado');

    datos.forEach(function (ciudad) {
        const clon = template.content.cloneNode(true);

        clon.querySelector('.resultado-nombre').textContent = ciudad.nombre_ciudad;
        clon.querySelector('.resultado-provincia').textContent = ciudad.provincia;
        clon.querySelector('.btn-añadir-ciudad').dataset.id = ciudad.id_ciudad;

        resultados.appendChild(clon);
    });

    resultados.classList.add('visible');
}

///// Añade una ciudad a las favoritas del usuario /////
async function añadirCiudad(id_ciudad) {
    const formData = new FormData();
    formData.append('id_ciudad', id_ciudad);

    const response = await fetch('api/ciudades.php', {
        method: 'POST',
        body: formData
    });

    const { success, error } = await response.json();

    if (success) {
        document.querySelector('#input-buscar-ciudad').value = '';
        document.querySelector('#resultados-busqueda').classList.remove('visible');
        cargarCiudadesFavoritas();
    } else {
        alert(error || 'Error al añadir la ciudad');
    }
}

///// Cambia la ciudad principal del usuario /////
async function hacerPrincipal(id_ciudad) {
    const response = await fetch('api/ciudades.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'id_ciudad=' + id_ciudad
    });

    const { success, error } = await response.json();

    if (success) {
        cargarCiudadesFavoritas();
    } else {
        alert(error || 'Error al actualizar la ciudad principal');
    }
}

///// Elimina una ciudad de las favoritas del usuario tras pedir confirmación /////
async function eliminarCiudad(id_ciudad) {
    if (!confirm('¿Eliminar esta ciudad de tus favoritas?')) return;

    const response = await fetch('api/ciudades.php', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'id_ciudad=' + id_ciudad
    });

    const { success, error } = await response.json();

    if (success) {
        cargarCiudadesFavoritas();
    } else {
        alert(error || 'Error al eliminar la ciudad');
    }
}

///// Arranca la vista ciudades: carga las favoritas y registra todos los escuchadores /////
async function initCiudades() {
    await cargarCiudadesFavoritas();

    ///// Busca ciudades mientras el usuario escribe, con un pequeño retraso para no saturar la API /////
    document.querySelector('#input-buscar-ciudad').addEventListener('input', function () {
        clearTimeout(busquedaTimer);
        busquedaTimer = setTimeout(function () {
            buscarCiudades(document.querySelector('#input-buscar-ciudad').value.trim());
        }, 400);
    });

    ///// Cierra el desplegable de resultados al hacer click fuera del buscador /////
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.ciudades-buscador')) {
            document.querySelector('#resultados-busqueda').classList.remove('visible');
        }
    });

    ///// Gestiona los botones de hacer principal y eliminar de cada ciudad favorita /////
    document.querySelector('#lista-ciudades-favoritas').addEventListener('click', function (e) {
        if (e.target.classList.contains('btn-hacer-principal')) {
            hacerPrincipal(e.target.dataset.id);
        }
        if (e.target.classList.contains('btn-eliminar-ciudad')) {
            eliminarCiudad(e.target.dataset.id);
        }
    });

    ///// Añade una ciudad al pulsar el botón de añadir en los resultados de búsqueda /////
    document.querySelector('#resultados-busqueda').addEventListener('click', function (e) {
        if (e.target.classList.contains('btn-añadir-ciudad')) {
            añadirCiudad(e.target.dataset.id);
        }
    });
}
