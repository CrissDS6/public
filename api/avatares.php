<?php
// ************************************************************
// Devuelve la lista de avatares disponibles ordenados
// numéricamente — no requiere autenticación
// ************************************************************
require_once __DIR__ . '/../config/db.php';

$carpeta = __DIR__ . '/../assets/img/avatares/';
$avatares = [];

// ***** LECTURA DE ARCHIVOS DE AVATARES *****
$archivos = scandir($carpeta);
foreach ($archivos as $archivo) {
    if (preg_match('/^avatar\d+\.(png|jpg|jpeg|gif)$/i', $archivo)) {
        $avatares[] = $archivo;
    }
}

// ***** ORDENACIÓN NUMÉRICA *****
usort($avatares, function ($a, $b) {
    preg_match('/\d+/', $a, $numA);
    preg_match('/\d+/', $b, $numB);
    return intval($numA[0]) - intval($numB[0]);
});

// ***** RESPUESTA *****
enviarRespuesta(null, ['success' => true, 'avatares' => $avatares]);