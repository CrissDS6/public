////////////////////////// VARIABLES //////////////////////////
// API_KEY_TIEMPO y URL_TIEMPO vienen de dashboard.js

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

///// Llama a la API del tiempo y pinta la tarjeta del clima en la vista inicio /////
async function cargarTiempoInicio(ciudad, lat, lon) {
    try {
        const url = URL_TIEMPO + '?lat=' + lat + '&lon=' + lon + '&appid=' + API_KEY_TIEMPO + '&units=metric&lang=es&t=' + Date.now();
        const res = await fetch(url);
        const datos = await res.json();

        const temp = Math.round(datos.main.temp);
        const humedad = datos.main.humidity;
        const descripcion = datos.weather[0].description;
        const codigo = datos.weather[0].id;

        document.querySelector('#inicio-ciudad').textContent = ciudad;
        document.querySelector('#inicio-temp').textContent = temp + '°C';

        const iconEl = document.querySelector('#inicio-icono');
        iconEl.innerHTML = '';
        const img = document.createElement('img');
        img.src = obtenerGifTiempo(codigo, temp, humedad);
        img.alt = descripcion;
        img.style.width = '80px';
        img.style.height = '80px';
        iconEl.appendChild(img);

        document.querySelector('#inicio-desc').textContent = descripcion.charAt(0).toUpperCase() + descripcion.slice(1);

    } catch {
        document.querySelector('#inicio-desc').textContent = 'No se pudo cargar el tiempo';
    }
}

///// Arranca la vista inicio: pinta el saludo, el avatar, el tiempo y registra los accesos rápidos /////
async function initInicio() {
    ///// Cada tarjeta de acceso rápido carga su vista al hacer click /////
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