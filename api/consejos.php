<?php
session_start();
require_once __DIR__ . '/../config/db.php';

if (!isset($_SESSION['usuario_id'])) {
    enviarError(401, 'No autorizado');
}

$id_usuario = $_SESSION['usuario_id'];
$conn = obtenerConexion();

// Obtenemos el tipo_tiempo solicitado por GET
$tipo_tiempo = isset($_GET['tipo_tiempo']) ? $_GET['tipo_tiempo'] : 'estable';

// Tipos válidos según el ENUM de la tabla
$tipos_validos = ['calor', 'frio', 'lluvia', 'viento', 'nieve', 'tormenta', 'humedad', 'niebla', 'estable'];
if (!in_array($tipo_tiempo, $tipos_validos)) {
    $tipo_tiempo = 'estable';
}

// Obtenemos las mascotas del usuario con su especie
$sql = "SELECT m.id_mascota, m.nombre, e.id_especie, e.nombre_especie
        FROM mascotas m
        JOIN especies e ON m.id_especie = e.id_especie
        WHERE m.id_usuario = ?
        ORDER BY m.nombre ASC";

$stmt = $conn->prepare($sql);
$stmt->bind_param('i', $id_usuario);
$stmt->execute();
$resultado = $stmt->get_result();

$mascotas = [];
while ($fila = $resultado->fetch_assoc()) {
    $mascotas[] = $fila;
}
$stmt->close();

if (empty($mascotas)) {
    enviarRespuesta($conn, ['success' => true, 'consejos' => []]);
}

// Para cada mascota obtenemos un consejo aleatorio de su especie
$consejos = [];
foreach ($mascotas as $mascota) {
    $sql = "SELECT texto_consejo FROM consejos_especificos
            WHERE id_especie = ? AND tipo_tiempo = ?
            ORDER BY RAND()";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('is', $mascota['id_especie'], $tipo_tiempo);
    $stmt->execute();
    $resultado = $stmt->get_result();

    $textos = [];
    while ($fila = $resultado->fetch_assoc()) {
        $textos[] = $fila['texto_consejo'];
    }
    $stmt->close();

    $consejos[] = [
        'nombre_mascota'  => $mascota['nombre'],
        'nombre_especie'  => $mascota['nombre_especie'],
        'textos'          => $textos
    ];
}

enviarRespuesta($conn, [
    'success'     => true,
    'tipo_tiempo' => $tipo_tiempo,
    'consejos'    => $consejos
]);