<?php
// auth/login_process.php
session_start();
require_once __DIR__ . "/../config/db.php";

// 1) Comprobar que vienen datos por POST
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Location: ../login.php");
    exit;
}

$email = trim($_POST["email"] ?? "");
$password = $_POST["password"] ?? "";

// 2) Validación mínima
if ($email === "" || $password === "") {
    header("Location: ../login.php?error=1");
    exit;
}

// 3) Buscar usuario por email
$sql = "SELECT id_usuario, nombre, email, password_hash, rol
        FROM usuarios
        WHERE email = :email
        LIMIT 1";
$stmt = $pdo->prepare($sql);
$stmt->execute([":email" => $email]);
$usuario = $stmt->fetch();

// 4) Comprobar contraseña (hash seguro)
if (!$usuario || !password_verify($password, $usuario["password_hash"])) {
    header("Location: ../login.php?error=1");
    exit;
}

// 5) Guardar sesión
$_SESSION["usuario_id"] = $usuario["id_usuario"];
$_SESSION["usuario_nombre"] = $usuario["nombre"];
$_SESSION["usuario_email"] = $usuario["email"];
$_SESSION["usuario_rol"] = $usuario["rol"];

// 6) Ir al dashboard
header("Location: ../dashboard.php");
exit;