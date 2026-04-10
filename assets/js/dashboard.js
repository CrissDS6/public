////////////////////////// VARIABLES //////////////////////////
const rutas = {
    'inicio': 'vistas/inicio.html',
    'mis-mascotas': 'vistas/mis-mascotas.html',
    'consejos': 'vistas/consejos.html',
    'ciudades': 'vistas/ciudades.html',
    'foro': 'vistas/foro.html'
};
const API_KEY_TIEMPO = '6503d50520029d03c68708a566d29cbe';
const URL_TIEMPO = 'https://api.openweathermap.org/data/2.5/weather';
// Mobile menu toggle
const menuToggle = document.querySelector('#menuToggle');
const navbarNav = document.querySelector('#navbarNav');

const btnPerfil = document.querySelector('#btn-perfil');
const dropdownPerfil = document.querySelector('#dropdown-perfil');

////////////////////////// FUNCIONES //////////////////////////
async function cargarVista(nombre) {
    const contenido = document.querySelector('#contenido-principal');

    try {
        const res = await fetch(rutas[nombre]);
        if (!res.ok) throw new Error('Vista no encontrada');
        const html = await res.text();
        contenido.innerHTML = html;
    } catch {
        contenido.innerHTML = '<p class="error-vista">No se pudo cargar la sección.</p>';
        return;
    }

    document.querySelectorAll('.nav-link').forEach(function (link) {
        link.classList.toggle('activo', link.dataset.vista == nombre);
    });

    if (nombre == 'inicio') initInicio();
    else if (nombre == 'mis-mascotas') initMisMascotas();
    else if (nombre == 'consejos') initConsejos();
    else if (nombre == 'ciudades') initCiudades();
    else if (nombre == 'foro') initForo();
}
async function initInicio() {
    document.querySelectorAll('.acceso-card').forEach(function (card) {
        card.addEventListener('click', function () {
            cargarVista(this.dataset.vista);
        });
    });

    const res = await fetch('api/sesion.php');
    const datos = await res.json();

    if (!datos.success) return;

    document.querySelector('.saludo-nombre').textContent = datos.nombre;
    document.querySelector('.saludo-avatar').src = 'assets/img/avatares/' + datos.avatar;

    if (datos.latitud && datos.longitud) {
        cargarTiempoInicio(datos.ciudad, datos.latitud, datos.longitud);
    } else {
        document.querySelector('#inicio-ciudad').textContent = 'Sin ciudad principal';
    }
}

async function cargarTiempoInicio(ciudad, lat, lon) {
    try {
        const url = URL_TIEMPO + '?lat=' + lat + '&lon=' + lon + '&appid=' + API_KEY_TIEMPO + '&units=metric&lang=es&t=' + Date.now();
        const res = await fetch(url);
        const datos = await res.json();

        const temp = Math.round(datos.main.temp);
        const descripcion = datos.weather[0].description;
        const codigo = datos.weather[0].id;

        document.querySelector('#inicio-ciudad').textContent = ciudad;
        document.querySelector('#inicio-temp').textContent = temp + '°C';
        document.querySelector('#inicio-icono').textContent = obtenerEmojiTiempo(codigo);
        document.querySelector('#inicio-desc').textContent = descripcion.charAt(0).toUpperCase() + descripcion.slice(1);

    } catch {
        document.querySelector('#inicio-desc').textContent = 'No se pudo cargar el tiempo';
    }
}

function obtenerEmojiTiempo(codigo) {
    if (codigo >= 200 && codigo < 300) return '⛈️'; // Tormenta eléctrica
    if (codigo >= 300 && codigo < 400) return '🌦️'; // Llovizna
    if (codigo >= 500 && codigo < 600) return '🌧️'; // Lluvia
    if (codigo >= 600 && codigo < 700) return '❄️'; // Nieve
    if (codigo >= 700 && codigo < 800) return '🌫️'; // Atmósfera
    if (codigo === 800) return '☀️';                 // Cielo despejado
    if (codigo === 801) return '🌤️';                // Pocas nubes
    if (codigo >= 802) return '☁️';                 // Nublado
    return '🌡️';
}

function initMisMascotas() {
    // por ahora vacío, lo conectaremos en la Fase 6
}

function initConsejos() {
    // por ahora vacío
}

function initCiudades() {
    // por ahora vacío
}

function initForo() {
    // por ahora vacío
}

// Cerrar menú al hacer click en un enlace
document.querySelectorAll('.nav-link').forEach(function (link) {
    link.addEventListener('click', function () {
        navbarNav.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

// Navbar transparencia al hacer scroll
window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

////////////////////////// LLAMADAS //////////////////////////
cargarVista('inicio');

////////////////////////// ESCUCHADORES //////////////////////////
document.querySelector('.navbar').addEventListener('click', function (e) {
    if (!e.target.classList.contains('nav-link')) return;
    cargarVista(e.target.dataset.vista);
});

menuToggle.addEventListener('click', function () {
    navbarNav.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

btnPerfil.addEventListener('click', function (e) {
    e.stopPropagation();
    dropdownPerfil.classList.toggle('visible');
});

// Cerrar dropdown al hacer click fuera
document.addEventListener('click', function () {
    dropdownPerfil.classList.remove('visible');
});