<?php
session_start();
require_once __DIR__ . '/../config/db.php';

if (!isset($_SESSION['usuario_id'])) {
    enviarError(401, 'No autorizado');
}

$metodo = $_SERVER['REQUEST_METHOD'];
$id_usuario = $_SESSION['usuario_id'];

if ($metodo == 'GET') {
    $conn = obtenerConexion();

    $sql = "SELECT m.id_mascota, m.nombre, m.edad, m.sexo, m.foto, m.raza,
                e.nombre_especie
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

    enviarRespuesta($conn, [
        'success' => true,
        'datos'   => $mascotas
    ]);
}
