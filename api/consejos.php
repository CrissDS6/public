<?php
session_start();
require_once __DIR__ . '/../config/db.php';

if (!isset($_SESSION['usuario_id'])) {
    enviarError(401, 'No autorizado');
}

$id_usuario = $_SESSION['usuario_id'];
$conn = obtenerConexion();

// Obtenemos las especies del usuario con los nombres de sus mascotas
$sql = "SELECT e.id_especie, e.nombre_especie, GROUP_CONCAT(m.nombre ORDER BY m.nombre SEPARATOR ',') AS nombres
        FROM mascotas m
        JOIN especies e ON m.id_especie = e.id_especie
        WHERE m.id_usuario = ?
        GROUP BY e.id_especie, e.nombre_especie";

$stmt = $conn->prepare($sql);
$stmt->bind_param('i', $id_usuario);
$stmt->execute();
$resultado = $stmt->get_result();

$especies = [];
while ($fila = $resultado->fetch_assoc()) {
    $especies[] = $fila;
}
$stmt->close();

if (empty($especies)) {
    enviarRespuesta($conn, ['success' => true, 'especies' => [], 'consejos' => []]);
}

// Obtenemos el tipo_tiempo solicitado por GET
$tipo_tiempo = isset($_GET['tipo_tiempo']) ? $_GET['tipo_tiempo'] : 'calor';

// Tipos válidos según el ENUM de la tabla
$tipos_validos = ['calor', 'frio', 'lluvia', 'viento', 'nieve', 'tormenta', 'humedad', 'niebla', 'estable'];
if (!in_array($tipo_tiempo, $tipos_validos)) {
    $tipo_tiempo = 'calor';
}

// Obtenemos los consejos para cada especie del usuario
$consejos = [];
foreach ($especies as $especie) {
    $sql = "SELECT texto_consejo FROM consejos_especificos
            WHERE id_especie = ? AND tipo_tiempo = ?
            ORDER BY RAND()
            LIMIT 2";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('is', $especie['id_especie'], $tipo_tiempo);
    $stmt->execute();
    $resultado = $stmt->get_result();

    $textos = [];
    while ($fila = $resultado->fetch_assoc()) {
        $textos[] = $fila['texto_consejo'];
    }
    $stmt->close();

    $consejos[] = [
        'id_especie'    => $especie['id_especie'],
        'nombre_especie' => $especie['nombre_especie'],
        'nombres_mascotas' => $especie['nombres'],
        'textos'        => $textos
    ];
}

enviarRespuesta($conn, [
    'success'    => true,
    'tipo_tiempo' => $tipo_tiempo,
    'consejos'   => $consejos
]);