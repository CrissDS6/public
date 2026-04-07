<?php
// config/db.php

define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'meteopet');

function obtenerConexion()
{
    $conexion = mysqli_connect(DB_HOST, DB_USER, DB_PASS, DB_NAME);

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
        'error' => $mensaje
    ], JSON_UNESCAPED_UNICODE);
    exit();
}
