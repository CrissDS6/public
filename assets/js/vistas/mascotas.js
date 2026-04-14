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

async function guardarMascota() {
    const nombre = document.querySelector('#input-nombre').value.trim();
    const idEspecie = document.querySelector('#input-especie').value;
    const raza = document.querySelector('#input-raza').value.trim();
    const edad = document.querySelector('#input-edad').value;
    const sexo = document.querySelector('#input-sexo').value;
    const foto = document.querySelector('#input-foto').files[0];
    const mensaje = document.querySelector('#form-mascota-mensaje');

    if (nombre === '') {
        mensaje.textContent = 'El nombre es obligatorio';
        mensaje.className = 'error';
        return;
    }

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('id_especie', idEspecie);
    formData.append('raza', raza);
    formData.append('edad', edad);
    formData.append('sexo', sexo);
    if (foto) formData.append('foto', foto);

    const response = await fetch('api/mascotas.php', {
        method: 'POST',
        body: formData
    });

    const { success, error } = await response.json();

    if (success) {
        mensaje.textContent = '¡Mascota añadida correctamente!';
        mensaje.className = 'exito';
        // Recargamos la galería
        setTimeout(function () {
            document.querySelector('#modal-añadir').classList.remove('visible');
            recargarGaleria();
        }, 1500);
    } else {
        mensaje.textContent = error || 'Error al guardar';
        mensaje.className = 'error';
    }
}

async function recargarGaleria() {
    const galeria = document.querySelector('#galeria-mascotas');
    galeria.innerHTML = '';
    mascotasData = [];

    const response = await fetch('api/mascotas.php');
    const { success, datos } = await response.json();

    if (!success) return;

    mascotasData = datos;

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

//Función para eliminar mascotas
async function eliminarMascota(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta mascota?')) return;

    const response = await fetch('api/mascotas.php', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'id_mascota=' + id
    });

    const { success, error } = await response.json();

    if (success) {
        cerrarModalMascota();
        recargarGaleria();
    } else {
        alert(error || 'Error al eliminar la mascota');
    }
}

function abrirModalEditar(mascota) {
    cerrarModalMascota();

    document.querySelector('#edit-id-mascota').value = mascota.id_mascota;
    document.querySelector('#edit-nombre').value = mascota.nombre;
    document.querySelector('#edit-especie').value = mascota.id_especie || '1';
    document.querySelector('#edit-raza').value = mascota.raza || '';
    document.querySelector('#edit-edad').value = mascota.edad || '';
    document.querySelector('#edit-sexo').value = mascota.sexo;
    document.querySelector('#edit-preview-foto').innerHTML = mascota.foto
        ? '<img src="' + mascota.foto + '" alt="foto actual">'
        : '';
    document.querySelector('#edit-mascota-mensaje').className = '';
    document.querySelector('#edit-mascota-mensaje').textContent = '';

    document.querySelector('#modal-editar').classList.add('visible');
}

async function actualizarMascota() {
    const id = document.querySelector('#edit-id-mascota').value;
    const nombre = document.querySelector('#edit-nombre').value.trim();
    const especie = document.querySelector('#edit-especie').value;
    const raza = document.querySelector('#edit-raza').value.trim();
    const edad = document.querySelector('#edit-edad').value;
    const sexo = document.querySelector('#edit-sexo').value;
    const mensaje = document.querySelector('#edit-mascota-mensaje');

    if (nombre === '') {
        mensaje.textContent = 'El nombre es obligatorio';
        mensaje.className = 'error';
        return;
    }

    const body = 'id_mascota=' + id +
        '&nombre=' + encodeURIComponent(nombre) +
        '&id_especie=' + especie +
        '&raza=' + encodeURIComponent(raza) +
        '&edad=' + edad +
        '&sexo=' + sexo;

    const response = await fetch('api/mascotas.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body
    });

    const { success, error } = await response.json();

    if (success) {
        mensaje.textContent = '¡Mascota actualizada correctamente!';
        mensaje.className = 'exito';
        setTimeout(function () {
            document.querySelector('#modal-editar').classList.remove('visible');
            recargarGaleria();
        }, 1500);
    } else {
        mensaje.textContent = error || 'Error al actualizar';
        mensaje.className = 'error';
    }
}

function initEscuchadoresAnadir() {
    document.querySelector('#btn-añadir-mascota').addEventListener('click', function () {
        document.querySelector('#input-nombre').value = '';
        document.querySelector('#input-raza').value = '';
        document.querySelector('#input-edad').value = '';
        document.querySelector('#input-foto').value = '';
        document.querySelector('#preview-foto').innerHTML = '';
        document.querySelector('#input-especie').value = '1';
        document.querySelector('#input-sexo').value = 'macho';
        document.querySelector('#form-mascota-mensaje').className = '';
        document.querySelector('#form-mascota-mensaje').textContent = '';
        document.querySelector('#modal-añadir').classList.add('visible');
    });

    document.querySelector('#modal-añadir-cerrar').addEventListener('click', function () {
        document.querySelector('#modal-añadir').classList.remove('visible');
    });

    document.querySelector('#modal-añadir').addEventListener('click', function (e) {
        if (e.target == document.querySelector('#modal-añadir')) {
            document.querySelector('#modal-añadir').classList.remove('visible');
        }
    });

    document.querySelector('#input-foto').addEventListener('change', function (e) {
        const archivo = e.target.files[0];
        if (!archivo) return;
        const preview = document.querySelector('#preview-foto');
        const url = URL.createObjectURL(archivo);
        preview.innerHTML = '';
        const img = document.createElement('img');
        img.src = url;
        preview.appendChild(img);
    });

    document.querySelector('#btn-guardar-mascota').addEventListener('click', function () {
        guardarMascota();
    });
}

function initEscuchadoresEditar() {
    document.querySelector('#modal-btn-editar').addEventListener('click', function () {
        const id = this.dataset.id;
        const mascota = mascotasData.find(function (m) {
            return m.id_mascota == id;
        });
        abrirModalEditar(mascota);
    });

    document.querySelector('#modal-editar-cerrar').addEventListener('click', function () {
        document.querySelector('#modal-editar').classList.remove('visible');
    });

    document.querySelector('#modal-editar').addEventListener('click', function (e) {
        if (e.target == document.querySelector('#modal-editar')) {
            document.querySelector('#modal-editar').classList.remove('visible');
        }
    });

    document.querySelector('#edit-foto').addEventListener('change', function (e) {
        const archivo = e.target.files[0];
        if (!archivo) return;
        const preview = document.querySelector('#edit-preview-foto');
        const url = URL.createObjectURL(archivo);
        preview.innerHTML = '';
        const img = document.createElement('img');
        img.src = url;
        preview.appendChild(img);
    });

    document.querySelector('#btn-actualizar-mascota').addEventListener('click', function () {
        actualizarMascota();
    });
}

function initEscuchadoresModalInfo() {
    document.querySelector('#modal-mascota-cerrar2').addEventListener('click', function () {
        cerrarModalMascota();
    });

    document.querySelector('#modal-mascota').addEventListener('click', function (e) {
        if (e.target == document.querySelector('#modal-mascota')) {
            cerrarModalMascota();
        }
    });

    document.querySelector('#modal-btn-eliminar').addEventListener('click', function () {
        eliminarMascota(this.dataset.id);
    });
}

async function initMisMascotas() {
    initEscuchadoresModalInfo();
    initEscuchadoresAnadir();
    initEscuchadoresEditar();

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
