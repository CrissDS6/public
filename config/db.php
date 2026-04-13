<?php
// config/db.php

function cargarEnv($ruta)
{
    if (!file_exists($ruta)) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error'   => 'Archivo de configuración no encontrado'
        ], JSON_UNESCAPED_UNICODE);
        exit();
    }

    $lineas = file($ruta, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

    foreach ($lineas as $linea) {
        // Ignorar comentarios
        if (strpos(trim($linea), '#') === 0) continue;

        // Separar clave=valor
        list($clave, $valor) = explode('=', $linea, 2);
        $_ENV[trim($clave)] = trim($valor);
    }
}

// Cargar el .env desde la raíz de public/
cargarEnv(__DIR__ . '/../.env');

$DB_HOST = $_ENV['DB_HOST'];
$DB_USER = $_ENV['DB_USER'];
$DB_PASS = $_ENV['DB_PASS'];
$DB_NAME = $_ENV['DB_NAME'];

function obtenerConexion()
{
    global $DB_HOST, $DB_USER, $DB_PASS, $DB_NAME;

    $conexion = mysqli_connect($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME);

    if (!$conexion) {
        enviarError(500, 'Error de conexión a la base de datos');
    }

    $conexion->set_charset('utf8mb4');
    return $conexion;
}

function enviarRespuesta($conexion, $datos, $codigo = 200)
{
    if ($conexion) $conexion->close();
    http_response_code($codigo);
    echo json_encode($datos, JSON_UNESCAPED_UNICODE);
    exit();
}

function enviarError($codigo, $mensaje, $conexion = null)
{
    if ($conexion) $conexion->close();
    http_response_code($codigo);
    echo json_encode([
        'success' => false,
        'error'   => $mensaje
    ], JSON_UNESCAPED_UNICODE);
    exit();
}