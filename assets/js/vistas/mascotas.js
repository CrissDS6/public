////////////////////////// VARIABLES //////////////////////////
let mascotasData = [];

////////////////////////// FUNCIONES //////////////////////////
function abrirModalMascota(mascota) {
    const fotoSrc = mascota.foto
        ? mascota.foto
        : (mascota.nombre_especie == 'Perro' ? 'assets/img/ui/emojiPerro.png' : 'assets/img/ui/emojiGatoForo.png');

    document.querySelector('#modal-mascota-foto').src = fotoSrc;
    document.querySelector('#modal-mascota-foto').alt = mascota.nombre;
    document.querySelector('#modal-mascota-nombre').textContent = mascota.nombre;
    document.querySelector('#modal-mascota-especie').textContent = mascota.nombre_especie;
    document.querySelector('#modal-mascota-raza').textContent = mascota.raza || 'Sin raza';
    document.querySelector('#modal-mascota-edad').textContent = mascota.edad ? mascota.edad + ' años' : 'Desconocida';
    document.querySelector('#modal-mascota-sexo').textContent = mascota.sexo;

    document.querySelector('#modal-btn-editar').dataset.id = mascota.id_mascota;
    document.querySelector('#modal-btn-eliminar').dataset.id = mascota.id_mascota;

    document.querySelector('#modal-mascota').classList.add('visible');
}

function cerrarModalMascota() {
    document.querySelector('#modal-mascota').classList.remove('visible');
}

async function initMisMascotas() {
    // Escuchadores del modal
    document.querySelector('#modal-mascota-cerrar2').addEventListener('click', function () {
        cerrarModalMascota();
    });

    document.querySelector('#modal-mascota').addEventListener('click', function (e) {
        if (e.target == document.querySelector('#modal-mascota')) {
            cerrarModalMascota();
        }
    });

    // Fetch mascotas
    const response = await fetch('api/mascotas.php');
    const { success, datos } = await response.json();

    if (!success) return;

    mascotasData = datos;
    const galeria = document.querySelector('#galeria-mascotas');

    if (datos.length == 0) {
        const p = document.createElement('p');
        p.classList.add('mascotas-vacio');
        p.textContent = 'Aún no tienes mascotas registradas. ¡Añade la primera!';
        galeria.appendChild(p);
        return;
    }

    datos.forEach(function (mascota) {
        const card = document.createElement('div');
        card.classList.add('mascota-card');
        card.dataset.id = mascota.id_mascota;

        const fotoHTML = mascota.foto
            ? '<img src="' + mascota.foto + '" alt="' + mascota.nombre + '" class="mascota-foto">'
            : '<div class="mascota-foto-placeholder">' + (mascota.nombre_especie == 'Perro' ? '🐶' : '🐱') + '</div>';

        card.innerHTML = fotoHTML + `
            <p class="mascota-nombre">${mascota.nombre}</p>
            <button class="btn-ver-info">Ver info</button>
        `;

        card.addEventListener('click', function () {
            const mascotaSeleccionada = mascotasData.find(function (m) {
                return m.id_mascota == card.dataset.id;
            });
            abrirModalMascota(mascotaSeleccionada);
        });

        galeria.appendChild(card);
    });
}

////////////////////////// ESCUCHADORES //////////////////////////
