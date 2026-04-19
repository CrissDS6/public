<?php
require_once __DIR__ . '/../config/db.php';

$conn = obtenerConexion();

$sql = "SELECT f.id_publicacion, f.titulo, f.contenido, f.ciudad, f.provincia,
            f.fecha_envio, f.likes,
            u.nombre AS nombre_usuario,
            u.avatar,
            e.nombre_especie
        FROM foro_consejos f
        JOIN usuarios u ON f.id_usuario = u.id_usuario
        JOIN especies e ON f.id_especie = e.id_especie
        WHERE f.estado = 'aprobado'
        ORDER BY f.likes DESC
        LIMIT 5";

$resultado = $conn->query($sql);

$publicaciones = [];
while ($fila = $resultado->fetch_assoc()) {
    $publicaciones[] = $fila;
}

enviarRespuesta($conn, ['success' => true, 'datos' => $publicaciones]);