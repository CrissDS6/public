<?php
require_once __DIR__ . '/../config/db.php';

$carpeta = __DIR__ . '/../assets/img/avatares/';
$avatares = [];

$archivos = scandir($carpeta);
foreach ($archivos as $archivo) {
    // Solo imágenes que empiecen por "avatar" y no sean el default
    if (preg_match('/^avatar\d+\.(png|jpg|jpeg|gif)$/i', $archivo)) {
        $avatares[] = $archivo;
    }
}

// Ordenamos numéricamente
usort($avatares, function ($a, $b) {
    preg_match('/\d+/', $a, $numA);
    preg_match('/\d+/', $b, $numB);
    return intval($numA[0]) - intval($numB[0]);
});

enviarRespuesta(null, ['success' => true, 'avatares' => $avatares]);