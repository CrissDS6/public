<?php
// ************************************************************
// Gestiona los datos del perfil del usuario autenticado:
// GET: obtener datos 
// POST: actualizar avatar, datos o password 
// DELETE: eliminar cuenta
// ************************************************************
session_start();
require_once __DIR__ . '/../config/db.php';

//  ***** VERIFICACIÓN DE SESIÓN  *****
if (!isset($_SESSION['usuario_id'])) {
    enviarError(401, 'No autorizado');
}

$metodo = $_SERVER['REQUEST_METHOD'];
$id_usuario = $_SESSION['usuario_id'];

//  ***** GET — OBTENER DATOS DEL PERFIL  *****
if ($metodo == 'GET') {
    $conn = obtenerConexion();

    $sql = "SELECT nombre, email, avatar FROM usuarios WHERE id_usuario = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $id_usuario);
    $stmt->execute();
    $usuario = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    enviarRespuesta($conn, ['success' => true, 'datos' => $usuario]);

    //  ***** POST — ACTUALIZAR PERFIL    *****
} elseif ($metodo == 'POST') {
    parse_str(file_get_contents('php://input'), $datos);
    $tipo = $datos['tipo'] ?? '';

    // -- Avatar --
    if ($tipo == 'avatar') {
        $avatar = $datos['avatar'] ?? 'avatar_default.png';
        $conn = obtenerConexion();

        $sql = "UPDATE usuarios SET avatar = ? WHERE id_usuario = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('si', $avatar, $id_usuario);

        if ($stmt->execute()) {
            $_SESSION['usuario_avatar'] = $avatar;
            enviarRespuesta($conn, ['success' => true]);
        } else {
            enviarError(500, 'Error al actualizar el avatar', $conn);
        }

        // -- Datos personales --
    } elseif ($tipo == 'datos') {
        $nombre = trim($datos['nombre'] ?? '');

        if (strlen($nombre) < 2) {
            enviarError(400, 'El nombre debe tener al menos 2 caracteres');
        }

        $conn = obtenerConexion();

        $sql = "UPDATE usuarios SET nombre = ? WHERE id_usuario = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('si', $nombre, $id_usuario);

        if ($stmt->execute()) {
            $_SESSION['usuario_nombre'] = $nombre;
            enviarRespuesta($conn, ['success' => true]);
        } else {
            enviarError(500, 'Error al actualizar los datos', $conn);
        }

        // -- Contraseña --
    } elseif ($tipo == 'password') {
        $passActual = $datos['pass_actual'] ?? '';
        $passNueva = $datos['pass_nueva'] ?? '';
        $passConfirmar = $datos['pass_confirmar'] ?? '';

        if ($passNueva !== $passConfirmar) {
            enviarError(400, 'Las contraseñas no coinciden');
        }

        if (strlen($passNueva) < 8) {
            enviarError(400, 'La contraseña debe tener al menos 8 caracteres');
        }

        $conn = obtenerConexion();

        $sql = "SELECT password_hash FROM usuarios WHERE id_usuario = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('i', $id_usuario);
        $stmt->execute();
        $usuario = $stmt->get_result()->fetch_assoc();
        $stmt->close();

        if (!password_verify($passActual, $usuario['password_hash'])) {
            enviarError(400, 'La contraseña actual no es correcta', $conn);
        }

        $nuevoHash = password_hash($passNueva, PASSWORD_DEFAULT);

        $sql = "UPDATE usuarios SET password_hash = ? WHERE id_usuario = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('si', $nuevoHash, $id_usuario);

        if ($stmt->execute()) {
            enviarRespuesta($conn, ['success' => true]);
        } else {
            enviarError(500, 'Error al cambiar la contraseña', $conn);
        }
    }

    //  ***** DELETE — ELIMINAR CUENTA    *****
} elseif ($metodo == 'DELETE') {
    $conn = obtenerConexion();

    // El CASCADE de la BD borra mascotas, ciudades, likes y publicaciones
    $sql = "DELETE FROM usuarios WHERE id_usuario = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $id_usuario);

    if ($stmt->execute()) {
        session_unset();
        session_destroy();
        enviarRespuesta($conn, ['success' => true]);
    } else {
        enviarError(500, 'Error al eliminar la cuenta', $conn);
    }
}