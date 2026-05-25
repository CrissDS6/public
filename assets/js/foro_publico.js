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
    const lista = document.querySelector('#lista-publicaciones-publico');
    lista.innerHTML = '';

    if (publicaciones.length == 0) {
        lista.innerHTML = '<p style="text-align:center;color:var(--medium-gray);padding:3rem 0">No hay publicaciones todavía.</p>';
        return;
    }

    const template = document.querySelector('#template-pub-publico');

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

        lista.appendChild(clon);
    });
}

///// Pide las publicaciones a la API aplicando los filtros activos y las pinta /////
async function cargarPublicaciones() {
    const url = 'api/foro_publico.php?especie=' + filtroEspecie +
        '&orden=' + ordenForo +
        '&provincia=' + encodeURIComponent(filtroProvincia);

    const response = await fetch(url);
    const { success, datos, provincias } = await response.json();

    if (success) {
        pintarPublicaciones(datos);
        actualizarSelectProvincias(provincias);
    }
}

///// Abre el modal de inicio de sesión /////
function abrirModalLogin() {
    document.querySelector('#modal-login').classList.add('visible');
}

///// Cierra el modal de inicio de sesión /////
function cerrarModalLogin() {
    document.querySelector('#modal-login').classList.remove('visible');
}

////////////////////////// LLAMADAS //////////////////////////
cargarPublicaciones();

if (window.location.search.includes('error=1')) {
    abrirModalLogin();
    document.querySelector('#modal-error').style.display = 'block';
}

////////////////////////// ESCUCHADORES //////////////////////////

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

///// Filtra por provincia al cambiar el selector /////
document.querySelector('#filtro-provincia').addEventListener('change', function () {
    filtroProvincia = this.value;
    cargarPublicaciones();
});

///// Abre y cierra el menú de navegación en móvil /////
const menuToggle = document.querySelector('#menuToggle');
const navbarNav = document.querySelector('#navbarNav');

menuToggle.addEventListener('click', function () {
    navbarNav.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

///// Añade fondo más oscuro al navbar cuando el usuario hace scroll /////
window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

///// Abre el modal de login al pulsar el botón de la navbar /////
document.querySelector('#btn-abrir-login').addEventListener('click', function (e) {
    e.preventDefault();
    abrirModalLogin();
});

///// Cierra el modal de login al pulsar la X /////
document.querySelector('#modal-login-cerrar').addEventListener('click', function () {
    cerrarModalLogin();
});

///// Cierra el modal de login al pulsar fuera del contenido /////
document.querySelector('#modal-login').addEventListener('click', function (e) {
    if (e.target == document.querySelector('#modal-login')) {
        cerrarModalLogin();
    }
});