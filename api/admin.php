<?php
// ****************************************************************************
// Panel de administración — solo accesible para administradores
// GET: foro/mensajes/ciudades/usuarios/badge/mascotas_usuario
// PUT: moderar foro | actualizar mensaje | añadir ciudad | resetear password
// ****************************************************************************
session_start();
require_once __DIR__ . '/../config/db.php';

// ***** VERIFICACIÓN DE ROL ADMINISTRADOR *****
if (!isset($_SESSION['usuario_id']) || $_SESSION['usuario_rol'] !== 'administrador') {
    enviarError(403, 'Acceso denegado');
}

$metodo = $_SERVER['REQUEST_METHOD'];
$id_admin = $_SESSION['usuario_id'];

// ***** GET *****
if ($metodo == 'GET') {
    $conn = obtenerConexion();
    $tipo = $_GET['tipo'] ?? 'foro';

    // -- Publicaciones pendientes del foro --
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

        // -- Mensajes de contacto --
    } elseif ($tipo == 'mensajes') {
        $filtro_estado = $_GET['estado'] ?? '';

        if ($filtro_estado !== '') {
            $sql = "SELECT id_mensaje, nombre, email, asunto, texto, fecha_envio, tipo, estado
                    FROM mensajes WHERE estado = ? ORDER BY fecha_envio DESC";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param('s', $filtro_estado);
            $stmt->execute();
            $resultado = $stmt->get_result();
        } else {
            $sql = "SELECT id_mensaje, nombre, email, asunto, texto, fecha_envio, tipo, estado
                    FROM mensajes ORDER BY fecha_envio DESC";
            $resultado = $conn->query($sql);
        }

        $mensajes = [];
        while ($fila = $resultado->fetch_assoc()) {
            $mensajes[] = $fila;
        }

        // Badge de mensajes pendientes
        $resPendientes = $conn->query("SELECT COUNT(*) AS total FROM mensajes WHERE estado = 'pendiente'");
        $totalPendientes = intval($resPendientes->fetch_assoc()['total']);

        enviarRespuesta($conn, [
            'success' => true,
            'datos' => $mensajes,
            'pendientes' => $totalPendientes
        ]);

        // -- Sugerencias de ciudades --
    } elseif ($tipo == 'ciudades') {
        $sql = "SELECT id_mensaje, nombre, email, asunto, texto, fecha_envio, estado
                FROM mensajes
                WHERE tipo = 'sugerencia_ciudad'
                ORDER BY fecha_envio DESC";

        $resultado = $conn->query($sql);
        $sugerencias = [];
        while ($fila = $resultado->fetch_assoc()) {
            $sugerencias[] = $fila;
        }

        enviarRespuesta($conn, ['success' => true, 'datos' => $sugerencias]);

        // -- Lista de usuarios --
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

        // -- Badge del navbar (mensajes + foro pendientes) --
    } elseif ($tipo == 'badge') {
        $totalMensajes = intval($conn->query("SELECT COUNT(*) AS total FROM mensajes WHERE estado = 'pendiente'")->fetch_assoc()['total']);
        $totalForo = intval($conn->query("SELECT COUNT(*) AS total FROM foro_consejos WHERE estado = 'pendiente'")->fetch_assoc()['total']);

        enviarRespuesta($conn, [
            'success' => true,
            'pendientes' => $totalMensajes + $totalForo,
            'mensajes' => $totalMensajes,
            'foro' => $totalForo
        ]);

        // -- Mascotas de un usuario concreto --
    } elseif ($tipo == 'mascotas_usuario') {
        $id_usuario_consulta = intval($_GET['id_usuario'] ?? 0);
        if ($id_usuario_consulta == 0) {
            enviarError(400, 'Falta el id del usuario');
        }

        $sql = "SELECT m.nombre, m.edad, m.sexo, m.foto, m.raza, e.nombre_especie
                FROM mascotas m
                JOIN especies e ON m.id_especie = e.id_especie
                WHERE m.id_usuario = ?
                ORDER BY m.nombre ASC";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('i', $id_usuario_consulta);
        $stmt->execute();
        $resultado = $stmt->get_result();

        $mascotas = [];
        while ($fila = $resultado->fetch_assoc()) {
            $mascotas[] = $fila;
        }
        $stmt->close();

        enviarRespuesta($conn, ['success' => true, 'datos' => $mascotas]);
    }

    // ***** PUT *****
} elseif ($metodo == 'PUT') {
    parse_str(file_get_contents('php://input'), $datos);
    $conn = obtenerConexion();
    $tipo = $datos['tipo'] ?? '';

    // -- Moderar publicación del foro --
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

        // -- Actualizar estado de un mensaje --
    } elseif ($tipo == 'mensaje') {
        $id_mensaje = intval($datos['id_mensaje']);
        $estado     = $datos['estado'];

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

        // -- Añadir ciudad con coordenadas automáticas --
    } elseif ($tipo == 'ciudad') {
        $nombre = trim($datos['nombre'] ?? '');
        $provincia = trim($datos['provincia'] ?? '');
        $latitud = floatval($datos['latitud'] ?? 0);
        $longitud = floatval($datos['longitud'] ?? 0);

        if ($nombre === '' || $provincia === '' || $latitud == 0 || $longitud == 0) {
            enviarError(400, 'Todos los campos son obligatorios', $conn);
        }

        // Comprobar si la ciudad ya existe en esa provincia
        $sql = "SELECT id_ciudad FROM ciudades WHERE nombre_ciudad = ? AND provincia = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('ss', $nombre, $provincia);
        $stmt->execute();
        if ($stmt->get_result()->num_rows > 0) {
            enviarError(400, 'Esa ciudad ya existe en esa provincia', $conn);
        }
        $stmt->close();

        // Comprobar coordenadas duplicadas con margen de ~1km
        $margen = 0.01;
        $sql = "SELECT nombre_ciudad FROM ciudades
                WHERE latitud BETWEEN ? AND ? AND longitud BETWEEN ? AND ?";
        $stmt = $conn->prepare($sql);
        $latMin = $latitud - $margen;
        $latMax = $latitud + $margen;
        $lonMin = $longitud - $margen;
        $lonMax = $longitud + $margen;
        $stmt->bind_param('dddd', $latMin, $latMax, $lonMin, $lonMax);
        $stmt->execute();
        $resultado = $stmt->get_result();
        if ($resultado->num_rows > 0) {
            $ciudadExistente = $resultado->fetch_assoc();
            enviarError(400, 'Las coordenadas ya corresponden a ' . $ciudadExistente['nombre_ciudad'], $conn);
        }
        $stmt->close();

        // Insertar nueva ciudad
        $sql = "INSERT INTO ciudades (nombre_ciudad, provincia, pais, latitud, longitud) VALUES (?, ?, 'España', ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('ssdd', $nombre, $provincia, $latitud, $longitud);

        if ($stmt->execute()) {
            enviarRespuesta($conn, ['success' => true]);
        } else {
            enviarError(500, 'Error al añadir la ciudad', $conn);
        }

        // -- Resetear contraseña de un usuario --
    } elseif ($tipo == 'resetear_password') {
        $id_usuario = intval($datos['id_usuario'] ?? 0);

        if ($id_usuario == 0) {
            enviarError(400, 'Falta el id del usuario', $conn);
        }

        // Generamos contraseña temporal de 10 caracteres
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