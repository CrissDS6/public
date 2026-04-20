<?php
session_start();
require_once __DIR__ . '/../config/db.php';

if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_rol'] !== 'administrador') {
    enviarError(403, 'Acceso denegado');
}

$metodo = $_SERVER['REQUEST_METHOD'];
$id_admin = $_SESSION['usuario_id'];

if ($metodo == 'GET') {
    $conn = obtenerConexion();
    $tipo = $_GET['tipo'] ?? 'foro';

    if ($tipo == 'foro') {
        $sql = "SELECT f.id_publicacion, f.titulo, f.contenido, f.ciudad, f.provincia,
                    f.fecha_envio, f.estado,
                    u.nombre AS nombre_usuario,
                    e.nombre_especie
                FROM foro_consejos f
                JOIN usuarios u ON f.id_usuario = u.id_usuario
                JOIN especies e ON f.id_especie = e.id_especie
                WHERE f.estado = 'pendiente'
                ORDER BY f.fecha_envio ASC";

        $resultado = $conn->query($sql);
        $publicaciones = [];
        while ($fila = $resultado->fetch_assoc()) {
            $publicaciones[] = $fila;
        }

        enviarRespuesta($conn, ['success' => true, 'datos' => $publicaciones]);
    } elseif ($tipo == 'mensajes') {
        $sql = "SELECT m.id_mensaje, m.nombre, m.email, m.asunto, m.texto,
                    m.fecha_envio, m.tipo, m.estado
                FROM mensajes m
                ORDER BY m.fecha_envio DESC";

        $resultado = $conn->query($sql);
        $mensajes = [];
        while ($fila = $resultado->fetch_assoc()) {
            $mensajes[] = $fila;
        }

        enviarRespuesta($conn, ['success' => true, 'datos' => $mensajes]);
    } elseif ($tipo == 'ciudades') {
        // Mensajes de tipo sugerencia_ciudad
        $sql = "SELECT m.id_mensaje, m.nombre, m.email, m.asunto, m.texto, m.fecha_envio, m.estado
            FROM mensajes m
            WHERE m.tipo = 'sugerencia_ciudad'
            ORDER BY m.fecha_envio DESC";

        $resultado = $conn->query($sql);
        $sugerencias = [];
        while ($fila = $resultado->fetch_assoc()) {
            $sugerencias[] = $fila;
        }

        enviarRespuesta($conn, ['success' => true, 'datos' => $sugerencias]);
    } elseif ($tipo == 'usuarios') {
        $sql = "SELECT id_usuario, nombre, email, avatar, fecha_registro, rol
            FROM usuarios
            ORDER BY fecha_registro DESC";

        $resultado = $conn->query($sql);
        $usuarios = [];
        while ($fila = $resultado->fetch_assoc()) {
            $usuarios[] = $fila;
        }

        enviarRespuesta($conn, ['success' => true, 'datos' => $usuarios]);
    }
} elseif ($metodo == 'PUT') {
    parse_str(file_get_contents('php://input'), $datos);
    $conn = obtenerConexion();
    $tipo = $datos['tipo'] ?? '';

    if ($tipo == 'foro') {
        $id_publicacion = intval($datos['id_publicacion']);
        $estado = $datos['estado'];

        if (!in_array($estado, ['aprobado', 'rechazado'])) {
            enviarError(400, 'Estado no válido', $conn);
        }

        $fecha_revision = date('Y-m-d H:i:s');
        $sql = "UPDATE foro_consejos SET estado = ?, id_admin = ?, fecha_revision = ? WHERE id_publicacion = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('sisi', $estado, $id_admin, $fecha_revision, $id_publicacion);

        if ($stmt->execute()) {
            enviarRespuesta($conn, ['success' => true]);
        } else {
            enviarError(500, 'Error al actualizar', $conn);
        }
    } elseif ($tipo == 'mensaje') {
        $id_mensaje = intval($datos['id_mensaje']);
        $estado = $datos['estado'];

        if (!in_array($estado, ['pendiente', 'en_proceso', 'resuelto'])) {
            enviarError(400, 'Estado no válido', $conn);
        }

        $sql = "UPDATE mensajes SET estado = ? WHERE id_mensaje = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('si', $estado, $id_mensaje);

        if ($stmt->execute()) {
            enviarRespuesta($conn, ['success' => true]);
        } else {
            enviarError(500, 'Error al actualizar', $conn);
        }
    } elseif ($tipo == 'ciudad') {
        $nombre    = trim($datos['nombre'] ?? '');
        $provincia = trim($datos['provincia'] ?? '');
        $latitud   = floatval($datos['latitud'] ?? 0);
        $longitud  = floatval($datos['longitud'] ?? 0);

        // Validar campos obligatorios
        if ($nombre === '' || $provincia === '' || $latitud == 0 || $longitud == 0) {
            enviarError(400, 'Todos los campos son obligatorios', $conn);
        }

        // Comprobar si la ciudad ya existe en esa provincia
        $sql = "SELECT id_ciudad FROM ciudades WHERE nombre_ciudad = ? AND provincia = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('ss', $nombre, $provincia);
        $stmt->execute();
        $resultado = $stmt->get_result();
        if ($resultado->num_rows > 0) {
            enviarError(400, 'Esa ciudad ya existe en esa provincia', $conn);
        }
        $stmt->close();

        // Comprobar si las coordenadas ya están usadas
        $margen = 0.01; // margen de ~1km
        $latMin = $latitud - $margen;
        $latMax = $latitud + $margen;
        $lonMin = $longitud - $margen;
        $lonMax = $longitud + $margen;

        $sql = "SELECT nombre_ciudad FROM ciudades 
            WHERE latitud BETWEEN ? AND ? AND longitud BETWEEN ? AND ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('dddd', $latMin, $latMax, $lonMin, $lonMax);
        $stmt->execute();
        $resultado = $stmt->get_result();
        if ($resultado->num_rows > 0) {
            $ciudadExistente = $resultado->fetch_assoc();
            enviarError(400, 'Las coordenadas ya corresponden a ' . $ciudadExistente['nombre_ciudad'], $conn);
        }
        $stmt->close();

        // Insertar
        $sql = "INSERT INTO ciudades (nombre_ciudad, provincia, pais, latitud, longitud) VALUES (?, ?, 'España', ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('ssdd', $nombre, $provincia, $latitud, $longitud);

        if ($stmt->execute()) {
            enviarRespuesta($conn, ['success' => true]);
        } else {
            enviarError(500, 'Error al añadir la ciudad', $conn);
        }
    } elseif ($tipo == 'resetear_password') {
        $id_usuario = intval($datos['id_usuario'] ?? 0);

        if ($id_usuario == 0) {
            enviarError(400, 'Falta el id del usuario', $conn);
        }

        // Generamos contraseña temporal
        $caracteres = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$';
        $passTemp = '';
        for ($i = 0; $i < 10; $i++) {
            $passTemp .= $caracteres[random_int(0, strlen($caracteres) - 1)];
        }

        $hash = password_hash($passTemp, PASSWORD_DEFAULT);

        $sql = "UPDATE usuarios SET password_hash = ? WHERE id_usuario = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('si', $hash, $id_usuario);

        if ($stmt->execute()) {
            enviarRespuesta($conn, ['success' => true, 'password_temp' => $passTemp]);
        } else {
            enviarError(500, 'Error al resetear la contraseña', $conn);
        }
    }
}