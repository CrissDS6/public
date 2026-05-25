////////////////////////// VARIABLES //////////////////////////
const rutas = {
    'inicio': 'vistas/inicio.html',
    'mis-mascotas': 'vistas/mis-mascotas.html',
    'consejos': 'vistas/consejos.html',
    'ciudades': 'vistas/ciudades.html',
    'foro': 'vistas/foro.html',
    'perfil': 'vistas/perfil.html',
    'admin': 'vistas/admin.html'
};

const API_KEY_TIEMPO = '6503d50520029d03c68708a566d29cbe';
const URL_TIEMPO = 'https://api.openweathermap.org/data/2.5/weather';

const menuToggle = document.querySelector('#menuToggle');
const navbarNav = document.querySelector('#navbarNav');
const btnPerfil = document.querySelector('#btn-perfil');
const dropdownPerfil = document.querySelector('#dropdown-perfil');

////////////////////////// FUNCIONES //////////////////////////

///// Añade el botón "← Inicio" al principio de cualquier vista que no sea la de inicio /////
function añadirBotonVolver() {
    const contenido = document.querySelector('#contenido-principal');
    const container = contenido.querySelector('[id$="-container"]');
    if (!container) return;

    const btnVolver = document.createElement('button');
    btnVolver.classList.add('btn-volver');
    btnVolver.innerHTML = '← Inicio';
    btnVolver.addEventListener('click', function () {
        cargarVista('inicio');
    });

    container.insertBefore(btnVolver, container.firstChild);
}

