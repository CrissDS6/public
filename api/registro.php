<?php
// ************************************************************
// Registra un nuevo usuario validando datos, hasheando la
// contraseña y asignando su ciudad principal
// ************************************************************
require_once __DIR__ . '/../config/db.php';

// ***** VALIDACIÓN DEL MÉTODO *****
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    enviarError(405, 'Método no permitido');
}

// ***** VALIDACIÓN DE PARÁMETROS *****
if (
    !isset($_POST['nombre']) || !isset($_POST['email']) ||
    !isset($_POST['password']) || !isset($_POST['id_ciudad'])
) {
    enviarError(400, 'Faltan parámetros obligatorios');
}

$nombre = trim($_POST['nombre']);
$email = trim($_POST['email']);
$password  = $_POST['password'];
$id_ciudad = intval($_POST['id_ciudad']);
$avatar = $_POST['avatar'] ?? 'avatar_default.png';

// ***** VALIDACIONES DE FORMATO *****
if (strlen($nombre) < 2) {
    enviarError(400, 'El nombre debe tener al menos 2 caracteres');
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    enviarError(400, 'El email no tiene un formato válido');
}
if (strlen($password) < 8) {
    enviarError(400, 'La contraseña debe tener al menos 8 caracteres');
}
if (!preg_match('/[A-Z]/', $password)) {
    enviarError(400, 'La contraseña debe contener al menos una mayúscula');
}
if (!preg_match('/[0-9]/', $password)) {
    enviarError(400, 'La contraseña debe contener al menos un número');
}
if (!preg_match('/[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]/', $password)) {
    enviarError(400, 'La contraseña debe contener al menos un carácter especial');
}

$conn = obtenerConexion();

// ***** COMPROBACIÓN DE EMAIL DUPLICADO *****
$sql = "SELECT id_usuario FROM usuarios WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('s', $email);
$stmt->execute();
$resultado = $stmt->get_result();
if ($resultado->num_rows > 0) {
    enviarError(400, 'Este email ya está registrado', $conn);
}
$stmt->close();

// ***** INSERCIÓN DEL USUARIO *****
$passwordHash = password_hash($password, PASSWORD_DEFAULT);

$sql = "INSERT INTO usuarios (nombre, email, password_hash, avatar) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param('ssss', $nombre, $email, $passwordHash, $avatar);
if (!$stmt->execute()) {
    enviarError(500, 'Error al crear la cuenta', $conn);
}
$id_usuario = $conn->insert_id;
$stmt->close();

// ***** CIUDAD PRINCIPAL *****
$sql = "INSERT INTO ciudades_favoritas (id_usuario, id_ciudad, principal) VALUES (?, ?, 1)";
$stmt = $conn->prepare($sql);
$stmt->bind_param('ii', $id_usuario, $id_ciudad);
$stmt->execute();
$stmt->close();

// ***** RESPUESTA *****
enviarRespuesta($conn, ['success' => true]);