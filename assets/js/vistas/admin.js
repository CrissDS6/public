////////////////////////// VARIABLES //////////////////////////
let tabActiva = 'foro';

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
    const response = await fetch('api/admin.php?tipo=mensajes');
    const { success, datos } = await response.json();

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

        // Badge de estado
        const badge = document.createElement('span');
        badge.classList.add('admin-estado-badge', 'admin-estado-' + msg.estado);
        badge.textContent = msg.estado.replace('_', ' ');
        clon.querySelector('.admin-card-info').appendChild(badge);

        lista.appendChild(clon);
    });
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
    const latitud = document.querySelector('#nueva-latitud').value;
    const longitud = document.querySelector('#nueva-longitud').value;
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

    if (latitud === '' || longitud === '') {
        mensaje.textContent = 'Las coordenadas son obligatorias';
        mensaje.className = 'error';
        return;
    }

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
        mensaje.textContent = '¡Ciudad añadida correctamente!';
        mensaje.className = 'exito';
        document.querySelector('#nueva-ciudad').value = '';
        document.querySelector('#nueva-provincia').value = '';
        document.querySelector('#nueva-latitud').value = '';
        document.querySelector('#nueva-longitud').value = '';
        setTimeout(function () {
            mensaje.textContent = '';
            mensaje.className = '';
        }, 3000);
    } else {
        mensaje.textContent = error || 'Error al añadir la ciudad';
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

            if (tabActiva == 'foro') cargarPendientes();
            else if (tabActiva == 'mensajes') cargarMensajes();
            else if (tabActiva == 'ciudades') cargarSugerenciasCiudad();
            else if (tabActiva == 'usuarios') cargarUsuariosAdmin();
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

    //Añadir ciudad
    document.querySelector('#btn-anadir-ciudad-admin').addEventListener('click', function () {
        anadirCiudadAdmin();
    });

    //Resetear password usuario
    document.querySelector('#lista-usuarios-admin').addEventListener('click', function (e) {
        if (e.target.classList.contains('btn-resetear-pass')) {
            const card = e.target.closest('.admin-card');
            resetearPassword(e.target.dataset.id, card);
        }
    });
}