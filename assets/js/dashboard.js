////////////////////////// VARIABLES //////////////////////////
const rutas = {
    'inicio': 'vistas/inicio.html',
    'mis-mascotas': 'vistas/mis-mascotas.html',
    'consejos': 'vistas/consejos.html',
    'ciudades': 'vistas/ciudades.html',
    'foro': 'vistas/foro.html'
};
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
function initInicio() {
    // por ahora vacío
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