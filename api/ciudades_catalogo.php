<?php
require_once __DIR__ . '/../config/db.php';

$conn = obtenerConexion();

$sql = "SELECT id_ciudad, nombre_ciudad, provincia FROM ciudades ORDER BY nombre_ciudad ASC";
$resultado = $conn->query($sql);

$ciudades = [];
while ($fila = $resultado->fetch_assoc()) {
    $ciudades[] = $fila;
}

enviarRespuesta($conn, ['success' => true, 'datos' => $ciudades]);