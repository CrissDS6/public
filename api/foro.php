<?php
// *************************************************************************
// Gestiona las publicaciones del foro autenticado
// GET: listar con filtros | POST: crear publicación | PUT: dar/quitar like
// *************************************************************************
session_start();
require_once __DIR__ . '/../config/db.php';

// ***** VERIFICACIÓN DE SESIÓN *****
if (!isset($_SESSION['usuario_id'])) {
    enviarError(401, 'No autorizado');
}

$metodo = $_SERVER['REQUEST_METHOD'];
$id_usuario = $_SESSION['usuario_id'];

// ***** GET — LISTAR PUBLICACIONES *****
if ($metodo == 'GET') {
    $conn = obtenerConexion();

    $filtro_especie   = isset($_GET['especie']) ? intval($_GET['especie']) : 0;
    $filtro_provincia = isset($_GET['provincia']) ? $conn->real_escape_string($_GET['provincia']) : '';
    $orden = isset($_GET['orden']) && $_GET['orden'] == 'likes' ? 'f.likes DESC' : 'f.fecha_envio DESC';

    // Construimos el WHERE dinámicamente
    $where = "WHERE f.estado = 'aprobado'";
    if ($filtro_especie > 0) $where .= " AND f.id_especie = $filtro_especie";
    if ($filtro_provincia !== '') $where .= " AND f.provincia = '$filtro_provincia'";

    $sql = "SELECT f.id_publicacion, f.titulo, f.contenido, f.ciudad, f.provincia,
                f.fecha_envio, f.likes, f.id_usuario,
                u.nombre AS nombre_usuario,
                u.avatar,
                e.nombre_especie,
                EXISTS(SELECT 1 FROM likes_foro lf WHERE lf.id_publicacion = f.id_publicacion AND lf.id_usuario = ?) AS usuario_dio_like
            FROM foro_consejos f
            JOIN usuarios u ON f.id_usuario = u.id_usuario
            JOIN especies e ON f.id_especie = e.id_especie $where
            ORDER BY $orden";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param('i', $id_usuario);
    $stmt->execute();
    $resultado = $stmt->get_result();

    $publicaciones = [];
    while ($fila = $resultado->fetch_assoc()) {
        $publicaciones[] = $fila;
    }
    $stmt->close();

    // Provincias disponibles para el selector de filtros
    $sqlProvincias = "SELECT DISTINCT provincia FROM foro_consejos
                    WHERE estado = 'aprobado' AND provincia IS NOT NULL AND provincia != ''
                    ORDER BY provincia ASC";
    $resProvincias = $conn->query($sqlProvincias);
    $provincias = [];
    while ($fila = $resProvincias->fetch_assoc()) {
        $provincias[] = $fila['provincia'];
    }

    enviarRespuesta($conn, [
        'success' => true,
        'datos' => $publicaciones,
        'provincias' => $provincias
    ]);

    // ***** POST — CREAR PUBLICACIÓN *****
} elseif ($metodo == 'POST') {
    if (!isset($_POST['titulo']) || !isset($_POST['contenido']) || !isset($_POST['id_especie'])) {
        enviarError(400, 'Faltan parámetros obligatorios');
    }

    $titulo = $_POST['titulo'];
    $contenido = $_POST['contenido'];
    $id_especie = intval($_POST['id_especie']);
    $ciudad = $_POST['ciudad'] ?? '';
    $provincia = $_POST['provincia'] ?? '';

    $conn = obtenerConexion();

    $sql = "INSERT INTO foro_consejos (id_usuario, id_especie, ciudad, provincia, titulo, contenido, estado)
            VALUES (?, ?, ?, ?, ?, ?, 'pendiente')";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('iissss', $id_usuario, $id_especie, $ciudad, $provincia, $titulo, $contenido);

    if ($stmt->execute()) {
        enviarRespuesta($conn, ['success' => true]);
    } else {
        enviarError(500, 'Error al publicar', $conn);
    }

    // ***** PUT — DAR/QUITAR LIKE *****
} elseif ($metodo == 'PUT') {
    parse_str(file_get_contents('php://input'), $datos);

    if (!isset($datos['id_publicacion'])) {
        enviarError(400, 'Falta el id de la publicacion');
    }

    $id_publicacion = intval($datos['id_publicacion']);
    $conn = obtenerConexion();

    // Comprobamos si ya dio like
    $sql = "SELECT id_like FROM likes_foro WHERE id_publicacion = ? AND id_usuario = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('ii', $id_publicacion, $id_usuario);
    $stmt->execute();
    $resultado = $stmt->get_result();

    if ($resultado->num_rows > 0) {
        // Ya dio like — lo quitamos
        $stmt->close();

        $sql = "DELETE FROM likes_foro WHERE id_publicacion = ? AND id_usuario = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('ii', $id_publicacion, $id_usuario);
        $stmt->execute();
        $stmt->close();

        $sql = "UPDATE foro_consejos SET likes = likes - 1 WHERE id_publicacion = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('i', $id_publicacion);
        $stmt->execute();
        $stmt->close();

        enviarRespuesta($conn, ['success' => true, 'accion' => 'unlike']);
    } else {
        // No dio like — lo añadimos
        $stmt->close();

        $sql = "INSERT INTO likes_foro (id_publicacion, id_usuario) VALUES (?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('ii', $id_publicacion, $id_usuario);
        $stmt->execute();
        $stmt->close();

        $sql = "UPDATE foro_consejos SET likes = likes + 1 WHERE id_publicacion = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('i', $id_publicacion);
        $stmt->execute();
        $stmt->close();

        enviarRespuesta($conn, ['success' => true, 'accion' => 'like']);
    }
}