////////////////////////// VARIABLES //////////////////////////
let filtroEspecie = 0;
let ordenForo = 'likes';
let filtroProvincia = '';

////////////////////////// FUNCIONES //////////////////////////
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

function abrirModalLogin() {
    document.querySelector('#modal-login').classList.add('visible');
}

function cerrarModalLogin() {
    document.querySelector('#modal-login').classList.remove('visible');
}

////////////////////////// LLAMADAS //////////////////////////
cargarPublicaciones();

////////////////////////// ESCUCHADORES //////////////////////////
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

document.querySelector('#filtro-provincia').addEventListener('change', function () {
    filtroProvincia = this.value;
    cargarPublicaciones();
});

// Navbar móvil
const menuToggle = document.querySelector('#menuToggle');
const navbarNav = document.querySelector('#navbarNav');

menuToggle.addEventListener('click', function () {
    navbarNav.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// Navbar scroll
window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Modal login
document.querySelector('#btn-abrir-login').addEventListener('click', function (e) {
    e.preventDefault();
    abrirModalLogin();
});

document.querySelector('#modal-login-cerrar').addEventListener('click', function () {
    cerrarModalLogin();
});

document.querySelector('#modal-login').addEventListener('click', function (e) {
    if (e.target == document.querySelector('#modal-login')) {
        cerrarModalLogin();
    }
});

// Si hay error de login
if (window.location.search.includes('error=1')) {
    abrirModalLogin();
    document.querySelector('#modal-error').style.display = 'block';
}