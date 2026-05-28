////////////////////////// CONSTANTES //////////////////////////
const API_KEY = '6503d50520029d03c68708a566d29cbe';
const URL_API = 'https://api.openweathermap.org/data/2.5/weather';

////////////////////////// FUNCIONES //////////////////////////

///// Elige qué gif del tiempo mostrar según el código de la API, temperatura y humedad /////
function obtenerGifTiempo(codigo, temp, humedad) {
    const base = 'assets/img/tiempo/';
    if (codigo >= 200 && codigo < 300) return base + 'tormenta.gif';
    if (codigo >= 300 && codigo < 400) return base + 'llovizna.gif';
    if (codigo >= 500 && codigo < 600) return base + 'lluvia.gif';
    if (codigo >= 600 && codigo < 700) return base + 'nieve.gif';
    if (codigo == 731 || codigo == 751 || codigo == 761) return base + 'niebla.gif'; // calima
    if (codigo == 771 || codigo == 781) return base + 'viento.gif';
    if (codigo >= 700 && codigo < 800) return base + 'niebla.gif';
    if (codigo === 800) {
        if (temp >= 28) return base + 'caliente.gif';
        if (temp <= 8) return base + 'frio.gif';
        return base + 'sol.gif';
    }
    if (codigo === 801) return base + 'sol_nubes.gif';
    if (codigo >= 802) {
        if (humedad >= 70) return base + 'humedad.gif';
        if (temp <= 8) return base + 'frio.gif';
        return base + 'nublado.gif';
    }
    return base + 'estable.gif';
}

///// Llama a la API del tiempo y pinta la tarjeta del widget en la landing /////
async function cargarTiempo(lat, lon, nombreCiudad) {
    try {
        const url = URL_API + '?lat=' + lat + '&lon=' + lon + '&appid=' + API_KEY + '&units=metric&lang=es&t=' + Date.now();
        const res = await fetch(url);
        const datos = await res.json();

        const temp = Math.round(datos.main.temp);
        const humedad = datos.main.humidity;
        const descripcion = datos.weather[0].description;
        const codigo = datos.weather[0].id;
        const ciudad = nombreCiudad || datos.name;

        document.querySelector('#weather-temp').textContent = temp + '°C';

        const iconEl = document.querySelector('#weather-icon');
        iconEl.innerHTML = '';
        const img = document.createElement('img');
        img.src = obtenerGifTiempo(codigo, temp, humedad);
        img.alt = descripcion;
        img.style.width = '80px';
        img.style.height = '80px';
        iconEl.appendChild(img);

        document.querySelector('#weather-desc').textContent = descripcion.charAt(0).toUpperCase() + descripcion.slice(1);
        document.querySelector('#weather-ciudad').textContent = '📍 ' + ciudad;

    } catch {
        document.querySelector('#weather-desc').textContent = 'No se pudo cargar el tiempo';
    }
}

///// Pide la ubicación al navegador y arranca el widget del tiempo /////
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

///// Abre el modal de inicio de sesión /////
function abrirModalLogin() {
    document.querySelector('#modal-login').classList.add('visible');
}

///// Cierra el modal de inicio de sesión /////
function cerrarModalLogin() {
    document.querySelector('#modal-login').classList.remove('visible');
}

///// Carga los avatares disponibles y los muestra en el selector del registro /////
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

///// Carga las provincias disponibles en el select del formulario de registro /////
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

///// Carga las ciudades de una provincia concreta en el select del registro /////
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

///// Limpia y abre el modal de registro /////
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

///// Valida los datos del registro y envía el formulario a la API /////
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

    if (!document.querySelector('#reg-terminos').checked) {
        mensaje.textContent = 'Debes aceptar los términos y condiciones';
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

///// Convierte una fecha en texto legible como "Hace 3h" o "Hace 2d" /////
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

///// Carga las últimas publicaciones del foro y las muestra en la landing /////
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

///// Comprueba que la contraseña cumple los requisitos de seguridad /////
function validarPassword(password) {
    const errores = [];
    if (password.length < 8) errores.push('al menos 8 caracteres');
    if (!/[A-Z]/.test(password)) errores.push('una mayúscula');
    if (!/[0-9]/.test(password)) errores.push('un número');
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) errores.push('un carácter especial');
    return errores;
}

///// Limpia y abre el modal de contacto /////
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

///// Valida y envía el formulario de contacto a la API /////
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

