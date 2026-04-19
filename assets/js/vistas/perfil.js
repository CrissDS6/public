////////////////////////// VARIABLES //////////////////////////
let avatarSeleccionado = '';

////////////////////////// FUNCIONES //////////////////////////
function mostrarMensaje(idElemento, texto, tipo) {
    const el = document.querySelector(idElemento);
    el.textContent = texto;
    el.className = tipo == 'exito' ? 'msg-exito' : 'msg-error';
    setTimeout(function () {
        el.textContent = '';
        el.className = '';
    }, 3000);
}

async function cargarAvataresPerfil() {
    const response = await fetch('api/avatares.php');
    const { success, avatares } = await response.json();
    if (!success) return;

    const selector = document.querySelector('#perfil-avatar-selector');
    selector.innerHTML = '';

    avatares.forEach(function (nombreAvatar) {
        const div = document.createElement('div');
        div.classList.add('avatar-opcion');
        div.dataset.avatar = nombreAvatar;

        const img = document.createElement('img');
        img.src = 'assets/img/avatares/' + nombreAvatar;
        img.alt = nombreAvatar;
        div.appendChild(img);

        if (nombreAvatar == avatarSeleccionado) {
            div.classList.add('seleccionado');
        }

        div.addEventListener('click', function () {
            document.querySelectorAll('#perfil-avatar-selector .avatar-opcion').forEach(function (a) {
                a.classList.remove('seleccionado');
            });
            this.classList.add('seleccionado');
            avatarSeleccionado = this.dataset.avatar;
            document.querySelector('#perfil-avatar-actual').src = 'assets/img/avatares/' + avatarSeleccionado;
        });

        selector.appendChild(div);
    });
}

async function guardarAvatar() {
    if (!avatarSeleccionado) {
        mostrarMensaje('#msg-avatar', 'Selecciona un avatar primero', 'error');
        return;
    }

    const response = await fetch('api/perfil.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'tipo=avatar&avatar=' + encodeURIComponent(avatarSeleccionado)
    });

    const { success, error } = await response.json();

    if (success) {
        mostrarMensaje('#msg-avatar', '¡Avatar actualizado correctamente!', 'exito');
    } else {
        mostrarMensaje('#msg-avatar', error || 'Error al actualizar el avatar', 'error');
    }
}

async function guardarDatos() {
    const nombre = document.querySelector('#perfil-nombre').value.trim();

    if (nombre === '') {
        mostrarMensaje('#msg-datos', 'El nombre no puede estar vacío', 'error');
        return;
    }

    const response = await fetch('api/perfil.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'tipo=datos&nombre=' + encodeURIComponent(nombre)
    });

    const { success, error } = await response.json();

    if (success) {
        mostrarMensaje('#msg-datos', '¡Datos actualizados correctamente!', 'exito');
        // Actualizamos el nombre en el navbar
        document.querySelector('#btn-perfil').childNodes[0].textContent = nombre.split(' ')[0] + ' ';
    } else {
        mostrarMensaje('#msg-datos', error || 'Error al actualizar los datos', 'error');
    }
}

async function guardarPassword() {
    const passActual = document.querySelector('#perfil-pass-actual').value;
    const passNueva = document.querySelector('#perfil-pass-nueva').value;
    const passConfirmar = document.querySelector('#perfil-pass-confirmar').value;

    if (passActual === '' || passNueva === '' || passConfirmar === '') {
        mostrarMensaje('#msg-password', 'Todos los campos son obligatorios', 'error');
        return;
    }

    if (passNueva !== passConfirmar) {
        mostrarMensaje('#msg-password', 'Las contraseñas no coinciden', 'error');
        return;
    }

    if (passNueva.length < 6) {
        mostrarMensaje('#msg-password', 'La contraseña debe tener al menos 6 caracteres', 'error');
        return;
    }

    const response = await fetch('api/perfil.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'tipo=password&pass_actual=' + encodeURIComponent(passActual) +
            '&pass_nueva=' + encodeURIComponent(passNueva) +
            '&pass_confirmar=' + encodeURIComponent(passConfirmar)
    });

    const { success, error } = await response.json();

    if (success) {
        mostrarMensaje('#msg-password', '¡Contraseña cambiada correctamente!', 'exito');
        document.querySelector('#perfil-pass-actual').value = '';
        document.querySelector('#perfil-pass-nueva').value = '';
        document.querySelector('#perfil-pass-confirmar').value = '';
    } else {
        mostrarMensaje('#msg-password', error || 'Error al cambiar la contraseña', 'error');
    }
}

async function initPerfil() {
    // Cargamos datos del usuario
    const response = await fetch('api/perfil.php');
    const { success, datos } = await response.json();

    if (!success) return;

    avatarSeleccionado = datos.avatar || 'avatar_default.png';

    document.querySelector('#perfil-avatar-actual').src = 'assets/img/avatares/' + avatarSeleccionado;
    document.querySelector('#perfil-nombre').value = datos.nombre;
    document.querySelector('#perfil-email').value = datos.email;
    document.querySelector('.vista-titulo').textContent = '¡Hola, ' + datos.nombre.split(' ')[0] + '!';

    await cargarAvataresPerfil();

    // Escuchadores
    document.querySelector('#btn-guardar-avatar').addEventListener('click', function () {
        guardarAvatar();
    });

    document.querySelector('#btn-guardar-datos').addEventListener('click', function () {
        guardarDatos();
    });

    document.querySelector('#btn-guardar-password').addEventListener('click', function () {
        guardarPassword();
    });
}