<?php
// auth/login_process.php
session_start();
require_once __DIR__ . '/../config/db.php';

// 1) Solo aceptamos POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ../login.php');
    exit;
}

$email = trim($_POST['email'] ?? '');
$password = $_POST['password'] ?? '';

// 2) Validación mínima
if ($email === '' || $password === '') {
    header('Location: ../index.html?error=1');
    exit;
}

// 3) Buscar usuario por email
$conn = obtenerConexion();

$sql = "SELECT id_usuario, nombre, email, password_hash, rol FROM usuarios WHERE email = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('s', $email);
$stmt->execute();
$resultado = $stmt->get_result();
$usuario = $resultado->fetch_assoc();
$stmt->close();

// 4) Comprobar contraseña
if (!$usuario || !password_verify($password, $usuario['password_hash'])) {
    $conn->close();
    header('Location: ../index.html?error=1');
    exit;
}

$conn->close();

// 5) Guardar sesión
$_SESSION['usuario_id']     = $usuario['id_usuario'];
$_SESSION['usuario_nombre'] = $usuario['nombre'];
$_SESSION['usuario_email']  = $usuario['email'];
$_SESSION['usuario_rol']    = $usuario['rol'];

// 6) Redirigir al dashboard
header('Location: ../dashboard.php');
exit;
