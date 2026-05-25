<?php
// ************************************************************
// Devuelve publicaciones aprobadas del foro para usuarios
// no autenticados — sin likes ni datos de sesión
// ************************************************************
require_once __DIR__ . '/../config/db.php';

$conn = obtenerConexion();

// ***** FILTROS *****
$filtro_especie = isset($_GET['especie']) ? intval($_GET['especie']) : 0;
$filtro_provincia = isset($_GET['provincia']) ? $_GET['provincia'] : '';
$orden = isset($_GET['orden']) && $_GET['orden'] == 'likes' ? 'f.likes DESC' : 'f.fecha_envio DESC';

$where = "WHERE f.estado = 'aprobado'";
if ($filtro_especie > 0) $where .= " AND f.id_especie = " . intval($filtro_especie);
if ($filtro_provincia !== '') $where .= " AND f.provincia = '" . $conn->real_escape_string($filtro_provincia) . "'";

// ***** PUBLICACIONES *****
$sql = "SELECT f.id_publicacion, f.titulo, f.contenido, f.ciudad, f.provincia,
            f.fecha_envio, f.likes,
            u.nombre AS nombre_usuario,
            u.avatar,
            e.nombre_especie
        FROM foro_consejos f
        JOIN usuarios u ON f.id_usuario = u.id_usuario
        JOIN especies e ON f.id_especie = e.id_especie
        $where
        ORDER BY $orden";

$resultado = $conn->query($sql);
$publicaciones = [];
while ($fila = $resultado->fetch_assoc()) {
    $publicaciones[] = $fila;
}

// ***** PROVINCIAS DISPONIBLES PARA EL FILTRO *****
$resProvincias = $conn->query(
    "SELECT DISTINCT provincia FROM foro_consejos
    WHERE estado = 'aprobado' AND provincia IS NOT NULL AND provincia != ''
    ORDER BY provincia ASC"
);
$provincias = [];
while ($fila = $resProvincias->fetch_assoc()) {
    $provincias[] = $fila['provincia'];
}

// ***** RESPUESTA *****
enviarRespuesta($conn, [
    'success' => true,
    'datos' => $publicaciones,
    'provincias' => $provincias
]);