////////////////////////// VARIABLES //////////////////////////
// Las variables API_KEY_TIEMPO y URL_TIEMPO vienen de dashboard.js

////////////////////////// FUNCIONES //////////////////////////
function obtenerEmojiTiempo(codigo) {
    if (codigo >= 200 && codigo < 300) return '⛈️'; // Tormenta eléctrica
    if (codigo >= 300 && codigo < 400) return '🌦️'; // Llovizna
    if (codigo >= 500 && codigo < 600) return '🌧️'; // Lluvia
    if (codigo >= 600 && codigo < 700) return '❄️';  // Nieve
    if (codigo >= 700 && codigo < 800) return '🌫️'; // Atmósfera
    if (codigo === 800) return '☀️';                 // Cielo despejado
    if (codigo === 801) return '🌤️';                // Pocas nubes
    if (codigo >= 802) return '☁️';                 // Nublado
    return '🌡️';
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

async function initInicio() {
    // Escuchadores de accesos rápidos
    document.querySelectorAll('.acceso-card').forEach(function (card) {
        card.addEventListener('click', function () {
            cargarVista(this.dataset.vista);
        });
    });

    // Pedimos datos de sesión al servidor
    const res = await fetch('api/sesion.php');
    const datos = await res.json();

    if (!datos.success) return;

    // Pintamos nombre y avatar
    document.querySelector('.saludo-nombre').textContent = datos.nombre;
    document.querySelector('.saludo-avatar').src = 'assets/img/avatares/' + datos.avatar;

    // Si tiene ciudad principal cargamos el tiempo
    if (datos.latitud && datos.longitud) {
        cargarTiempoInicio(datos.ciudad, datos.latitud, datos.longitud);
    } else {
        document.querySelector('#inicio-ciudad').textContent = 'Sin ciudad principal';
    }
}