////////////////////////// VARIABLES //////////////////////////
let tabActiva = 'foro';
let filtroEstadoMensajes = '';

////////////////////////// FUNCIONES //////////////////////////
function formatearFecha(fechaStr) {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES') + ' ' + fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

function obtenerLabelTipo(tipo) {
    const tipos = {
        'problema': '🔴 Problema',
        'consulta': '🔵 Consulta',
        'sugerencia_ciudad': '🟡 Sugerencia ciudad',
        'otro': '⚪ Otro'
    };
    return tipos[tipo] || tipo;
}

async function cargarPendientes() {
    const response = await fetch('api/admin.php?tipo=foro');
    const { success, datos } = await response.json();

    const lista = document.querySelector('#lista-pendientes');
    lista.innerHTML = '';

    if (!success || datos.length == 0) {
        const p = document.createElement('p');
        p.classList.add('admin-vacio');
        p.textContent = '✅ No hay publicaciones pendientes de revisión';
        lista.appendChild(p);
        return;
    }

    const template = document.querySelector('#template-pendiente');

    datos.forEach(function (pub) {
        const clon = template.content.cloneNode(true);
        const card = clon.querySelector('.admin-card');
        card.dataset.id = pub.id_publicacion;

        clon.querySelector('.admin-card-autor').textContent = '👤 ' + pub.nombre_usuario;
        clon.querySelector('.admin-card-fecha').textContent = formatearFecha(pub.fecha_envio);
        clon.querySelector('.admin-card-especie').textContent = (pub.nombre_especie == 'Perro' ? '🐶' : '🐱') + ' ' + pub.nombre_especie;
        clon.querySelector('.admin-card-ubicacion').textContent = pub.ciudad ? '📍 ' + pub.ciudad + ', ' + pub.provincia : '';
        clon.querySelector('.admin-card-titulo').textContent = pub.titulo;
        clon.querySelector('.admin-card-contenido').textContent = pub.contenido;

        clon.querySelector('.btn-aprobar').dataset.id = pub.id_publicacion;
        clon.querySelector('.btn-rechazar').dataset.id = pub.id_publicacion;

        lista.appendChild(clon);
    });
}

async function cargarMensajes() {
    const url = 'api/admin.php?tipo=mensajes' + (filtroEstadoMensajes ? '&estado=' + filtroEstadoMensajes : '');
    const response = await fetch(url);
    const { success, datos, pendientes } = await response.json();

    actualizarBadge(pendientes);

    const lista = document.querySelector('#lista-mensajes');
    lista.innerHTML = '';

    if (!success || datos.length == 0) {
        const p = document.createElement('p');
        p.classList.add('admin-vacio');
        p.textContent = 'No hay mensajes';
        lista.appendChild(p);
        return;
    }

    const template = document.querySelector('#template-mensaje');

    datos.forEach(function (msg) {
        const clon = template.content.cloneNode(true);

        clon.querySelector('.admin-card-autor').textContent = '👤 ' + msg.nombre;
        clon.querySelector('.admin-card-email').textContent = '✉️ ' + msg.email;
        clon.querySelector('.admin-card-tipo-badge').textContent = obtenerLabelTipo(msg.tipo);
        clon.querySelector('.admin-card-fecha').textContent = formatearFecha(msg.fecha_envio);
        clon.querySelector('.admin-card-titulo').textContent = msg.asunto;
        clon.querySelector('.admin-card-contenido').textContent = msg.texto;

        const select = clon.querySelector('.select-estado');
        select.value = msg.estado;
        select.dataset.id = msg.id_mensaje;

        const badge = document.createElement('span');
        badge.classList.add('admin-estado-badge', 'admin-estado-' + msg.estado);
        badge.textContent = msg.estado.replace('_', ' ');
        clon.querySelector('.admin-card-info').appendChild(badge);

        lista.appendChild(clon);
    });
}

async function cargarProvinciasAdmin() {
    const response = await fetch('api/ciudades_catalogo.php');
    const { success, datos } = await response.json();
    if (!success) return;

    const select = document.querySelector('#nueva-provincia');
    datos.forEach(function (item) {
        const option = document.createElement('option');
        option.value = item.provincia;
        option.textContent = item.provincia;
        select.appendChild(option);
    });
}

function actualizarBadge(total) {
    const badge = document.querySelector('#badge-mensajes');
    if (!badge) return;
    if (total > 0) {
        badge.textContent = total;
        badge.style.display = 'inline-flex';
    } else {
        badge.style.display = 'none';
    }
}

async function moderarPublicacion(id, estado) {
    const response = await fetch('api/admin.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'tipo=foro&id_publicacion=' + id + '&estado=' + estado
    });

    const { success } = await response.json();
    if (success) cargarPendientes();
}

