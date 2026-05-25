////////////////////////// VARIABLES //////////////////////////
let avatarSeleccionado = '';

////////////////////////// FUNCIONES //////////////////////////

///// Comprueba que la contraseña cumple los requisitos de seguridad /////
function validarPassword(password) {
    const errores = [];
    if (password.length < 8) errores.push('al menos 8 caracteres');
    if (!/[A-Z]/.test(password)) errores.push('una mayúscula');
    if (!/[0-9]/.test(password)) errores.push('un número');
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) errores.push('un carácter especial');
    return errores;
}

///// Muestra un mensaje de éxito o error bajo un campo del formulario y lo borra a los 3 segundos /////
function mostrarMensaje(idElemento, texto, tipo) {
    const el = document.querySelector(idElemento);
    el.textContent = texto;
    el.className = tipo == 'exito' ? 'msg-exito' : 'msg-error';
    setTimeout(function () {
        el.textContent = '';
        el.className = '';
    }, 3000);
}

///// Carga los avatares disponibles y los muestra en el selector del perfil /////
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

///// Guarda el avatar seleccionado y lo actualiza también en el navbar /////
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
        document.querySelector('#nav-avatar').src = 'assets/img/avatares/' + avatarSeleccionado;
    } else {
        mostrarMensaje('#msg-avatar', error || 'Error al actualizar el avatar', 'error');
    }
}

///// Guarda el nombre del usuario y lo actualiza también en el navbar /////
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
        document.querySelector('#btn-perfil').childNodes[0].textContent = nombre.split(' ')[0] + ' ';
    } else {
        mostrarMensaje('#msg-datos', error || 'Error al actualizar los datos', 'error');
    }
}

///// Valida y guarda la nueva contraseña del usuario /////
async function guardarPassword() {
    const passActual = document.querySelector('#perfil-pass-actual').value;
    const passNueva = document.querySelector('#perfil-pass-nueva').value;
    const passConfirmar = document.querySelector('#perfil-pass-confirmar').value;
    const erroresPass = validarPassword(passNueva);

    if (passActual === '' || passNueva === '' || passConfirmar === '') {
        mostrarMensaje('#msg-password', 'Todos los campos son obligatorios', 'error');
        return;
    }

    if (passNueva !== passConfirmar) {
        mostrarMensaje('#msg-password', 'Las contraseñas no coinciden', 'error');
        return;
    }

    if (erroresPass.length > 0) {
        mostrarMensaje('#msg-password', 'La contraseña debe tener ' + erroresPass.join(', '), 'error');
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

///// Carga los datos del usuario, rellena el formulario y registra los escuchadores /////
async function initPerfil() {
    const response = await fetch('api/perfil.php');
    const { success, datos } = await response.json();

    if (!success) return;

    avatarSeleccionado = datos.avatar || 'avatar_default.png';

    document.querySelector('#perfil-avatar-actual').src = 'assets/img/avatares/' + avatarSeleccionado;
    document.querySelector('#perfil-nombre').value = datos.nombre;
    document.querySelector('#perfil-email').value = datos.email;
    document.querySelector('.vista-titulo').textContent = '¡Hola, ' + datos.nombre.split(' ')[0] + '!';

    await cargarAvataresPerfil();

    ///// Guarda el avatar al pulsar el botón /////
    document.querySelector('#btn-guardar-avatar').addEventListener('click', function () {
        guardarAvatar();
    });

    ///// Guarda el nombre al pulsar el botón /////
    document.querySelector('#btn-guardar-datos').addEventListener('click', function () {
        guardarDatos();
    });

    ///// Cambia la contraseña al pulsar el botón /////
    document.querySelector('#btn-guardar-password').addEventListener('click', function () {
        guardarPassword();
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

    ///// Pide confirmación y elimina la cuenta del usuario al pulsar el botón /////
    document.querySelector('#btn-eliminar-cuenta').addEventListener('click', async function () {
        if (!confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) return;
        if (!confirm('¿Seguro seguro? Se borrarán todos tus datos, mascotas y publicaciones.')) return;

        const response = await fetch('api/perfil.php', {
            method: 'DELETE'
        });

        const { success, error } = await response.json();

        if (success) {
            window.location.href = 'index.html';
        } else {
            mostrarMensaje('#msg-password', error || 'Error al eliminar la cuenta', 'error');
        }
    });
}