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

// ===== MODAL REGISTRO =====
const modalRegistro = document.querySelector('#modal-registro');
const btnRegistrarse = document.querySelector('#btn-registrarse');

// Generar avatares
async function generarSelectorAvatares() {
    const selector = document.querySelector('#avatar-selector');
    selector.innerHTML = '';

    const response = await fetch('api/avatares.php');
    const { success, avatares } = await response.json();

    if (!success) return;

    avatares.forEach(function (nombreAvatar) {
        const div = document.createElement('div');
        div.classList.add('avatar-opcion');
        div.dataset.avatar = nombreAvatar;

        const img = document.createElement('img');
        img.src = 'assets/img/avatares/' + nombreAvatar;
        img.alt = nombreAvatar;
        div.appendChild(img);

        div.addEventListener('click', function () {
            document.querySelectorAll('.avatar-opcion').forEach(function (a) {
                a.classList.remove('seleccionado');
            });
            this.classList.add('seleccionado');
            document.querySelector('#reg-avatar').value = this.dataset.avatar;
        });

        selector.appendChild(div);
    });
}

// Cargar ciudades en el selector
async function cargarCiudadesRegistro() {
    const response = await fetch('api/ciudades_catalogo.php');
    const { success, datos } = await response.json();
    if (!success) return;

    const select = document.querySelector('#reg-ciudad');
    datos.forEach(function (ciudad) {
        const option = document.createElement('option');
        option.value = ciudad.id_ciudad;
        option.textContent = ciudad.nombre_ciudad + ' (' + ciudad.provincia + ')';
        select.appendChild(option);
    });
}

// Abrir modal registro
document.querySelectorAll('a[href="#registro"], .btn-cta, .btn-register').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        generarSelectorAvatares();
        cargarCiudadesRegistro();
        document.querySelector('#reg-nombre').value = '';
        document.querySelector('#reg-email').value = '';
        document.querySelector('#reg-password').value = '';
        document.querySelector('#reg-password2').value = '';
        document.querySelector('#reg-avatar').value = 'avatar_default.png';
        document.querySelector('#reg-mensaje').textContent = '';
        document.querySelector('#reg-mensaje').className = '';
        modalRegistro.classList.add('visible');
    });
});

// Cerrar modal registro
document.querySelector('#modal-registro-cerrar').addEventListener('click', function () {
    modalRegistro.classList.remove('visible');
});

modalRegistro.addEventListener('click', function (e) {
    if (e.target == modalRegistro) {
        modalRegistro.classList.remove('visible');
    }
});

// Ir al login desde registro
document.querySelector('#btn-ir-login').addEventListener('click', function (e) {
    e.preventDefault();
    modalRegistro.classList.remove('visible');
    abrirModalLogin();
});

// Registrarse
btnRegistrarse.addEventListener('click', async function () {
    const nombre = document.querySelector('#reg-nombre').value.trim();
    const email = document.querySelector('#reg-email').value.trim();
    const password = document.querySelector('#reg-password').value;
    const password2 = document.querySelector('#reg-password2').value;
    const idCiudad = document.querySelector('#reg-ciudad').value;
    const avatar = document.querySelector('#reg-avatar').value;
    const mensaje = document.querySelector('#reg-mensaje');

    // Validaciones frontend
    if (nombre === '' || email === '' || password === '' || password2 === '') {
        mensaje.textContent = 'Todos los campos son obligatorios';
        mensaje.className = 'error';
        return;
    }

    if (password !== password2) {
        mensaje.textContent = 'Las contraseñas no coinciden';
        mensaje.className = 'error';
        return;
    }

    if (password.length < 6) {
        mensaje.textContent = 'La contraseña debe tener al menos 6 caracteres';
        mensaje.className = 'error';
        return;
    }

    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('id_ciudad', idCiudad);
    formData.append('avatar', avatar);

    const response = await fetch('api/registro.php', {
        method: 'POST',
        body: formData
    });

    const { success, error } = await response.json();

    if (success) {
        mensaje.textContent = '¡Cuenta creada correctamente! Ya puedes iniciar sesión.';
        mensaje.className = 'exito';
        setTimeout(function () {
            modalRegistro.classList.remove('visible');
            abrirModalLogin();
        }, 2000);
    } else {
        mensaje.textContent = error || 'Error al crear la cuenta';
        mensaje.className = 'error';
    }
});

// ===== FORO LANDING =====
function formatearFechaLanding(fechaStr) {
    const fecha = new Date(fechaStr);
    const ahora = new Date();
    const diff = Math.floor((ahora - fecha) / 1000);

    if (diff < 60) return 'Hace un momento';
    if (diff < 3600) return 'Hace ' + Math.floor(diff / 60) + 'm';
    if (diff < 86400) return 'Hace ' + Math.floor(diff / 3600) + 'h';
    if (diff < 604800) return 'Hace ' + Math.floor(diff / 86400) + 'd';
    return fecha.toLocaleDateString('es-ES');
}

async function cargarForoLanding() {
    const response = await fetch('api/foro_publico.php');
    const { success, datos } = await response.json();

    if (!success || datos.length == 0) return;

    const contenedor = document.querySelector('#foro-landing');
    const template = document.querySelector('#template-foro-landing');

    datos.forEach(function (pub) {
        const clon = template.content.cloneNode(true);

        clon.querySelector('.forum-avatar-img').src = 'assets/img/avatares/' + (pub.avatar || 'avatar_default.png');
        clon.querySelector('.forum-avatar-img').alt = pub.nombre_usuario;
        clon.querySelector('.forum-nombre').textContent = pub.nombre_usuario;
        clon.querySelector('.forum-fecha').textContent = formatearFechaLanding(pub.fecha_envio);
        clon.querySelector('.forum-texto').textContent = pub.contenido;
        clon.querySelector('.forum-especie').textContent = (pub.nombre_especie == 'Perro' ? '🐶' : '🐱') + ' ' + pub.nombre_especie + ' · ❤️ ' + pub.likes;

        contenedor.appendChild(clon);
    });
}

cargarForoLanding();