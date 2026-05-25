<?php
// ************************************************************************
// CRUD completo de mascotas del usuario autenticado
// GET: listar  POST: crear | POST+_method=PUT: editar | DELETE: eliminar
// ************************************************************************
session_start();
require_once __DIR__ . '/../config/db.php';

// ***** VERIFICACIÓN DE SESIÓN *****
if (!isset($_SESSION['usuario_id'])) {
    enviarError(401, 'No autorizado');
}

$metodo = $_SERVER['REQUEST_METHOD'];
$id_usuario = $_SESSION['usuario_id'];

// ***** FUNCIÓN AUXILIAR — SUBIDA DE FOTO *****
function subirFotoMascota($conn)
{
    if (!isset($_FILES['foto']) || $_FILES['foto']['error'] !== UPLOAD_ERR_OK) {
        return null;
    }

    $extension = strtolower(pathinfo($_FILES['foto']['name'], PATHINFO_EXTENSION));
    $extensionesPermitidas = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

    if (!in_array($extension, $extensionesPermitidas)) {
        enviarError(400, 'Formato de imagen no permitido. Usa JPG, PNG, GIF o WEBP', $conn);
    }

    $nombreFoto = uniqid('mascota_') . '.' . $extension;
    $rutaDest   = __DIR__ . '/../uploads/mascotas/' . $nombreFoto;

    if (!move_uploaded_file($_FILES['foto']['tmp_name'], $rutaDest)) {
        enviarError(500, 'Error al guardar la imagen', $conn);
    }

    return 'uploads/mascotas/' . $nombreFoto;
}

// ***** GET — LISTAR MASCOTAS *****
if ($metodo == 'GET') {
    $conn = obtenerConexion();

    $sql = "SELECT m.id_mascota, m.nombre, m.edad, m.sexo, m.foto, m.raza, m.id_especie,
                e.nombre_especie
            FROM mascotas m
            JOIN especies e ON m.id_especie = e.id_especie
            WHERE m.id_usuario = ?
            ORDER BY m.nombre ASC";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $id_usuario);
    $stmt->execute();
    $resultado = $stmt->get_result();

    $mascotas = [];
    while ($fila = $resultado->fetch_assoc()) {
        $mascotas[] = $fila;
    }
    $stmt->close();

    enviarRespuesta($conn, ['success' => true, 'datos' => $mascotas]);

    // ***** POST — CREAR MASCOTA *****
} elseif ($metodo == 'POST' && (!isset($_POST['_method']) || $_POST['_method'] !== 'PUT')) {
    if (!isset($_POST['nombre']) || !isset($_POST['id_especie']) || !isset($_POST['sexo'])) {
        enviarError(400, 'Faltan parámetros obligatorios');
    }

    $nombre = $_POST['nombre'];
    $id_especie = intval($_POST['id_especie']);
    $sexo = $_POST['sexo'];
    $raza = isset($_POST['raza']) && $_POST['raza'] !== '' ? $_POST['raza'] : null;
    $edad = isset($_POST['edad']) && $_POST['edad'] !== '' ? intval($_POST['edad']) : null;

    $conn = obtenerConexion();
    $nombreFoto = subirFotoMascota($conn);

    $sql = "INSERT INTO mascotas (id_usuario, id_especie, nombre, edad, sexo, foto, raza)
            VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('iisisss', $id_usuario, $id_especie, $nombre, $edad, $sexo, $nombreFoto, $raza);

    if ($stmt->execute()) {
        enviarRespuesta($conn, ['success' => true]);
    } else {
        enviarError(500, 'Error al guardar la mascota', $conn);
    }

    // ***** POST+_method=PUT — EDITAR MASCOTA *****
} elseif ($metodo == 'POST' && isset($_POST['_method']) && $_POST['_method'] == 'PUT') {
    if (!isset($_POST['id_mascota']) || !isset($_POST['nombre']) || !isset($_POST['sexo'])) {
        enviarError(400, 'Faltan parámetros obligatorios');
    }

    $id_mascota = intval($_POST['id_mascota']);
    $nombre = $_POST['nombre'];
    $id_especie = intval($_POST['id_especie']);
    $raza = isset($_POST['raza']) && $_POST['raza'] !== '' ? $_POST['raza'] : null;
    $edad = isset($_POST['edad']) && $_POST['edad'] !== '' ? intval($_POST['edad']) : null;
    $sexo = $_POST['sexo'];

    $conn = obtenerConexion();

    // Verificamos que la mascota pertenece al usuario
    $sql = "SELECT foto FROM mascotas WHERE id_mascota = ? AND id_usuario = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ii', $id_mascota, $id_usuario);
    $stmt->execute();
    $mascotaActual = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$mascotaActual) {
        enviarError(404, 'Mascota no encontrada', $conn);
    }

    // Usamos la foto nueva si viene, si no mantenemos la actual
    $nombreFoto = subirFotoMascota($conn) ?? $mascotaActual['foto'];

    $sql = "UPDATE mascotas SET nombre = ?, id_especie = ?, raza = ?, edad = ?, sexo = ?, foto = ?
            WHERE id_mascota = ? AND id_usuario = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('sissssii', $nombre, $id_especie, $raza, $edad, $sexo, $nombreFoto, $id_mascota, $id_usuario);

    if ($stmt->execute()) {
        enviarRespuesta($conn, ['success' => true]);
    } else {
        enviarError(500, 'Error al actualizar la mascota', $conn);
    }

    // ***** DELETE — ELIMINAR MASCOTA *****
} elseif ($metodo == 'DELETE') {
    parse_str(file_get_contents('php://input'), $datos);

    if (!isset($datos['id_mascota'])) {
        enviarError(400, 'Falta el id de la mascota');
    }

    $id_mascota = intval($datos['id_mascota']);
    $conn = obtenerConexion();

    // Verificamos que la mascota pertenece al usuario
    $sql = "SELECT foto FROM mascotas WHERE id_mascota = ? AND id_usuario = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ii', $id_mascota, $id_usuario);
    $stmt->execute();
    $mascota = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$mascota) {
        enviarError(404, 'Mascota no encontrada', $conn);
    }

    // Eliminamos la foto del servidor si existe
    if ($mascota['foto']) {
        $rutaFoto = __DIR__ . '/../' . $mascota['foto'];
        if (file_exists($rutaFoto)) {
            unlink($rutaFoto);
        }
    }

    // Eliminamos de la base de datos
    $sql = "DELETE FROM mascotas WHERE id_mascota = ? AND id_usuario = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ii', $id_mascota, $id_usuario);

    if ($stmt->execute()) {
        enviarRespuesta($conn, ['success' => true]);
    } else {
        enviarError(500, 'Error al eliminar la mascota', $conn);
    }
}