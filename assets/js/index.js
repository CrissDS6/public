////////////////////////// CONSTANTES //////////////////////////
const API_KEY = '6503d50520029d03c68708a566d29cbe';
const URL_API = 'https://api.openweathermap.org/data/2.5/weather';

////////////////////////// FUNCIONES //////////////////////////
function obtenerEmoji(codigo) {
    if (codigo >= 200 && codigo < 300) return '⛈️'; // Tormenta eléctrica
    if (codigo >= 300 && codigo < 400) return '🌦️'; // Llovizna
    if (codigo >= 500 && codigo < 600) return '🌧️'; // Lluvia
    if (codigo >= 600 && codigo < 700) return '❄️';  // Nieve
    if (codigo == 731 || codigo == 751 || codigo == 761) return '🟤'; // Calima
    if (codigo >= 700 && codigo < 800) return '🌫️'; // Atmósfera (niebla, bruma, polvo...)
    if (codigo === 800) return '☀️';                 // Cielo despejado
    if (codigo === 801) return '🌤️';                // Pocas nubes (11-25%)
    if (codigo >= 802) return '☁️';                 // Nublado (802=25-50%, 803=50-84%, 804=+85%)
    return '🌡️';
}

async function cargarTiempo(lat, lon, nombreCiudad) {
    try {
        const url = URL_API + '?lat=' + lat + '&lon=' + lon + '&appid=' + API_KEY + '&units=metric&lang=es&t=' + Date.now();
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
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function (position) {
                cargarTiempo(position.coords.latitude, position.coords.longitude, null);
            },
            function () {
                cargarTiempo(38.4226, -6.4175, 'Zafra');
            }
        );
    } else {
        cargarTiempo(38.4226, -6.4175, 'Zafra');
    }
}

function abrirModalLogin() {
    document.querySelector('#modal-login').classList.add('visible');
}

function cerrarModalLogin() {
    document.querySelector('#modal-login').classList.remove('visible');
}

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

async function cargarProvinciasRegistro() {
    const response = await fetch('api/ciudades_catalogo.php');
    const { success, datos } = await response.json();
    if (!success) return;

    const select = document.querySelector('#reg-provincia');
    select.innerHTML = '<option value="">Selecciona una provincia...</option>';

    datos.forEach(function (item) {
        const option = document.createElement('option');
        option.value = item.provincia;
        option.textContent = item.provincia;
        select.appendChild(option);
    });
}

async function cargarCiudadesPorProvincia(provincia) {
    const selectCiudad = document.querySelector('#reg-ciudad');
    selectCiudad.innerHTML = '<option value="">Cargando...</option>';
    selectCiudad.disabled = true;

    const response = await fetch('api/ciudades_catalogo.php?provincia=' + encodeURIComponent(provincia));
    const { success, datos } = await response.json();

    if (!success || datos.length == 0) {
        selectCiudad.innerHTML = '<option value="">No hay ciudades disponibles</option>';
        document.querySelector('#ciudad-no-encontrada').style.display = 'block';
        return;
    }

    selectCiudad.innerHTML = '<option value="">Selecciona una ciudad...</option>';
    datos.forEach(function (ciudad) {
        const option = document.createElement('option');
        option.value = ciudad.id_ciudad;
        option.textContent = ciudad.nombre_ciudad;
        selectCiudad.appendChild(option);
    });

    selectCiudad.disabled = false;
    document.querySelector('#ciudad-no-encontrada').style.display = 'block';
}

function abrirModalRegistro() {
    generarSelectorAvatares();
    cargarProvinciasRegistro();
    document.querySelector('#reg-nombre').value = '';
    document.querySelector('#reg-email').value = '';
    document.querySelector('#reg-password').value = '';
    document.querySelector('#reg-password2').value = '';
    document.querySelector('#reg-avatar').value = 'avatar_default.png';
    document.querySelector('#reg-mensaje').textContent = '';
    document.querySelector('#reg-mensaje').className = '';
    document.querySelector('#reg-provincia').value = '';
    document.querySelector('#reg-ciudad').innerHTML = '<option value="">Primero selecciona una provincia</option>';
    document.querySelector('#reg-ciudad').disabled = true;
    document.querySelector('#ciudad-no-encontrada').style.display = 'none';
    document.querySelector('#modal-registro').classList.add('visible');
}

async function registrarUsuario() {
    const nombre = document.querySelector('#reg-nombre').value.trim();
    const email = document.querySelector('#reg-email').value.trim();
    const password = document.querySelector('#reg-password').value;
    const password2 = document.querySelector('#reg-password2').value;
    const idCiudad = document.querySelector('#reg-ciudad').value;
    const avatar = document.querySelector('#reg-avatar').value;
    const mensaje = document.querySelector('#reg-mensaje');
    const erroresPass = validarPassword(password);

    if (nombre === '' || email === '' || password === '' || password2 === '') {
        mensaje.textContent = 'Todos los campos son obligatorios';
        mensaje.className = 'error';
        return;
    }

    if (!idCiudad || idCiudad === '') {
        mensaje.textContent = 'Selecciona una ciudad principal';
        mensaje.className = 'error';
        return;
    }

    if (password !== password2) {
        mensaje.textContent = 'Las contraseñas no coinciden';
        mensaje.className = 'error';
        return;
    }

    if (erroresPass.length > 0) {
        mensaje.textContent = 'La contraseña debe tener ' + erroresPass.join(', ');
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
            document.querySelector('#modal-registro').classList.remove('visible');
            abrirModalLogin();
        }, 2000);
    } else {
        mensaje.textContent = error || 'Error al crear la cuenta';
        mensaje.className = 'error';
    }
}

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

