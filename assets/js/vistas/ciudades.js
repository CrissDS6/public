////////////////////////// VARIABLES //////////////////////////
let busquedaTimer = null;

////////////////////////// FUNCIONES //////////////////////////
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

    ciudades.forEach(function (ciudad) {
        const card = document.createElement('div');
        card.classList.add('ciudad-card');
        if (ciudad.principal == 1) card.classList.add('principal');

        const badgePrincipal = ciudad.principal == 1
            ? '<span class="ciudad-badge-principal">⭐ Principal</span>'
            : '';

        const btnPrincipal = ciudad.principal == 0
            ? '<button class="btn-hacer-principal" title="Hacer principal" data-id="' + ciudad.id_ciudad + '">⭐</button>'
            : '';

        card.innerHTML = `
            <div class="ciudad-info">
                <p class="ciudad-nombre">📍 ${ciudad.nombre_ciudad} ${badgePrincipal}</p>
                <p class="ciudad-provincia">${ciudad.provincia}</p>
            </div>
            <div class="ciudad-acciones">
                ${btnPrincipal}
                <button class="btn-eliminar-ciudad" title="Eliminar" data-id="${ciudad.id_ciudad}">🗑️</button>
            </div>
        `;

        lista.appendChild(card);
    });
}

async function cargarCiudadesFavoritas() {
    const response = await fetch('api/ciudades.php');
    const { success, datos } = await response.json();
    if (success) pintarCiudades(datos);
}

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
        resultados.innerHTML = '<div class="resultado-item">No se encontraron ciudades</div>';
        resultados.classList.add('visible');
        return;
    }

    datos.forEach(function (ciudad) {
        const item = document.createElement('div');
        item.classList.add('resultado-item');
        item.innerHTML = `
            <div>
                <strong>${ciudad.nombre_ciudad}</strong>
                <span>${ciudad.provincia}</span>
            </div>
            <button class="btn-añadir-ciudad" data-id="${ciudad.id_ciudad}">+ Añadir</button>
        `;
        resultados.appendChild(item);
    });

    resultados.classList.add('visible');
}

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

async function initCiudades() {
    await cargarCiudadesFavoritas();

    // Buscador con debounce
    document.querySelector('#input-buscar-ciudad').addEventListener('input', function () {
        clearTimeout(busquedaTimer);
        busquedaTimer = setTimeout(function () {
            buscarCiudades(document.querySelector('#input-buscar-ciudad').value.trim());
        }, 400);
    });

    // Cerrar resultados al hacer click fuera
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.ciudades-buscador')) {
            document.querySelector('#resultados-busqueda').classList.remove('visible');
        }
    });

    // Delegación de eventos para botones dinámicos
    document.querySelector('#lista-ciudades-favoritas').addEventListener('click', function (e) {
        if (e.target.classList.contains('btn-hacer-principal')) {
            hacerPrincipal(e.target.dataset.id);
        }
        if (e.target.classList.contains('btn-eliminar-ciudad')) {
            eliminarCiudad(e.target.dataset.id);
        }
    });

    document.querySelector('#resultados-busqueda').addEventListener('click', function (e) {
        if (e.target.classList.contains('btn-añadir-ciudad')) {
            añadirCiudad(e.target.dataset.id);
        }
    });
}