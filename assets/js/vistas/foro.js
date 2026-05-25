////////////////////////// VARIABLES //////////////////////////
let filtroEspecie = 0;    // Especie seleccionada en el filtro (0 = todas)
let ordenForo = 'likes';  // Orden de las publicaciones: 'likes' o 'fecha'
let filtroProvincia = ''; // Provincia seleccionada en el filtro (vacío = todas)

////////////////////////// FUNCIONES //////////////////////////

///// Convierte una fecha en texto legible como "Hace 3h" o "Hace 2d" /////
function formatearFecha(fechaStr) {
    const fecha = new Date(fechaStr);
    const ahora = new Date();
    const diff = Math.floor((ahora - fecha) / 1000);

    if (diff < 60) return 'Hace un momento';
    if (diff < 3600) return 'Hace ' + Math.floor(diff / 60) + 'm';
    if (diff < 86400) return 'Hace ' + Math.floor(diff / 3600) + 'h';
    if (diff < 604800) return 'Hace ' + Math.floor(diff / 86400) + 'd';
    return fecha.toLocaleDateString('es-ES');
}

///// Actualiza el select de provincias con las que tienen publicaciones /////
function actualizarSelectProvincias(provincias) {
    const select = document.querySelector('#filtro-provincia');
    const valorActual = select.value;
    select.innerHTML = '<option value="">Todas las provincias</option>';

    provincias.forEach(function (provincia) {
        const option = document.createElement('option');
        option.value = provincia;
        option.textContent = provincia;
        if (provincia == valorActual) option.selected = true;
        select.appendChild(option);
    });
}

///// Dibuja las publicaciones en la lista usando el template del HTML /////
function pintarPublicaciones(publicaciones) {
    const lista = document.querySelector('#lista-publicaciones');
    lista.innerHTML = '';

    if (publicaciones.length == 0) {
        const p = document.createElement('p');
        p.classList.add('foro-vacio');
        p.textContent = 'No hay publicaciones todavía. ¡Sé el primero en publicar!';
        lista.appendChild(p);
        return;
    }

    const template = document.querySelector('#template-publicacion');

    publicaciones.forEach(function (pub) {
        const clon = template.content.cloneNode(true);

        const ubicacion = pub.ciudad ? '📍 ' + pub.ciudad + (pub.provincia ? ', ' + pub.provincia : '') : '';

        clon.querySelector('.foro-avatar').src = 'assets/img/avatares/' + (pub.avatar || 'avatar_default.png');
        clon.querySelector('.foro-avatar').alt = pub.nombre_usuario;
        clon.querySelector('.publicacion-nombre').textContent = pub.nombre_usuario;
        clon.querySelector('.publicacion-fecha').textContent = formatearFecha(pub.fecha_envio);
        clon.querySelector('.publicacion-especie-badge').textContent = (pub.nombre_especie == 'Perro' ? '🐶' : '🐱') + ' ' + pub.nombre_especie;
        clon.querySelector('.publicacion-titulo').textContent = pub.titulo;
        clon.querySelector('.publicacion-contenido').textContent = pub.contenido;
        clon.querySelector('.publicacion-ubicacion').textContent = ubicacion;
        clon.querySelector('.like-count').textContent = pub.likes;

        const btnLike = clon.querySelector('.btn-like');
        btnLike.dataset.id = pub.id_publicacion;
        if (pub.usuario_dio_like == 1) btnLike.classList.add('liked');

        lista.appendChild(clon);
    });
}

///// Pide las publicaciones a la API aplicando los filtros activos y las pinta /////
async function cargarPublicaciones() {
    const url = 'api/foro.php?especie=' + filtroEspecie + '&orden=' + ordenForo + '&provincia=' + encodeURIComponent(filtroProvincia);
    const response = await fetch(url);
    const { success, datos, provincias } = await response.json();

    if (success) {
        pintarPublicaciones(datos);
        actualizarSelectProvincias(provincias);
    }
}

///// Da o quita el like a una publicación y recarga la lista /////
async function toggleLike(id_publicacion) {
    const response = await fetch('api/foro.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'id_publicacion=' + id_publicacion
    });

    const { success } = await response.json();
    if (success) cargarPublicaciones();
}

///// Valida y envía una nueva publicación al foro /////
async function enviarPublicacion() {
    const titulo = document.querySelector('#pub-titulo').value.trim();
    const contenido = document.querySelector('#pub-contenido').value.trim();
    const idEspecie = document.querySelector('#pub-especie').value;
    const ciudad = document.querySelector('#pub-ciudad').value;
    const provincia = document.querySelector('#pub-provincia').value;
    const mensaje = document.querySelector('#pub-mensaje');

    if (titulo === '' || contenido === '') {
        mensaje.textContent = 'El título y el contenido son obligatorios';
        mensaje.className = 'error';
        return;
    }

    if (provincia === '') {
        mensaje.textContent = 'Selecciona una provincia';
        mensaje.className = 'error';
        return;
    }

    if (ciudad === '') {
        mensaje.textContent = 'Selecciona una ciudad';
        mensaje.className = 'error';
        return;
    }

    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('contenido', contenido);
    formData.append('id_especie', idEspecie);
    formData.append('ciudad', ciudad);
    formData.append('provincia', provincia);

    const response = await fetch('api/foro.php', {
        method: 'POST',
        body: formData
    });

    const { success, error } = await response.json();

    if (success) {
        mensaje.textContent = '¡Aviso enviado! Está pendiente de revisión por el administrador.';
        mensaje.className = 'exito';
        setTimeout(function () {
            document.querySelector('#modal-publicacion').classList.remove('visible');
        }, 2000);
    } else {
        mensaje.textContent = error || 'Error al enviar el aviso';
        mensaje.className = 'error';
    }
}