///// Carga una vista parcial dentro del contenido principal del dashboard /////
async function cargarVista(nombre) {
    const contenido = document.querySelector('#contenido-principal');

    try {
        const res = await fetch(rutas[nombre] + '?t=' + Date.now());
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

    if (nombre !== 'inicio') añadirBotonVolver();

    if (nombre == 'inicio') initInicio();
    else if (nombre == 'mis-mascotas') initMisMascotas();
    else if (nombre == 'consejos') initConsejos();
    else if (nombre == 'ciudades') initCiudades();
    else if (nombre == 'foro') initForo();
    else if (nombre == 'perfil') initPerfil();
    else if (nombre == 'admin') initAdmin();
}

///// Consulta cuántos mensajes y publicaciones pendientes hay y actualiza el badge del admin /////
async function cargarBadgeAdmin() {
    const badge = document.querySelector('#badge-mensajes');
    if (!badge) return;

    const response = await fetch('api/admin.php?tipo=badge');
    const { success, pendientes } = await response.json();

    if (success && pendientes > 0) {
        badge.textContent = pendientes;
        badge.style.display = 'inline-flex';
    }
}

///// Abre el modal de contacto del dashboard y rellena nombre y email si el usuario está identificado /////
async function abrirModalContactoDash() {
    const response = await fetch('api/sesion.php');
    const sesion = await response.json();

    const inputNombre = document.querySelector('#dash-contacto-nombre');
    const inputEmail = document.querySelector('#dash-contacto-email');

    if (sesion.success) {
        inputNombre.value = sesion.nombre;
        inputEmail.value = sesion.email;
        inputNombre.disabled = true;
        inputEmail.disabled = true;
    } else {
        inputNombre.value = '';
        inputEmail.value = '';
        inputNombre.disabled = false;
        inputEmail.disabled = false;
    }

    document.querySelector('#dash-contacto-asunto').value = '';
    document.querySelector('#dash-contacto-mensaje').value = '';
    document.querySelector('#dash-contacto-tipo').value = 'consulta';
    document.querySelector('#dash-contacto-msg').textContent = '';
    document.querySelector('#dash-contacto-msg').className = '';
    document.querySelector('#modal-contacto-dash').classList.add('visible');
}

///// Valida y envía el formulario de contacto del dashboard a la API /////
async function enviarContactoDash() {
    const nombre = document.querySelector('#dash-contacto-nombre').value.trim();
    const email = document.querySelector('#dash-contacto-email').value.trim();
    const tipo = document.querySelector('#dash-contacto-tipo').value;
    const asunto = document.querySelector('#dash-contacto-asunto').value.trim();
    const texto = document.querySelector('#dash-contacto-mensaje').value.trim();
    const mensaje = document.querySelector('#dash-contacto-msg');

    if (nombre === '' || email === '' || asunto === '' || texto === '') {
        mensaje.textContent = 'Todos los campos son obligatorios';
        mensaje.className = 'error';
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        mensaje.textContent = 'El email no tiene un formato válido';
        mensaje.className = 'error';
        return;
    }

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('email', email);
    formData.append('tipo', tipo);
    formData.append('asunto', asunto);
    formData.append('texto', texto);

    const response = await fetch('api/contacto.php', {
        method: 'POST',
        body: formData
    });

    const { success, error } = await response.json();

    if (success) {
        mensaje.textContent = '¡Mensaje enviado correctamente!';
        mensaje.className = 'exito';
        setTimeout(function () {
            document.querySelector('#modal-contacto-dash').classList.remove('visible');
        }, 2000);
    } else {
        mensaje.textContent = error || 'Error al enviar el mensaje';
        mensaje.className = 'error';
    }
}

///// Carga el avatar del usuario desde la sesión y lo muestra en el navbar /////
async function cargarAvatarNav() {
    const response = await fetch('api/sesion.php');
    const { success, avatar } = await response.json();
    if (!success) return;
    document.querySelector('#nav-avatar').src = 'assets/img/avatares/' + avatar;
}

////////////////////////// LLAMADAS //////////////////////////
cargarVista('inicio');
cargarBadgeAdmin();
cargarAvatarNav();

////////////////////////// ESCUCHADORES //////////////////////////

///// Carga la vista correspondiente al pulsar cualquier enlace del navbar o del dropdown /////
document.querySelector('.navbar').addEventListener('click', function (e) {
    if (e.target.classList.contains('nav-link') || e.target.classList.contains('dropdown-item')) {
        if (e.target.dataset.vista) {
            cargarVista(e.target.dataset.vista);
            navbarNav.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    }
});

///// Abre y cierra el menú de navegación en móvil /////
menuToggle.addEventListener('click', function () {
    navbarNav.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

///// Abre y cierra el dropdown del perfil al pulsar el botón con el nombre del usuario /////
btnPerfil.addEventListener('click', function (e) {
    e.stopPropagation();
    dropdownPerfil.classList.toggle('visible');
    navbarNav.classList.add('active');
    menuToggle.classList.add('active');
});

///// Cierra el dropdown y el menú móvil al hacer click fuera de ellos /////
document.addEventListener('click', function (e) {
    if (!btnPerfil.contains(e.target) && !dropdownPerfil.contains(e.target)) {
        dropdownPerfil.classList.remove('visible');
    }
    if (!navbarNav.contains(e.target) && !menuToggle.contains(e.target)) {
        navbarNav.classList.remove('active');
        menuToggle.classList.remove('active');
    }
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

///// Abre el modal de contacto al pulsar el enlace del footer /////
document.querySelectorAll('a[href="#contacto"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        abrirModalContactoDash();
    });
});

///// Cierra el modal de contacto al pulsar la X /////
document.querySelector('#modal-contacto-dash-cerrar').addEventListener('click', function () {
    document.querySelector('#modal-contacto-dash').classList.remove('visible');
});

///// Cierra el modal de contacto al pulsar fuera del contenido /////
document.querySelector('#modal-contacto-dash').addEventListener('click', function (e) {
    if (e.target == document.querySelector('#modal-contacto-dash')) {
        document.querySelector('#modal-contacto-dash').classList.remove('visible');
    }
});

///// Llama a la función de envío al pulsar el botón del formulario de contacto /////
document.querySelector('#btn-dash-enviar-contacto').addEventListener('click', function () {
    enviarContactoDash();
});