async function actualizarEstadoMensaje(id, estado) {
    const response = await fetch('api/admin.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'tipo=mensaje&id_mensaje=' + id + '&estado=' + estado
    });

    const { success } = await response.json();
    if (!success) alert('Error al actualizar el estado');
}

async function cargarSugerenciasCiudad() {
    const response = await fetch('api/admin.php?tipo=ciudades');
    const { success, datos } = await response.json();

    const lista = document.querySelector('#lista-sugerencias-ciudad');
    lista.innerHTML = '';

    if (!success || datos.length == 0) {
        const p = document.createElement('p');
        p.classList.add('admin-vacio');
        p.textContent = 'No hay sugerencias de ciudades pendientes';
        lista.appendChild(p);
        return;
    }

    const template = document.querySelector('#template-mensaje');

    datos.forEach(function (msg) {
        const clon = template.content.cloneNode(true);

        clon.querySelector('.admin-card-autor').textContent = '👤 ' + msg.nombre;
        clon.querySelector('.admin-card-email').textContent = '✉️ ' + msg.email;
        clon.querySelector('.admin-card-tipo-badge').textContent = '🏙️ Sugerencia ciudad';
        clon.querySelector('.admin-card-fecha').textContent = formatearFecha(msg.fecha_envio);
        clon.querySelector('.admin-card-titulo').textContent = msg.asunto;
        clon.querySelector('.admin-card-contenido').textContent = msg.texto;

        const select = clon.querySelector('.select-estado');
        select.value = msg.estado;
        select.dataset.id = msg.id_mensaje;

        lista.appendChild(clon);
    });
}

async function anadirCiudadAdmin() {
    const nombre = document.querySelector('#nueva-ciudad').value.trim();
    const provincia = document.querySelector('#nueva-provincia').value;
    const mensaje = document.querySelector('#msg-ciudad-admin');

    if (nombre === '') {
        mensaje.textContent = 'El nombre de la ciudad es obligatorio';
        mensaje.className = 'error';
        return;
    }

    if (provincia === '') {
        mensaje.textContent = 'Selecciona una provincia';
        mensaje.className = 'error';
        return;
    }

    // Obtenemos coordenadas desde OpenWeatherMap
    mensaje.textContent = 'Buscando coordenadas...';
    mensaje.className = '';

    try {
        const urlTiempo = 'https://api.openweathermap.org/data/2.5/weather?q=' +
            encodeURIComponent(nombre) + ',ES&appid=' + API_KEY_TIEMPO;
        const resTiempo = await fetch(urlTiempo);
        const datosTiempo = await resTiempo.json();

        if (datosTiempo.cod !== 200) {
            mensaje.textContent = 'No se encontraron coordenadas para esa ciudad. Comprueba el nombre.';
            mensaje.className = 'error';
            return;
        }

        const latitud = datosTiempo.coord.lat;
        const longitud = datosTiempo.coord.lon;

        const response = await fetch('api/admin.php', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: 'tipo=ciudad&nombre=' + encodeURIComponent(nombre) +
                '&provincia=' + encodeURIComponent(provincia) +
                '&latitud=' + latitud +
                '&longitud=' + longitud
        });

        const { success, error } = await response.json();

        if (success) {
            mensaje.textContent = '✅ Ciudad añadida correctamente (lat: ' + latitud + ', lon: ' + longitud + ')';
            mensaje.className = 'exito';
            document.querySelector('#nueva-ciudad').value = '';
            document.querySelector('#nueva-provincia').value = '';
            setTimeout(function () {
                mensaje.textContent = '';
                mensaje.className = '';
            }, 4000);
        } else {
            mensaje.textContent = error || 'Error al añadir la ciudad';
            mensaje.className = 'error';
        }

    } catch {
        mensaje.textContent = 'Error al conectar con la API del tiempo';
        mensaje.className = 'error';
    }
}

