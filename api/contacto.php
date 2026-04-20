<?php
require_once __DIR__ . '/../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    enviarError(405, 'Método no permitido');
}

$nombre  = trim($_POST['nombre'] ?? '');
$email   = trim($_POST['email'] ?? '');
$tipo    = $_POST['tipo'] ?? 'otro';
$asunto  = trim($_POST['asunto'] ?? '');
$texto   = trim($_POST['texto'] ?? '');

if ($nombre === '' || $email === '' || $asunto === '' || $texto === '') {
    enviarError(400, 'Todos los campos son obligatorios');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    enviarError(400, 'El email no tiene un formato válido');
}

$tipos_validos = ['consulta', 'problema', 'sugerencia_ciudad', 'otro'];
if (!in_array($tipo, $tipos_validos)) {
    $tipo = 'otro';
}

session_start();
$id_usuario = isset($_SESSION['usuario_id']) ? $_SESSION['usuario_id'] : null;

$conn = obtenerConexion();

$sql = "INSERT INTO mensajes (id_usuario, nombre, email, asunto, texto, tipo) VALUES (?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param('isssss', $id_usuario, $nombre, $email, $asunto, $texto, $tipo);

if ($stmt->execute()) {
    enviarRespuesta($conn, ['success' => true]);
} else {
    enviarError(500, 'Error al enviar el mensaje', $conn);
}