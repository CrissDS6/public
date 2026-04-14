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

    $sql = "SELECT m.id_mascota, m.nombre, m.edad, m.sexo, m.foto, m.raza,
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

    enviarRespuesta($conn, [
        'success' => true,
        'datos'   => $mascotas
    ]);
} elseif ($metodo == 'POST') {
    if (!isset($_POST['nombre']) || !isset($_POST['id_especie']) || !isset($_POST['sexo'])) {
        enviarError(400, 'Faltan parámetros obligatorios');
    }

    $nombre     = $_POST['nombre'];
    $id_especie = $_POST['id_especie'];
    $sexo       = $_POST['sexo'];
    $raza       = $_POST['raza'] ?? null;
    $edad       = $_POST['edad'] ?? null;

    $conn = obtenerConexion();

    // Gestionar foto si viene
    $nombreFoto = null;
    if (isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK) {
        $extension  = strtolower(pathinfo($_FILES['foto']['name'], PATHINFO_EXTENSION));
        $nombreFoto = uniqid('mascota_') . '.' . $extension;
        $rutaDest   = __DIR__ . '/../uploads/mascotas/' . $nombreFoto;

        if (!move_uploaded_file($_FILES['foto']['tmp_name'], $rutaDest)) {
            enviarError(500, 'Error al guardar la imagen', $conn);
        }

        $nombreFoto = 'uploads/mascotas/' . $nombreFoto;
    }

    $sql = "INSERT INTO mascotas (id_usuario, id_especie, nombre, edad, sexo, foto, raza)
            VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('iisisss', $id_usuario, $id_especie, $nombre, $edad, $sexo, $nombreFoto, $raza);

    if ($stmt->execute()) {
        enviarRespuesta($conn, ['success' => true]);
    } else {
        enviarError(500, 'Error al guardar la mascota', $conn);
    }
} elseif ($metodo == 'DELETE') {
    parse_str(file_get_contents('php://input'), $datos);

    if (!isset($datos['id_mascota'])) {
        enviarError(400, 'Falta el id de la mascota');
    }

    $id_mascota = $datos['id_mascota'];
    $conn = obtenerConexion();

    // Verificamos que la mascota pertenece al usuario
    $sql = "SELECT foto FROM mascotas WHERE id_mascota = ? AND id_usuario = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ii', $id_mascota, $id_usuario);
    $stmt->execute();
    $resultado = $stmt->get_result();
    $mascota = $resultado->fetch_assoc();
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

    // Eliminamos de la bbdd
    $sql = "DELETE FROM mascotas WHERE id_mascota = ? AND id_usuario = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ii', $id_mascota, $id_usuario);

    if ($stmt->execute()) {
        enviarRespuesta($conn, ['success' => true]);
    } else {
        enviarError(500, 'Error al eliminar la mascota', $conn);
    }
} elseif ($metodo == 'PUT') {
    parse_str(file_get_contents('php://input'), $datos);

    if (!isset($datos['id_mascota']) || !isset($datos['nombre']) || !isset($datos['sexo'])) {
        enviarError(400, 'Faltan parámetros obligatorios');
    }

    $id_mascota = intval($datos['id_mascota']);
    $nombre     = $datos['nombre'];
    $id_especie = intval($datos['id_especie']);
    $raza       = isset($datos['raza']) && $datos['raza'] !== '' ? $datos['raza'] : null;
    $edad       = isset($datos['edad']) && $datos['edad'] !== '' ? intval($datos['edad']) : null;
    $sexo       = $datos['sexo'];

    $conn = obtenerConexion();

    // Verificamos que la mascota pertenece al usuario
    $sql = "SELECT id_mascota FROM mascotas WHERE id_mascota = ? AND id_usuario = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ii', $id_mascota, $id_usuario);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado->num_rows == 0) {
        enviarError(404, 'Mascota no encontrada', $conn);
    }
    $stmt->close();

    $sql = "UPDATE mascotas SET nombre = ?, id_especie = ?, raza = ?, edad = ?, sexo = ? WHERE id_mascota = ? AND id_usuario = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('sisssii', $nombre, $id_especie, $raza, $edad, $sexo, $id_mascota, $id_usuario);

    if ($stmt->execute()) {
        enviarRespuesta($conn, ['success' => true]);
    } else {
        enviarError(500, 'Error al actualizar la mascota', $conn);
    }
}