async function cargarUsuariosAdmin() {
    const response = await fetch('api/admin.php?tipo=usuarios');
    const { success, datos } = await response.json();

    const lista = document.querySelector('#lista-usuarios-admin');
    lista.innerHTML = '';

    if (!success || datos.length == 0) {
        const p = document.createElement('p');
        p.classList.add('admin-vacio');
        p.textContent = 'No hay usuarios registrados';
        lista.appendChild(p);
        return;
    }

    const template = document.querySelector('#template-usuario-admin');

    datos.forEach(function (usuario) {
        const clon = template.content.cloneNode(true);
        const card = clon.querySelector('.admin-card');

        clon.querySelector('.admin-usuario-avatar').src = 'assets/img/avatares/' + (usuario.avatar || 'avatar_default.png');
        clon.querySelector('.admin-card-autor').textContent = usuario.nombre;
        clon.querySelector('.admin-card-email').textContent = '✉️ ' + usuario.email;
        clon.querySelector('.admin-card-fecha').textContent = 'Registro: ' + new Date(usuario.fecha_registro).toLocaleDateString('es-ES');
        clon.querySelector('.admin-usuario-rol').textContent = usuario.rol == 'administrador' ? '⚙️ Admin' : '👤 Usuario';

        const btnResetear = clon.querySelector('.btn-resetear-pass');
        btnResetear.dataset.id = usuario.id_usuario;

        if (usuario.rol == 'administrador') {
            btnResetear.disabled = true;
            btnResetear.style.opacity = '0.5';
            btnResetear.title = 'No se puede resetear la contraseña del administrador';
        }

        const btnVerMascotas = document.createElement('button');
        btnVerMascotas.classList.add('btn-ver-mascotas-admin');
        btnVerMascotas.textContent = '🐾 Ver mascotas';
        btnVerMascotas.dataset.id = usuario.id_usuario;
        clon.querySelector('.admin-card-acciones').appendChild(btnVerMascotas);

        const contenedorMascotas = document.createElement('div');
        contenedorMascotas.classList.add('admin-mascotas-contenedor');
        contenedorMascotas.style.display = 'none';
        card.appendChild(contenedorMascotas);

        btnVerMascotas.addEventListener('click', function () {
            verMascotasUsuario(this.dataset.id, contenedorMascotas);
        });

        lista.appendChild(clon);
    });
}

async function resetearPassword(id, card) {
    if (!confirm('¿Resetear la contraseña de este usuario?')) return;

    const response = await fetch('api/admin.php', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'tipo=resetear_password&id_usuario=' + id
    });

    const { success, password_temp, error } = await response.json();

    if (success) {
        const resultado = card.querySelector('.admin-pass-resultado');
        card.querySelector('.pass-temporal').textContent = password_temp;
        resultado.style.display = 'block';
    } else {
        alert(error || 'Error al resetear la contraseña');
    }
}

