<?php
// ************************************************************
// Devuelve los datos de sesión del usuario autenticado:
// nombre, email, avatar y ciudad principal con coordenadas
// ************************************************************
session_start();
require_once __DIR__ . '/../config/db.php';

// ***** VERIFICACIÓN DE SESIÓN *****
if (!isset($_SESSION['usuario_id'])) {
    enviarError(401, 'No autorizado');
}

$id_usuario = $_SESSION['usuario_id'];
$conn = obtenerConexion();

// ***** CIUDAD PRINCIPAL *****
$sql = "SELECT c.nombre_ciudad, c.latitud, c.longitud
        FROM ciudades_favoritas cf
        JOIN ciudades c ON cf.id_ciudad = c.id_ciudad
        WHERE cf.id_usuario = ? AND cf.principal = 1
        LIMIT 1";

$stmt = $conn->prepare($sql);
$stmt->bind_param('i', $id_usuario);
$stmt->execute();
$ciudad = $stmt->get_result()->fetch_assoc();
$stmt->close();

// ***** AVATAR DEL USUARIO *****
$sql = "SELECT avatar FROM usuarios WHERE id_usuario = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('i', $id_usuario);
$stmt->execute();
$usuario = $stmt->get_result()->fetch_assoc();
$stmt->close();

$primerNombre = explode(' ', $_SESSION['usuario_nombre'])[0];

// ***** RESPUESTA *****
enviarRespuesta($conn, [
    'success'  => true,
    'nombre'   => $primerNombre,
    'email'    => $_SESSION['usuario_email'],
    'avatar'   => $usuario['avatar'] ?? 'avatar_default.png',
    'ciudad'   => $ciudad ? $ciudad['nombre_ciudad'] : null,
    'latitud'  => $ciudad ? $ciudad['latitud'] : null,
    'longitud' => $ciudad ? $ciudad['longitud'] : null
]);