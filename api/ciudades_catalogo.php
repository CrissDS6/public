<?php
// ************************************************************
// Catálogo público de ciudades — no requiere autenticación
// GET sin parámetros: devuelve provincias disponibles
// GET con ?provincia=X: devuelve ciudades de esa provincia
// ************************************************************
require_once __DIR__ . '/../config/db.php';

$conn = obtenerConexion();

// ***** CIUDADES POR PROVINCIA O LISTA DE PROVINCIAS *****
if (isset($_GET['provincia']) && $_GET['provincia'] !== '') {
    $provincia = $_GET['provincia'];
    $sql = "SELECT id_ciudad, nombre_ciudad, provincia
            FROM ciudades
            WHERE provincia = ?
            ORDER BY nombre_ciudad ASC";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('s', $provincia);
    $stmt->execute();
    $resultado = $stmt->get_result();
    $stmt->close();
} else {
    $resultado = $conn->query("SELECT DISTINCT provincia FROM ciudades ORDER BY provincia ASC");
}

$datos = [];
while ($fila = $resultado->fetch_assoc()) {
    $datos[] = $fila;
}

// ***** RESPUESTA *****
enviarRespuesta($conn, ['success' => true, 'datos' => $datos]);