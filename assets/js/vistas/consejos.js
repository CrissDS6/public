////////////////////////// VARIABLES //////////////////////////

// Tabla que relaciona cada código de la API con un tipo de tiempo
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

// Ruta del gif que corresponde a cada tipo de tiempo
const GIFS_TIEMPO = {
    'tormenta': 'assets/img/tiempo/tormenta.gif',
    'lluvia': 'assets/img/tiempo/lluvia.gif',
    'llovizna': 'assets/img/tiempo/llovizna.gif',
    'nieve': 'assets/img/tiempo/nieve.gif',
    'niebla': 'assets/img/tiempo/niebla.gif',
    'viento': 'assets/img/tiempo/viento.gif',
    'calor': 'assets/img/tiempo/caliente.gif',
    'humedad': 'assets/img/tiempo/humedad.gif',
    'frio': 'assets/img/tiempo/frio.gif',
    'estable': 'assets/img/tiempo/estable.gif',
    'calima': 'assets/img/tiempo/niebla.gif'
};

// Controla qué consejos ya se han mostrado para no repetirlos en la misma sesión
let consejosUsadosVista = {};

////////////////////////// FUNCIONES //////////////////////////

///// Convierte el código de la API del tiempo en un tipo de tiempo legible /////
function convertirCodigoATipo(codigo, temp, humedad, todosLosCodigos) {
    const codigos = todosLosCodigos || [codigo];

    if (codigos.some(c => c >= 200 && c < 300)) return 'tormenta';
    if (codigos.some(c => c >= 600 && c < 700)) return 'nieve';
    if (codigos.some(c => c == 771 || c == 781)) return 'viento';
    if (codigos.some(c => c == 731 || c == 751 || c == 761)) return 'calima';
    if (codigos.some(c => c >= 500 && c < 600)) return 'lluvia';
    if (codigos.some(c => c >= 300 && c < 400)) return 'llovizna';
    if (codigos.some(c => c >= 700 && c < 800)) return 'niebla';
    if (temp >= 28) return 'calor';
    if (temp <= 8) return 'frio';
    if (humedad >= 70) return 'humedad';
    return 'estable';
}

///// Elige qué gif del tiempo mostrar en la tarjeta del clima de consejos /////
function obtenerGifConsejos(codigo, temp, humedad) {
    const base = 'assets/img/tiempo/';
    if (codigo >= 200 && codigo < 300) return base + 'tormenta.gif';
    if (codigo >= 300 && codigo < 400) return base + 'llovizna.gif';
    if (codigo >= 500 && codigo < 600) return base + 'lluvia.gif';
    if (codigo >= 600 && codigo < 700) return base + 'nieve.gif';
    if (codigo == 731 || codigo == 751 || codigo == 761) return base + 'niebla.gif';
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

///// Arranca la vista consejos: carga el tiempo, pide consejos y los pinta por mascota /////
async function initConsejos() {
    consejosUsadosVista = {};

    const resSesion = await fetch('api/sesion.php');
    const datosSession = await resSesion.json();

    if (!datosSession.success || !datosSession.latitud) {
        document.querySelector('#consejos-lista').innerHTML =
            '<p class="consejos-vacio">No tienes ciudad principal configurada.</p>';
        return;
    }

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
    const todosLosCodigos = datosTiempo.weather.map(w => w.id);
    const tipeTiempo = convertirCodigoATipo(codigo, temp, humedad, todosLosCodigos);

    // Pintamos la tarjeta del clima
    document.querySelector('#consejos-ciudad').textContent = datosSession.ciudad;
    document.querySelector('#consejos-temp').textContent = temp + '°C';

    const iconEl = document.querySelector('#consejos-icono');
    iconEl.innerHTML = '';
    const img = document.createElement('img');
    img.src = obtenerGifConsejos(codigo, temp, humedad);
    img.alt = descripcion;
    img.style.width = '80px';
    img.style.height = '80px';
    iconEl.appendChild(img);

    document.querySelector('#consejos-desc').textContent =
        descripcion.charAt(0).toUpperCase() + descripcion.slice(1);

    const resConsejos = await fetch('api/consejos.php?tipo_tiempo=' + tipeTiempo);
    const datosConsejos = await resConsejos.json();

    const lista = document.querySelector('#consejos-lista');

    if (!datosConsejos.success || datosConsejos.consejos.length == 0) {
        lista.innerHTML = '<p class="consejos-vacio">Aún no tienes mascotas registradas. ¡Añade tu primera mascota para recibir consejos personalizados! 🐾</p>';
        return;
    }

    // Creamos una tarjeta de consejo por cada mascota
    datosConsejos.consejos.forEach(function (consejo, indice) {
        const template = document.querySelector('#template-consejo');
        const clon = template.content.cloneNode(true);

        // Las tarjetas alternan entre azul y amarillo
        const color = indice % 2 == 0 ? 'azul' : 'amarillo';
        clon.querySelector('.consejo-card').classList.add(color);

        const gifTiempo = GIFS_TIEMPO[tipeTiempo] || 'assets/img/tiempo/estable.gif';

        // Elegimos un consejo que no se haya mostrado ya en esta sesión
        const clave = consejo.nombre_especie + '_' + tipeTiempo;
        if (!consejosUsadosVista[clave]) {
            consejosUsadosVista[clave] = [];
        }

        let disponibles = consejo.textos.filter(function (t) {
            return !consejosUsadosVista[clave].includes(t);
        });

        if (disponibles.length == 0) {
            consejosUsadosVista[clave] = [];
            disponibles = consejo.textos;
        }

        const indiceAleatorio = Math.floor(Math.random() * disponibles.length);
        const texto = disponibles[indiceAleatorio];
        consejosUsadosVista[clave].push(texto);

        // Imagen de la especie (perro o gato)
        const imgEspecie = consejo.nombre_especie == 'Perro'
            ? 'assets/img/ui/img_perro.png'
            : 'assets/img/ui/img_gato.png';
        const iconoEl = clon.querySelector('.consejo-emoji-mascota');
        iconoEl.innerHTML = '';
        const imgEl = document.createElement('img');
        imgEl.src = imgEspecie;
        imgEl.alt = consejo.nombre_especie;
        imgEl.style.width = '60px';
        imgEl.style.height = '60px';
        imgEl.style.objectFit = 'contain';
        iconoEl.appendChild(imgEl);

        // Título con el nombre de la mascota y el gif del tiempo
        const tituloEl = clon.querySelector('.consejo-titulo');
        tituloEl.textContent = consejo.nombre_mascota + ' te aconseja... ';
        const imgTitulo = document.createElement('img');
        imgTitulo.src = gifTiempo;
        imgTitulo.alt = tipeTiempo;
        imgTitulo.style.width = '32px';
        imgTitulo.style.height = '32px';
        imgTitulo.style.verticalAlign = 'middle';
        tituloEl.appendChild(imgTitulo);

        clon.querySelector('.consejo-texto').textContent = texto;

        lista.appendChild(clon);
    });
}