function validarPassword(password) {
    const errores = [];
    if (password.length < 8) errores.push('al menos 8 caracteres');
    if (!/[A-Z]/.test(password)) errores.push('una mayúscula');
    if (!/[0-9]/.test(password)) errores.push('un número');
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) errores.push('un carácter especial');
    return errores;
}

function abrirModalContacto() {
    document.querySelector('#contacto-nombre').value = '';
    document.querySelector('#contacto-email').value = '';
    document.querySelector('#contacto-asunto').value = '';
    document.querySelector('#contacto-mensaje').value = '';
    document.querySelector('#contacto-tipo').value = 'consulta';
    document.querySelector('#contacto-msg').textContent = '';
    document.querySelector('#contacto-msg').className = '';
    document.querySelector('#modal-contacto').classList.add('visible');
}

async function enviarContacto() {
    const nombre = document.querySelector('#contacto-nombre').value.trim();
    const email = document.querySelector('#contacto-email').value.trim();
    const tipo = document.querySelector('#contacto-tipo').value;
    const asunto = document.querySelector('#contacto-asunto').value.trim();
    const texto = document.querySelector('#contacto-mensaje').value.trim();
    const mensaje = document.querySelector('#contacto-msg');

    if (nombre === '' || email === '' || asunto === '' || texto === '') {
        mensaje.textContent = 'Todos los campos son obligatorios';
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
        mensaje.textContent = '¡Mensaje enviado correctamente! Te responderemos lo antes posible.';
        mensaje.className = 'exito';
        document.querySelector('#contacto-nombre').value = '';
        document.querySelector('#contacto-email').value = '';
        document.querySelector('#contacto-asunto').value = '';
        document.querySelector('#contacto-mensaje').value = '';
        document.querySelector('#contacto-tipo').value = 'consulta';
    } else {
        mensaje.textContent = error || 'Error al enviar el mensaje';
        mensaje.className = 'error';
    }
}

////////////////////////// LLAMADAS //////////////////////////
iniciarWidget();
cargarForoLanding();

if (window.location.search.includes('error=1')) {
    abrirModalLogin();
    document.querySelector('#modal-error').style.display = 'block';
}

if (window.location.search.includes('registro=1')) {
    abrirModalRegistro();
}

////////////////////////// ESCUCHADORES //////////////////////////

// Menú móvil
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

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        if (href === '#contacto') return; // dejamos que lo maneje el modal
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
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

// Modal registro - abrir
document.querySelectorAll('a[href="index.html?registro=1"], .btn-cta, .btn-register').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        abrirModalRegistro();
    });
});

// Modal registro - cerrar
document.querySelector('#modal-registro-cerrar').addEventListener('click', function () {
    document.querySelector('#modal-registro').classList.remove('visible');
});

document.querySelector('#modal-registro').addEventListener('click', function (e) {
    if (e.target == document.querySelector('#modal-registro')) {
        document.querySelector('#modal-registro').classList.remove('visible');
    }
});

// Ir al login desde registro
document.querySelector('#btn-ir-login').addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector('#modal-registro').classList.remove('visible');
    abrirModalLogin();
});

// Selector de provincia
document.querySelector('#reg-provincia').addEventListener('change', function () {
    if (this.value !== '') {
        cargarCiudadesPorProvincia(this.value);
    } else {
        const selectCiudad = document.querySelector('#reg-ciudad');
        selectCiudad.innerHTML = '<option value="">Primero selecciona una provincia</option>';
        selectCiudad.disabled = true;
        document.querySelector('#ciudad-no-encontrada').style.display = 'none';
    }
});

// Sugerir ciudad
document.querySelector('#btn-sugerir-ciudad').addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector('#modal-registro').classList.remove('visible');
    alert('Para sugerir una ciudad, usa el formulario de contacto indicando el nombre de tu ciudad y provincia.');
});

// Botón registrarse
document.querySelector('#btn-registrarse').addEventListener('click', function () {
    registrarUsuario();
});

document.querySelector('#btn-abrir-registro').addEventListener('click', function (e) {
    e.preventDefault();
    cerrarModalLogin();
    abrirModalRegistro();
});

// Modal contacto
document.querySelector('#modal-contacto-cerrar').addEventListener('click', function () {
    document.querySelector('#modal-contacto').classList.remove('visible');
});

document.querySelector('#modal-contacto').addEventListener('click', function (e) {
    if (e.target == document.querySelector('#modal-contacto')) {
        document.querySelector('#modal-contacto').classList.remove('visible');
    }
});

document.querySelector('#btn-enviar-contacto').addEventListener('click', function () {
    enviarContacto();
});

// Enlace del footer
document.querySelectorAll('a[href="#contacto"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        abrirModalContacto();
    });
});