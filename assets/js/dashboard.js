////////////////////////// VARIABLES //////////////////////////
const rutas = {
    'inicio': 'vistas/inicio.html',
    'mis-mascotas': 'vistas/mis-mascotas.html',
    'consejos': 'vistas/consejos.html',
    'ciudades': 'vistas/ciudades.html',
    'foro': 'vistas/foro.html',
    'perfil': 'vistas/perfil.html'
};

const API_KEY_TIEMPO = '6503d50520029d03c68708a566d29cbe';
const URL_TIEMPO = 'https://api.openweathermap.org/data/2.5/weather';

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
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        contenido.innerHTML = '';
        Array.from(doc.body.childNodes).forEach(function (nodo) {
            contenido.appendChild(document.importNode(nodo, true));
        });
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
    else if (nombre == 'perfil') initPerfil();
}

////////////////////////// LLAMADAS //////////////////////////
cargarVista('inicio');

////////////////////////// ESCUCHADORES //////////////////////////
document.querySelector('.navbar').addEventListener('click', function (e) {
    if (e.target.classList.contains('nav-link') || e.target.classList.contains('dropdown-item')) {
        if (e.target.dataset.vista) {
            cargarVista(e.target.dataset.vista);
        }
    }
});

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

btnPerfil.addEventListener('click', function (e) {
    e.stopPropagation();
    dropdownPerfil.classList.toggle('visible');
});

document.addEventListener('click', function () {
    dropdownPerfil.classList.remove('visible');
});

window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});