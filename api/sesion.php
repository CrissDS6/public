<?php
session_start();
require_once __DIR__ . '/../config/db.php';

if (!isset($_SESSION['usuario_id'])) {
    enviarError(401, 'No autorizado');
}

$id_usuario = $_SESSION['usuario_id'];
$conn = obtenerConexion();

// Buscamos la ciudad principal con sus coordenadas
$sql = "SELECT c.nombre_ciudad, c.latitud, c.longitud
        FROM ciudades_favoritas cf
        JOIN ciudades c ON cf.id_ciudad = c.id_ciudad
        WHERE cf.id_usuario = ? AND cf.principal = 1
        LIMIT 1";

$stmt = $conn->prepare($sql);
$stmt->bind_param('i', $id_usuario);
$stmt->execute();
$resultado = $stmt->get_result();
$ciudad = $resultado->fetch_assoc();
$stmt->close();

// Obtenemos el avatar del usuario
$sql = "SELECT avatar FROM usuarios WHERE id_usuario = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('i', $id_usuario);
$stmt->execute();
$usuario = $stmt->get_result()->fetch_assoc();
$stmt->close();
$nombreUsuario = $_SESSION['usuario_nombre'];
$primerNombre = explode(' ', $nombreUsuario)[0];

enviarRespuesta($conn, [
    'success'   => true,
    'nombre'    => $primerNombre,
    'avatar' => $usuario['avatar'] ?? 'avatar_default.png',
    'ciudad'    => $ciudad ? $ciudad['nombre_ciudad'] : null,
    'latitud'   => $ciudad ? $ciudad['latitud'] : null,
    'longitud'  => $ciudad ? $ciudad['longitud'] : null
]);