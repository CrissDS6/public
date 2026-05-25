<?php
// *************************************************************
// Procesa el formulario de login y crea la sesión del usuario
// *************************************************************
session_start();
require_once __DIR__ . '/../config/db.php';

// ***** VALIDACIÓN DEL MÉTODO *****
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ../index.html');
    exit;
}

$email    = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';

if ($email === '' || $password === '') {
    header('Location: ../index.html?error=1');
    exit;
}

// ***** BÚSQUEDA DEL USUARIO *****
$conn = obtenerConexion();

$sql  = "SELECT id_usuario, nombre, email, password_hash, rol FROM usuarios WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('s', $email);
$stmt->execute();
$resultado = $stmt->get_result();
$usuario   = $resultado->fetch_assoc();
$stmt->close();

// ***** VERIFICACIÓN DE CONTRASEÑA *****
if (!$usuario || !password_verify($password, $usuario['password_hash'])) {
    $conn->close();
    header('Location: ../index.html?error=1');
    exit;
}

$conn->close();

// ***** CREACIÓN DE SESIÓN *****
$_SESSION['usuario_id']     = $usuario['id_usuario'];
$_SESSION['usuario_nombre'] = $usuario['nombre'];
$_SESSION['usuario_email']  = $usuario['email'];
$_SESSION['usuario_rol']    = $usuario['rol'];

// ***** REDIRECCIÓN AL DASHBOARD *****
header('Location: ../dashboard.php');
exit;