const API_KEY = '6503d50520029d03c68708a566d29cbe';
const URL_API = 'https://api.openweathermap.org/data/2.5/weather';
const modalLogin = document.querySelector('#modal-login');
const btnAbrirLogin = document.querySelector('#btn-abrir-login');
const btnCerrarLogin = document.querySelector('#modal-login-cerrar');

// Emojis según el código de condición de OpenWeatherMap
function obtenerEmoji(codigo) {
    if (codigo >= 200 && codigo < 300) return '⛈️';// Tormenta eléctrica
    if (codigo >= 300 && codigo < 400) return '🌦️';// Llovizna
    if (codigo >= 500 && codigo < 600) return '🌧️';// Lluvia
    if (codigo >= 600 && codigo < 700) return '❄️';// Nieve
    if (codigo >= 700 && codigo < 800) return '🌫️';// Atmósfera (niebla, bruma, polvo...)
    if (codigo === 800) return '☀️'; // Cielo despejado
    if (codigo === 801) return '🌤️'; // Pocas nubes (11-25%)
    if (codigo >= 802) return '☁️'; // Nublado (802=25-50%, 803=50-84%, 804=+85%)
    return '🌡️';
}

async function cargarTiempo(lat, lon, nombreCiudad) {
    try {
        const url = URL_API + '?lat=' + lat + '&lon=' + lon + '&appid=' + API_KEY + '&units=metric&lang=es';
        const res = await fetch(url);
        const datos = await res.json();

        const temp = Math.round(datos.main.temp);
        const descripcion = datos.weather[0].description;
        const codigo = datos.weather[0].id;
        const ciudad = nombreCiudad || datos.name;

        document.querySelector('#weather-temp').textContent = temp + '°C';
        document.querySelector('#weather-icon').textContent = obtenerEmoji(codigo);
        document.querySelector('#weather-desc').textContent = descripcion.charAt(0).toUpperCase() + descripcion.slice(1);
        document.querySelector('#weather-ciudad').textContent = '📍 ' + ciudad;

    } catch {
        document.querySelector('#weather-desc').textContent = 'No se pudo cargar el tiempo';
    }
}

function iniciarWidget() {
    // Intentamos geolocalización
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                // Si acepta, usamos sus coordenadas
                cargarTiempo(position.coords.latitude, position.coords.longitude, null);
            },
            function () {
                // Si rechaza, usamos Zafra por defecto
                cargarTiempo(38.4226, -6.4175, 'Zafra');
            }
        );
    } else {
        // Si el navegador no soporta geolocalización
        cargarTiempo(38.4226, -6.4175, 'Zafra');
    }
}

iniciarWidget();

// ===== MENÚ MÓVIL =====
const menuToggle = document.querySelector('#menuToggle');
const navbarNav = document.querySelector('#navbarNav');

menuToggle.addEventListener('click', function () {
    navbarNav.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

document.querySelectorAll('.nav-link:not(#btn-abrir-login), .btn-register').forEach(function (link) {
    link.addEventListener('click', function () {
        navbarNav.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== NAVBAR SCROLL =====
window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== MODAL LOGIN =====


function abrirModalLogin() {
    modalLogin.classList.add('visible');
}

function cerrarModalLogin() {
    modalLogin.classList.remove('visible');
}

btnAbrirLogin.addEventListener('click', function (e) {
    e.preventDefault();
    abrirModalLogin();
});

btnCerrarLogin.addEventListener('click', function () {
    cerrarModalLogin();
});

// Cerrar al hacer click fuera del modal
modalLogin.addEventListener('click', function (e) {
    if (e.target == modalLogin) {
        cerrarModalLogin();
    }
});

// Si hay error de login, abrir el modal con el mensaje
if (window.location.search.includes('error=1')) {
    abrirModalLogin();
    document.querySelector('#modal-error').style.display = 'block';
}