///// Carga las provincias disponibles en el select del modal de nueva publicación /////
async function cargarProvinciasForo() {
    const response = await fetch('api/ciudades_catalogo.php');
    const { success, datos } = await response.json();
    if (!success) return;

    const select = document.querySelector('#pub-provincia');
    select.innerHTML = '<option value="">Selecciona una provincia...</option>';

    datos.forEach(function (item) {
        const option = document.createElement('option');
        option.value = item.provincia;
        option.textContent = item.provincia;
        select.appendChild(option);
    });
}

///// Carga las ciudades de una provincia en el select del modal de nueva publicación /////
async function cargarCiudadesForo(provincia) {
    const selectCiudad = document.querySelector('#pub-ciudad');
    selectCiudad.innerHTML = '<option value="">Cargando...</option>';
    selectCiudad.disabled = true;

    const response = await fetch('api/ciudades_catalogo.php?provincia=' + encodeURIComponent(provincia));
    const { success, datos } = await response.json();

    if (!success || datos.length == 0) {
        selectCiudad.innerHTML = '<option value="">No hay ciudades disponibles</option>';
        return;
    }

    selectCiudad.innerHTML = '<option value="">Selecciona una ciudad...</option>';
    datos.forEach(function (ciudad) {
        const option = document.createElement('option');
        option.value = ciudad.nombre_ciudad;
        option.textContent = ciudad.nombre_ciudad;
        selectCiudad.appendChild(option);
    });

    selectCiudad.disabled = false;
}

///// Arranca la vista foro: carga publicaciones y registra todos los escuchadores /////
async function initForo() {
    await cargarPublicaciones();

    ///// Filtra las publicaciones por especie al pulsar los botones de filtro /////
    document.querySelectorAll('.btn-filtro').forEach(function (btn) {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.btn-filtro').forEach(function (b) {
                b.classList.remove('activo');
            });
            this.classList.add('activo');
            filtroEspecie = this.dataset.especie;
            cargarPublicaciones();
        });
    });

    ///// Cambia el orden de las publicaciones al pulsar los botones de orden /////
    document.querySelectorAll('.btn-orden').forEach(function (btn) {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.btn-orden').forEach(function (b) {
                b.classList.remove('activo-orden');
            });
            this.classList.add('activo-orden');
            ordenForo = this.dataset.orden;
            cargarPublicaciones();
        });
    });

    ///// Da o quita el like al pulsar el botón de corazón de una publicación /////
    document.querySelector('#lista-publicaciones').addEventListener('click', function (e) {
        if (e.target.classList.contains('btn-like')) {
            toggleLike(e.target.dataset.id);
        }
    });

    ///// Filtra por provincia al cambiar el selector /////
    document.querySelector('#filtro-provincia').addEventListener('change', function () {
        filtroProvincia = this.value;
        cargarPublicaciones();
    });

    ///// Limpia y abre el modal de nueva publicación /////
    document.querySelector('#btn-nueva-publicacion').addEventListener('click', function () {
        document.querySelector('#pub-titulo').value = '';
        document.querySelector('#pub-contenido').value = '';
        document.querySelector('#pub-ciudad').innerHTML = '<option value="">Primero selecciona una provincia</option>';
        document.querySelector('#pub-ciudad').disabled = true;
        document.querySelector('#pub-especie').value = '1';
        document.querySelector('#pub-mensaje').textContent = '';
        document.querySelector('#pub-mensaje').className = '';
        cargarProvinciasForo();
        document.querySelector('#modal-publicacion').classList.add('visible');
    });

    ///// Carga las ciudades al cambiar la provincia en el modal /////
    document.querySelector('#pub-provincia').addEventListener('change', function () {
        if (this.value !== '') {
            cargarCiudadesForo(this.value);
        } else {
            document.querySelector('#pub-ciudad').innerHTML = '<option value="">Primero selecciona una provincia</option>';
            document.querySelector('#pub-ciudad').disabled = true;
        }
    });

    ///// Cierra el modal de publicación al pulsar la X /////
    document.querySelector('#modal-publicacion-cerrar').addEventListener('click', function () {
        document.querySelector('#modal-publicacion').classList.remove('visible');
    });

    ///// Cierra el modal de publicación al pulsar fuera del contenido /////
    document.querySelector('#modal-publicacion').addEventListener('click', function (e) {
        if (e.target == document.querySelector('#modal-publicacion')) {
            document.querySelector('#modal-publicacion').classList.remove('visible');
        }
    });

    ///// Llama a la función de envío al pulsar el botón del formulario /////
    document.querySelector('#btn-enviar-publicacion').addEventListener('click', function () {
        enviarPublicacion();
    });
}

