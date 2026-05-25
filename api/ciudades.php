<?php
// ************************************************************
// Gestiona las ciudades favoritas del usuario autenticado
// GET: listar favoritas o buscar en catálogo | POST: añadir
// PUT: cambiar principal | DELETE: eliminar favorita
// ************************************************************
session_start();
require_once __DIR__ . '/../config/db.php';

// ***** VERIFICACIÓN DE SESIÓN *****
if (!isset($_SESSION['usuario_id'])) {
    enviarError(401, 'No autorizado');
}

$metodo = $_SERVER['REQUEST_METHOD'];
$id_usuario = $_SESSION['usuario_id'];

// ***** GET — BUSCAR EN CATÁLOGO O LISTAR FAVORITAS *****
if ($metodo == 'GET') {
    $conn = obtenerConexion();

    // Búsqueda en el catálogo general
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

    // Favoritas del usuario
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

    // ***** POST — AÑADIR CIUDAD FAVORITA *****
} elseif ($metodo == 'POST') {
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
    if ($stmt->get_result()->num_rows > 0) {
        enviarError(400, 'Esta ciudad ya está en tus favoritas', $conn);
    }
    $stmt->close();

    // Si no tiene ninguna favorita, la marcamos como principal automáticamente
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

    // ***** PUT — CAMBIAR CIUDAD PRINCIPAL *****
} elseif ($metodo == 'PUT') {
    parse_str(file_get_contents('php://input'), $datos);

    if (!isset($datos['id_ciudad'])) {
        enviarError(400, 'Falta el id de la ciudad');
    }

    $id_ciudad = intval($datos['id_ciudad']);
    $conn = obtenerConexion();

    // Quitamos principal a todas las ciudades del usuario
    $sql = "UPDATE ciudades_favoritas SET principal = 0 WHERE id_usuario = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $id_usuario);
    $stmt->execute();
    $stmt->close();

    // Marcamos la seleccionada como principal
    $sql = "UPDATE ciudades_favoritas SET principal = 1 WHERE id_usuario = ? AND id_ciudad = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ii', $id_usuario, $id_ciudad);

    if ($stmt->execute()) {
        enviarRespuesta($conn, ['success' => true]);
    } else {
        enviarError(500, 'Error al actualizar la ciudad principal', $conn);
    }

    // ***** DELETE — ELIMINAR CIUDAD FAVORITA *****
} elseif ($metodo == 'DELETE') {
    parse_str(file_get_contents('php://input'), $datos);

    if (!isset($datos['id_ciudad'])) {
        enviarError(400, 'Falta el id de la ciudad');
    }

    $id_ciudad = intval($datos['id_ciudad']);
    $conn = obtenerConexion();

    // Verificamos que no sea la ciudad principal
    $sql = "SELECT principal FROM ciudades_favoritas WHERE id_usuario = ? AND id_ciudad = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ii', $id_usuario, $id_ciudad);
    $stmt->execute();
    $ciudadFav = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if ($ciudadFav && $ciudadFav['principal'] == 1) {
        enviarError(400, 'No puedes eliminar la ciudad principal. Primero establece otra como principal.', $conn);
    }

    // Eliminamos la ciudad favorita
    $sql = "DELETE FROM ciudades_favoritas WHERE id_usuario = ? AND id_ciudad = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ii', $id_usuario, $id_ciudad);

    if ($stmt->execute()) {
        enviarRespuesta($conn, ['success' => true]);
    } else {
        enviarError(500, 'Error al eliminar la ciudad', $conn);
    }
}