async function initAdmin() {
    await cargarProvinciasAdmin();
    await cargarPendientes();

    // Pestañas
    document.querySelectorAll('.admin-tab').forEach(function (tab) {
        tab.addEventListener('click', function () {
            document.querySelectorAll('.admin-tab').forEach(function (t) {
                t.classList.remove('activo');
            });
            this.classList.add('activo');
            tabActiva = this.dataset.tab;

            document.querySelector('#admin-tab-foro').style.display = tabActiva == 'foro' ? 'block' : 'none';
            document.querySelector('#admin-tab-mensajes').style.display = tabActiva == 'mensajes' ? 'block' : 'none';
            document.querySelector('#admin-tab-ciudades').style.display = tabActiva == 'ciudades' ? 'block' : 'none';
            document.querySelector('#admin-tab-usuarios').style.display = tabActiva == 'usuarios' ? 'block' : 'none';
            const filtrosMensajes = document.querySelector('#filtros-mensajes');
            if (filtrosMensajes) {
                filtrosMensajes.style.display = tabActiva == 'mensajes' ? 'flex' : 'none';
            }

            if (tabActiva == 'foro') {
                document.querySelector('#filtros-mensajes').style.display = 'none';
                cargarPendientes();
            } else if (tabActiva == 'mensajes') {
                const filtros = document.querySelector('#filtros-mensajes');
                const tabMensajes = document.querySelector('#admin-tab-mensajes');
                filtros.style.display = 'flex';
                tabMensajes.insertBefore(filtros, tabMensajes.firstChild);
                cargarMensajes();
            } else if (tabActiva == 'ciudades') {
                document.querySelector('#filtros-mensajes').style.display = 'none';
                cargarSugerenciasCiudad();
            } else if (tabActiva == 'usuarios') {
                document.querySelector('#filtros-mensajes').style.display = 'none';
                cargarUsuariosAdmin();
            }
        });
    });

    // Aprobar/rechazar por delegación
    document.querySelector('#lista-pendientes').addEventListener('click', function (e) {
        if (e.target.classList.contains('btn-aprobar')) {
            moderarPublicacion(e.target.dataset.id, 'aprobado');
        }
        if (e.target.classList.contains('btn-rechazar')) {
            moderarPublicacion(e.target.dataset.id, 'rechazado');
        }
    });

    // Cambiar estado de mensajes por delegación
    document.querySelector('#lista-mensajes').addEventListener('change', function (e) {
        if (e.target.classList.contains('select-estado')) {
            actualizarEstadoMensaje(e.target.dataset.id, e.target.value);
        }
    });

    // Añadir ciudad
    document.querySelector('#btn-anadir-ciudad-admin').addEventListener('click', function () {
        anadirCiudadAdmin();
    });

    // Resetear password usuario
    document.querySelector('#lista-usuarios-admin').addEventListener('click', function (e) {
        if (e.target.classList.contains('btn-resetear-pass')) {
            const card = e.target.closest('.admin-card');
            resetearPassword(e.target.dataset.id, card);
        }
    });

    // Filtros mensajes
    const btnsFiltroMsg = document.querySelectorAll('.btn-filtro-msg');
    if (btnsFiltroMsg.length > 0) {
        btnsFiltroMsg.forEach(function (btn) {
            btn.addEventListener('click', function () {
                document.querySelectorAll('.btn-filtro-msg').forEach(function (b) {
                    b.classList.remove('activo');
                });
                this.classList.add('activo');
                filtroEstadoMensajes = this.dataset.estado;
                cargarMensajes();
            });
        });
    }
}

async function verMascotasUsuario(id, contenedor) {
    if (contenedor.style.display == 'block') {
        contenedor.style.display = 'none';
        return;
    }

    contenedor.innerHTML = '<p style="color:var(--descriptions);font-size:0.85rem">Cargando...</p>';
    contenedor.style.display = 'block';

    const response = await fetch('api/admin.php?tipo=mascotas_usuario&id_usuario=' + id);
    const { success, datos } = await response.json();

    if (!success || datos.length == 0) {
        contenedor.innerHTML = '<p style="color:var(--medium-gray);font-size:0.85rem">Este usuario no tiene mascotas registradas.</p>';
        return;
    }

    let html = '<div class="admin-mascotas-lista">';
    datos.forEach(function (mascota) {
        const fotoSrc = mascota.foto
            ? mascota.foto
            : (mascota.nombre_especie == 'Perro' ? 'assets/img/ui/emojiPerro.png' : 'assets/img/ui/emojiGatoForo.png');

        html += `
            <div class="admin-mascota-item">
                <img src="${fotoSrc}" alt="${mascota.nombre}" class="admin-mascota-foto">
                <div class="admin-mascota-info">
                    <span class="admin-mascota-nombre">${mascota.nombre}</span>
                    <span class="admin-mascota-detalle">${mascota.nombre_especie} · ${mascota.raza || 'Sin raza'}</span>
                    <span class="admin-mascota-detalle">${mascota.edad ? mascota.edad + ' años' : 'Edad desconocida'} · ${mascota.sexo}</span>
                </div>
            </div>
        `;
    });
    html += '</div>';
    contenedor.innerHTML = html;
}