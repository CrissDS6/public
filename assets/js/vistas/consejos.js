////////////////////////// VARIABLES //////////////////////////
const TIPOS_TIEMPO = {
    200: 'tormenta', 201: 'tormenta', 202: 'tormenta',
    210: 'tormenta', 211: 'tormenta', 212: 'tormenta',
    221: 'tormenta', 230: 'tormenta', 231: 'tormenta', 232: 'tormenta',
    300: 'lluvia', 301: 'lluvia', 302: 'lluvia',
    310: 'lluvia', 311: 'lluvia', 312: 'lluvia',
    313: 'lluvia', 314: 'lluvia', 321: 'lluvia',
    500: 'lluvia', 501: 'lluvia', 502: 'lluvia', 503: 'lluvia', 504: 'lluvia',
    511: 'nieve', 520: 'lluvia', 521: 'lluvia', 522: 'lluvia', 531: 'lluvia',
    600: 'nieve', 601: 'nieve', 602: 'nieve',
    611: 'nieve', 612: 'nieve', 613: 'nieve',
    615: 'nieve', 616: 'nieve', 620: 'nieve', 621: 'nieve', 622: 'nieve',
    701: 'niebla', 711: 'niebla', 721: 'niebla',
    731: 'viento', 741: 'niebla', 751: 'niebla',
    761: 'niebla', 762: 'niebla', 771: 'viento', 781: 'viento',
    800: 'calor',
    801: 'calor', 802: 'humedad', 803: 'humedad', 804: 'humedad'
};

const EMOJIS_TIEMPO = {
    'tormenta': '⛈️',
    'lluvia': '🌧️',
    'nieve': '❄️',
    'niebla': '🌫️',
    'viento': '💨',
    'calor': '🌡️',
    'humedad': '💧',
    'frio': '🥶',
    'estable': '😊'
};

////////////////////////// FUNCIONES //////////////////////////
function construirFrase(nombres_mascotas, nombre_especie) {
    const nombres = nombres_mascotas.split(',');
    const emoji = nombre_especie == 'Perro' ? '🐶' : '🐱';

    if (nombres.length == 1) {
        return emoji + ' ' + nombres[0] + ' te aconseja...';
    }

    const ultimo = nombres.pop();
    return emoji + ' ' + nombres.join(', ') + ' y ' + ultimo + ' te aconsejan...';
}

function convertirCodigoATipo(codigo, temp, humedad) {
    // Condiciones meteorológicas específicas primero
    if (codigo >= 200 && codigo < 300) return 'tormenta';
    if (codigo >= 300 && codigo < 600) return 'lluvia';
    if (codigo >= 600 && codigo < 700) return 'nieve';
    if (codigo >= 700 && codigo < 760) return 'niebla';
    if (codigo == 761 || codigo == 771 || codigo == 781) return 'viento';

    // Temperatura extrema
    if (temp >= 28) return 'calor';
    if (temp <= 8) return 'frio';

    // Humedad alta con temperatura normal
    if (humedad >= 70) return 'humedad';

    // Resto → día estable
    return 'estable';
}

function obtenerEmojiConsejos(codigo) {
    if (codigo >= 200 && codigo < 300) return '⛈️';
    if (codigo >= 300 && codigo < 600) return '🌧️';
    if (codigo >= 600 && codigo < 700) return '❄️';
    if (codigo >= 700 && codigo < 800) return '🌫️';
    if (codigo == 800) return '☀️';
    if (codigo == 801) return '🌤️';
    if (codigo >= 802) return '☁️';
    return '🌡️';
}

async function initConsejos() {
    // Cargamos el tiempo de la ciudad principal
    const resSesion = await fetch('api/sesion.php');
    const datosSession = await resSesion.json();

    if (!datosSession.success || !datosSession.latitud) {
        document.querySelector('#consejos-lista').innerHTML =
            '<p class="consejos-vacio">No tienes ciudad principal configurada.</p>';
        return;
    }

    // Llamamos a OpenWeatherMap
    const urlTiempo = URL_TIEMPO + '?lat=' + datosSession.latitud +
        '&lon=' + datosSession.longitud +
        '&appid=' + API_KEY_TIEMPO +
        '&units=metric&lang=es&t=' + Date.now();

    const resTiempo = await fetch(urlTiempo);
    const datosTiempo = await resTiempo.json();

    const codigo = datosTiempo.weather[0].id;
    const temp = Math.round(datosTiempo.main.temp);
    const humedad = datosTiempo.main.humidity;
    const descripcion = datosTiempo.weather[0].description;
    const tipeTiempo = convertirCodigoATipo(codigo);


    // Pintamos la tarjeta del clima
    document.querySelector('#consejos-ciudad').textContent = datosSession.ciudad;
    document.querySelector('#consejos-temp').textContent = temp + '°C';
    document.querySelector('#consejos-icono').textContent = obtenerEmojiConsejos(codigo);
    document.querySelector('#consejos-desc').textContent =
        descripcion.charAt(0).toUpperCase() + descripcion.slice(1);

    // Pedimos los consejos según el tipo de tiempo
    const resConsejos = await fetch('api/consejos.php?tipo_tiempo=' + tipeTiempo);
    const datosConsejos = await resConsejos.json();

    const lista = document.querySelector('#consejos-lista');

    if (!datosConsejos.success || datosConsejos.consejos.length == 0) {
        lista.innerHTML = '<p class="consejos-vacio">No hay consejos disponibles.</p>';
        return;
    }

    datosConsejos.consejos.forEach(function (bloque) {
        const div = document.createElement('div');
        div.classList.add('consejos-bloque');

        const frase = construirFrase(bloque.nombres_mascotas, bloque.nombre_especie);
        const emojiTiempo = EMOJIS_TIEMPO[tipeTiempo] || '🌡️';

        let consejosHTML = '';
        bloque.textos.forEach(function (texto) {
            consejosHTML += '<div class="consejo-item">' + texto + '</div>';
        });

        div.innerHTML = `
            <div class="consejos-bloque-header">
                <span class="tiempo-icono">${emojiTiempo}</span>
                <h3>${frase}</h3>
            </div>
            <div class="consejos-bloque-body">
                ${consejosHTML}
            </div>
        `;

        lista.appendChild(div);
    });
}