const menuToggle = document.querySelector('#menuToggle');
const navbarNav = document.querySelector('#navbarNav');

///// Abre y cierra el menú de navegación en móvil /////
menuToggle.addEventListener('click', function () {
    navbarNav.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

///// Cierra el menú móvil al pulsar cualquier enlace de navegación /////
document.querySelectorAll('.nav-link:not(#btn-abrir-login), .btn-register').forEach(function (link) {
    link.addEventListener('click', function () {
        navbarNav.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

///// Hace scroll suave al pulsar enlaces internos de la página /////
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        if (href === '#contacto') return;
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
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

///// Abre el modal de registro al pulsar los botones de registro de la landing /////
document.querySelectorAll('a[href="index.html?registro=1"], .btn-cta, .btn-register').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        abrirModalRegistro();
    });
});

///// Cierra el modal de registro al pulsar la X /////
document.querySelector('#modal-registro-cerrar').addEventListener('click', function () {
    document.querySelector('#modal-registro').classList.remove('visible');
});

///// Cierra el modal de registro al pulsar fuera del contenido /////
document.querySelector('#modal-registro').addEventListener('click', function (e) {
    if (e.target == document.querySelector('#modal-registro')) {
        document.querySelector('#modal-registro').classList.remove('visible');
    }
});

///// Va al modal de login desde el enlace del modal de registro /////
document.querySelector('#btn-ir-login').addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector('#modal-registro').classList.remove('visible');
    abrirModalLogin();
});

///// Carga las ciudades al cambiar la provincia en el registro /////
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

///// Cierra el registro y avisa al usuario de cómo sugerir una ciudad /////
document.querySelector('#btn-sugerir-ciudad').addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector('#modal-registro').classList.remove('visible');
    alert('Para sugerir una ciudad, usa el formulario de contacto indicando el nombre de tu ciudad y provincia.');
});

///// Llama a la función de registro al pulsar el botón de crear cuenta /////
document.querySelector('#btn-registrarse').addEventListener('click', function () {
    registrarUsuario();
});

///// Va al modal de registro desde el enlace del modal de login /////
document.querySelector('#btn-abrir-registro').addEventListener('click', function (e) {
    e.preventDefault();
    cerrarModalLogin();
    abrirModalRegistro();
});

///// Cierra el modal de contacto al pulsar la X /////
document.querySelector('#modal-contacto-cerrar').addEventListener('click', function () {
    document.querySelector('#modal-contacto').classList.remove('visible');
});

///// Cierra el modal de contacto al pulsar fuera del contenido /////
document.querySelector('#modal-contacto').addEventListener('click', function (e) {
    if (e.target == document.querySelector('#modal-contacto')) {
        document.querySelector('#modal-contacto').classList.remove('visible');
    }
});

///// Llama a la función de envío al pulsar el botón del formulario de contacto /////
document.querySelector('#btn-enviar-contacto').addEventListener('click', function () {
    enviarContacto();
});

///// Abre el modal de contacto al pulsar el enlace del footer /////
document.querySelectorAll('a[href="#contacto"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        abrirModalContacto();
    });
});

///// Muestra u oculta la contraseña al pulsar el icono del ojo /////
document.querySelectorAll('.btn-toggle-pass').forEach(function (btn) {
    btn.addEventListener('click', function () {
        var input = document.getElementById(btn.dataset.target);
        if (input.type === 'password') {
            input.type = 'text';
            btn.textContent = '🙈';
        } else {
            input.type = 'password';
            btn.textContent = '👁️';
        }
    });
});

///// Abre el modal de contacto al pulsar ¿Olvidaste tu contraseña? /////
document.querySelector('#btn-recuperar-pass').addEventListener('click', function (e) {
    e.preventDefault();
    cerrarModalLogin();
    document.querySelector('#contacto-tipo').value = 'problema';
    abrirModalContacto();
});

///// Abre el modal de términos y condiciones /////
document.querySelector('#btn-ver-terminos').addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector('#modal-terminos').classList.add('visible');
});

///// Cierra el modal de términos y marca el checkbox como aceptado /////
document.querySelector('#btn-aceptar-terminos').addEventListener('click', function () {
    document.querySelector('#reg-terminos').checked = true;
    document.querySelector('#modal-terminos').classList.remove('visible');
});

///// Cierra el modal de términos al pulsar la X /////
document.querySelector('#modal-terminos-cerrar').addEventListener('click', function () {
    document.querySelector('#modal-terminos').classList.remove('visible');
});