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

    // Si viene ?buscar=texto, buscamos en el catálogo
    if (isset($_GET['buscar'])) {
        $buscar = '%' . $_GET['buscar'] . '%';
        $sql = "SELECT c.id_ciudad, c.nombre_ciudad, c.provincia
                FROM ciudades c
                WHERE (c.nombre_ciudad LIKE ? OR c.provincia LIKE ?)
                AND c.id_ciudad NOT IN (
                    SELECT id_ciudad FROM ciudades_favoritas WHERE id_usuario = ?
                )
                ORDER BY c.nombre_ciudad ASC
                LIMIT 10";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('ssi', $buscar, $buscar, $id_usuario);
        $stmt->execute();
        $resultado = $stmt->get_result();

        $ciudades = [];
        while ($fila = $resultado->fetch_assoc()) {
            $ciudades[] = $fila;
        }
        $stmt->close();

        enviarRespuesta($conn, ['success' => true, 'datos' => $ciudades]);
    }

    // Si no, devolvemos las favoritas del usuario
    $sql = "SELECT cf.id_favorita, cf.principal, c.id_ciudad, c.nombre_ciudad, c.provincia
            FROM ciudades_favoritas cf
            JOIN ciudades c ON cf.id_ciudad = c.id_ciudad
            WHERE cf.id_usuario = ?
            ORDER BY cf.principal DESC, c.nombre_ciudad ASC";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $id_usuario);
    $stmt->execute();
    $resultado = $stmt->get_result();

    $favoritas = [];
    while ($fila = $resultado->fetch_assoc()) {
        $favoritas[] = $fila;
    }
    $stmt->close();

    enviarRespuesta($conn, ['success' => true, 'datos' => $favoritas]);
} elseif ($metodo == 'POST') {
    // Añadir ciudad favorita
    if (!isset($_POST['id_ciudad'])) {
        enviarError(400, 'Falta el id de la ciudad');
    }

    $id_ciudad = intval($_POST['id_ciudad']);
    $conn = obtenerConexion();

    // Comprobamos si ya es favorita
    $sql = "SELECT id_favorita FROM ciudades_favoritas WHERE id_usuario = ? AND id_ciudad = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ii', $id_usuario, $id_ciudad);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado->num_rows > 0) {
        enviarError(400, 'Esta ciudad ya está en tus favoritas', $conn);
    }
    $stmt->close();

    // Si no tiene ninguna favorita, la marcamos como principal
    $sql = "SELECT COUNT(*) AS total FROM ciudades_favoritas WHERE id_usuario = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $id_usuario);
    $stmt->execute();
    $total = $stmt->get_result()->fetch_assoc()['total'];
    $stmt->close();

    $principal = $total == 0 ? 1 : 0;

    $sql = "INSERT INTO ciudades_favoritas (id_usuario, id_ciudad, principal) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('iii', $id_usuario, $id_ciudad, $principal);

    if ($stmt->execute()) {
        enviarRespuesta($conn, ['success' => true]);
    } else {
        enviarError(500, 'Error al añadir la ciudad', $conn);
    }
} elseif ($metodo == 'PUT') {
    // Cambiar ciudad principal
    parse_str(file_get_contents('php://input'), $datos);

    if (!isset($datos['id_ciudad'])) {
        enviarError(400, 'Falta el id de la ciudad');
    }

    $id_ciudad = intval($datos['id_ciudad']);
    $conn = obtenerConexion();

    // Quitamos principal a todas
    $sql = "UPDATE ciudades_favoritas SET principal = 0 WHERE id_usuario = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $id_usuario);
    $stmt->execute();
    $stmt->close();

    // Ponemos principal a la seleccionada
    $sql = "UPDATE ciudades_favoritas SET principal = 1 WHERE id_usuario = ? AND id_ciudad = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ii', $id_usuario, $id_ciudad);

    if ($stmt->execute()) {
        enviarRespuesta($conn, ['success' => true]);
    } else {
        enviarError(500, 'Error al actualizar la ciudad principal', $conn);
    }
} elseif ($metodo == 'DELETE') {
    parse_str(file_get_contents('php://input'), $datos);

    if (!isset($datos['id_ciudad'])) {
        enviarError(400, 'Falta el id de la ciudad');
    }

    $id_ciudad = intval($datos['id_ciudad']);
    $conn = obtenerConexion();

    // No permitimos eliminar la ciudad principal si es la única
    $sql = "SELECT principal FROM ciudades_favoritas WHERE id_usuario = ? AND id_ciudad = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ii', $id_usuario, $id_ciudad);
    $stmt->execute();
    $fila = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if ($fila && $fila['principal'] == 1) {
        $sql = "SELECT COUNT(*) AS total FROM ciudades_favoritas WHERE id_usuario = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('i', $id_usuario);
        $stmt->execute();
        $total = $stmt->get_result()->fetch_assoc()['total'];
        $stmt->close();

        if ($total == 1) {
            enviarError(400, 'No puedes eliminar tu única ciudad favorita', $conn);
        }
    }

    $sql = "DELETE FROM ciudades_favoritas WHERE id_usuario = ? AND id_ciudad = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ii', $id_usuario, $id_ciudad);

    if ($stmt->execute()) {
        enviarRespuesta($conn, ['success' => true]);
    } else {
        enviarError(500, 'Error al eliminar la ciudad', $conn);
    }
}