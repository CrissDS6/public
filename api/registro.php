<?php
require_once __DIR__ . '/../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    enviarError(405, 'Método no permitido');
}

// Validaciones
if (
    !isset($_POST['nombre']) || !isset($_POST['email']) ||
    !isset($_POST['password']) || !isset($_POST['id_ciudad'])
) {
    enviarError(400, 'Faltan parámetros obligatorios');
}

$nombre    = trim($_POST['nombre']);
$email     = trim($_POST['email']);
$password  = $_POST['password'];
$id_ciudad = intval($_POST['id_ciudad']);
$avatar    = $_POST['avatar'] ?? 'avatar_default.png';

// Validaciones básicas
if (strlen($nombre) < 2) {
    enviarError(400, 'El nombre debe tener al menos 2 caracteres');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    enviarError(400, 'El email no tiene un formato válido');
}

if (strlen($password) < 6) {
    enviarError(400, 'La contraseña debe tener al menos 6 caracteres');
}

$conn = obtenerConexion();

// Comprobar si el email ya existe
$sql = "SELECT id_usuario FROM usuarios WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('s', $email);
$stmt->execute();
$resultado = $stmt->get_result();

if ($resultado->num_rows > 0) {
    enviarError(400, 'Este email ya está registrado', $conn);
}
$stmt->close();

// Hash de la contraseña
$passwordHash = password_hash($password, PASSWORD_DEFAULT);

// Insertar usuario
$sql = "INSERT INTO usuarios (nombre, email, password_hash, avatar) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param('ssss', $nombre, $email, $passwordHash, $avatar);

if (!$stmt->execute()) {
    enviarError(500, 'Error al crear la cuenta', $conn);
}

$id_usuario = $conn->insert_id;
$stmt->close();

// Añadir ciudad principal
$sql = "INSERT INTO ciudades_favoritas (id_usuario, id_ciudad, principal) VALUES (?, ?, 1)";
$stmt = $conn->prepare($sql);
$stmt->bind_param('ii', $id_usuario, $id_ciudad);
$stmt->execute();
$stmt->close();

enviarRespuesta($conn, ['success' => true]);