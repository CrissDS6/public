////////////////////////// VARIABLES //////////////////////////
let mascotasData = [];
let consejosUsados = {};

////////////////////////// FUNCIONES //////////////////////////
function convertirCodigoATipo(codigo, temp, humedad) {
    if (codigo >= 200 && codigo < 300) return 'tormenta';
    if (codigo >= 300 && codigo < 400) return 'llovizna';
    if (codigo >= 400 && codigo < 600) return 'lluvia';
    if (codigo >= 600 && codigo < 700) return 'nieve';
    if (codigo == 731 || codigo == 751 || codigo == 761) return 'calima';
    if (codigo >= 700 && codigo < 730) return 'niebla';
    if (codigo >= 732 && codigo < 800) return 'niebla';
    if (codigo == 771 || codigo == 781) return 'viento';
    if (temp >= 28) return 'calor';
    if (temp <= 8) return 'frio';
    if (humedad >= 70) return 'humedad';
    return 'estable';
}

function obtenerGifTiempo(codigo, temp, humedad) {
    const base = 'assets/img/tiempo/';
    if (codigo >= 200 && codigo < 300) return base + 'tormenta.gif';
    if (codigo >= 300 && codigo < 400) return base + 'llovizna.gif';
    if (codigo >= 500 && codigo < 600) return base + 'lluvia.gif';
    if (codigo >= 600 && codigo < 700) return base + 'nieve.gif';
    if (codigo == 731 || codigo == 751 || codigo == 761) return base + 'niebla.gif';
    if (codigo == 771 || codigo == 781) return base + 'viento.gif';
    if (codigo >= 700 && codigo < 800) return base + 'niebla.gif';
    if (codigo === 800) {
        if (temp >= 28) return base + 'caliente.gif';
        if (temp <= 8) return base + 'frio.gif';
        return base + 'sol.gif';
    }
    if (codigo === 801) return base + 'sol_nubes.gif';
    if (codigo >= 802) {
        if (humedad >= 70) return base + 'humedad.gif';
        if (temp <= 8) return base + 'frio.gif';
        return base + 'nublado.gif';
    }
    return base + 'estable.gif';
}
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
    //Reseteamos consejo cada vez que se abre el modal
    document.querySelector('#modal-consejo-resultado').classList.add('oculto');
    document.querySelector('#btn-ver-consejo').textContent = '🐾 Ver consejo';
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
            document.querySelector('#modal-anadir').classList.remove('visible');
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
        galeria.appendChild(crearTarjetaMascota(mascota));
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
    const foto = document.querySelector('#edit-foto').files[0];
    const mensaje = document.querySelector('#edit-mascota-mensaje');

    if (nombre === '') {
        mensaje.textContent = 'El nombre es obligatorio';
        mensaje.className = 'error';
        return;
    }

    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('id_mascota', id);
    formData.append('nombre', nombre);
    formData.append('id_especie', especie);
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
        document.querySelector('#modal-anadir').classList.add('visible');
    });

    document.querySelector('#modal-anadir-cerrar').addEventListener('click', function () {
        document.querySelector('#modal-anadir').classList.remove('visible');
    });

    document.querySelector('#modal-anadir').addEventListener('click', function (e) {
        if (e.target == document.querySelector('#modal-anadir')) {
            document.querySelector('#modal-anadir').classList.remove('visible');
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

    document.querySelector('#btn-ver-consejo').addEventListener('click', function () {
        const id = document.querySelector('#modal-btn-editar').dataset.id;
        const mascota = mascotasData.find(function (m) {
            return m.id_mascota == id;
        });
        cargarConsejoMascota(mascota);
    });
}

async function cargarConsejoMascota(mascota) {
    const btnConsejo = document.querySelector('#btn-ver-consejo');
    const resultado = document.querySelector('#modal-consejo-resultado');

    btnConsejo.textContent = '⏳ Cargando...';
    btnConsejo.disabled = true;

    try {
        const resSesion = await fetch('api/sesion.php');
        const datosSession = await resSesion.json();

        if (!datosSession.latitud) {
            resultado.innerHTML = '<p>No tienes ciudad principal configurada.</p>';
            resultado.classList.remove('oculto');
            return;
        }

        const urlTiempo = 'https://api.openweathermap.org/data/2.5/weather?lat=' + datosSession.latitud +
            '&lon=' + datosSession.longitud +
            '&appid=' + API_KEY_TIEMPO +
            '&units=metric&lang=es&t=' + Date.now();

        const resTiempo = await fetch(urlTiempo);
        const datosTiempo = await resTiempo.json();

        const codigo = datosTiempo.weather[0].id;
        const temp = Math.round(datosTiempo.main.temp);
        const humedad = datosTiempo.main.humidity;
        const tipeTiempo = convertirCodigoATipo(codigo, temp, humedad);

        const resConsejos = await fetch('api/consejos.php?tipo_tiempo=' + tipeTiempo);
        const datosConsejos = await resConsejos.json();

        const bloqueEspecie = datosConsejos.consejos.find(function (c) {
            return c.nombre_mascota == mascota.nombre;
        });

        let texto = 'Hoy no tengo consejos especiales. ¡Disfruta del día!';

        if (bloqueEspecie && bloqueEspecie.textos.length > 0) {
            const clave = mascota.id_especie + '_' + tipeTiempo;

            // Inicializamos el array de usados para esta especie+tiempo si no existe
            if (!consejosUsados[clave]) {
                consejosUsados[clave] = [];
            }

            // Filtramos los que no se han usado aún
            let disponibles = bloqueEspecie.textos.filter(function (t) {
                return !consejosUsados[clave].includes(t);
            });

            // Si no quedan disponibles, reseteamos y volvemos a usar todos
            if (disponibles.length == 0) {
                consejosUsados[clave] = [];
                disponibles = bloqueEspecie.textos;
            }

            // Elegimos uno aleatorio de los disponibles
            const indice = Math.floor(Math.random() * disponibles.length);
            texto = disponibles[indice];

            // Lo marcamos como usado
            consejosUsados[clave].push(texto);
        }

        resultado.innerHTML = `
            <div class="consejo-header">
                <img src="${obtenerGifTiempo(codigo, temp, humedad)}" alt="${tipeTiempo}" style="width:40px;height:40px;vertical-align:middle;background:white;border-radius:8px;padding:2px">
                <span>${mascota.nombre} te aconseja:</span>
            </div>
            <p>${texto}</p>
        `;
        resultado.classList.remove('oculto');

    } catch (err) {
        console.log('Error:', err);
        console.log('datosTiempo:', typeof datosTiempo !== 'undefined' ? datosTiempo : 'no definido');
        resultado.innerHTML = '<p>No se pudo cargar el consejo.</p>';
        resultado.classList.remove('oculto');
    } finally {
        btnConsejo.textContent = '🐾 Ver consejo';
        btnConsejo.disabled = false;
    }
}
function crearTarjetaMascota(mascota) {
    const template = document.querySelector('#template-mascota');
    const clon = template.content.cloneNode(true);

    const card = clon.querySelector('.mascota-card');
    card.dataset.id = mascota.id_mascota;

    // Foto o placeholder
    const placeholder = clon.querySelector('.mascota-foto-placeholder');
    if (mascota.foto) {
        const img = document.createElement('img');
        img.src = mascota.foto;
        img.alt = mascota.nombre;
        img.classList.add('mascota-foto');
        placeholder.replaceWith(img);
    } else {
        placeholder.textContent = mascota.nombre_especie == 'Perro' ? '🐶' : '🐱';
    }

    clon.querySelector('.mascota-nombre').textContent = mascota.nombre;

    card.addEventListener('click', function () {
        const mascotaSeleccionada = mascotasData.find(function (m) {
            return m.id_mascota == card.dataset.id;
        });
        abrirModalMascota(mascotaSeleccionada);
    });

    return clon;
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
        galeria.appendChild(crearTarjetaMascota(mascota));
    });
}

////////////////////////// ESCUCHADORES //////////////////////////
