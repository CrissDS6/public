<?php
require_once __DIR__ . '/../config/db.php';

$conn = obtenerConexion();

// Si viene provincia, devolvemos ciudades de esa provincia
if (isset($_GET['provincia']) && $_GET['provincia'] !== '') {
    $provincia = $conn->real_escape_string($_GET['provincia']);
    $sql = "SELECT id_ciudad, nombre_ciudad, provincia 
            FROM ciudades 
            WHERE provincia = '$provincia'
            ORDER BY nombre_ciudad ASC";
} else {
    // Si no, devolvemos las provincias disponibles
    $sql = "SELECT DISTINCT provincia FROM ciudades ORDER BY provincia ASC";
}

$resultado = $conn->query($sql);
$datos = [];
while ($fila = $resultado->fetch_assoc()) {
    $datos[] = $fila;
}

enviarRespuesta($conn, ['success' => true, 'datos' => $datos]);