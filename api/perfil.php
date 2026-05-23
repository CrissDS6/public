<?php
session_start();
require_once __DIR__ . '/../config/db.php';

if (!isset($_SESSION['usuario_id'])) {
    enviarError(401, 'No autorizado');
}

$metodo = $_SERVER['REQUEST_METHOD'];
$id_usuario = $_SESSION['usuario_id'];

if ($metodo == 'GET') {
    $conn = obtenerConexion();

    $sql = "SELECT nombre, email, avatar FROM usuarios WHERE id_usuario = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $id_usuario);
    $stmt->execute();
    $usuario = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    enviarRespuesta($conn, ['success' => true, 'datos' => $usuario]);
} elseif ($metodo == 'POST') {
    parse_str(file_get_contents('php://input'), $datos);

    $tipo = $datos['tipo'] ?? '';

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
    } elseif ($tipo == 'password') {
        $passActual   = $datos['pass_actual'] ?? '';
        $passNueva    = $datos['pass_nueva'] ?? '';
        $passConfirmar = $datos['pass_confirmar'] ?? '';

        if ($passNueva !== $passConfirmar) {
            enviarError(400, 'Las contraseñas no coinciden');
        }

        if (strlen($passNueva) < 6) {
            enviarError(400, 'La contraseña debe tener al menos 6 caracteres');
        }

        $conn = obtenerConexion();

        // Verificamos la contraseña actual
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
} elseif ($metodo == 'DELETE') {
    $conn = obtenerConexion();

    // Eliminamos el usuario (el CASCADE borra mascotas, ciudades, likes y foro)
    $sql = "DELETE FROM usuarios WHERE id_usuario = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $id_usuario);

    if ($stmt->execute()) {
        // Destruimos la sesión
        session_unset();
        session_destroy();
        enviarRespuesta($conn, ['success' => true]);
    } else {
        enviarError(500, 'Error al eliminar la cuenta', $conn);
    }
}