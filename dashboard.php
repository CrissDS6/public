<?php
session_start();

if (!isset($_SESSION["usuario_id"])) {
    header("Location: login.php");
    exit;
}

$nombreUsuario = $_SESSION["usuario_nombre"];
?>


<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mi Dashboard - MeteoPet</title>


    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">

    <!-- Custom CSS -->
    <link rel="stylesheet" href="assets/css/dashboard.css">
    <link rel="stylesheet" href="assets/css/vistas/inicio.css">
    <link rel="stylesheet" href="assets/css/vistas/mascotas.css">
    <link rel="stylesheet" href="assets/css/vistas/consejos.css">
    <link rel="stylesheet" href="assets/css/vistas/ciudades.css">
    <link rel="stylesheet" href="assets/css/vistas/foro.css">
    <!-- Script  -->
    <script defer src="assets/js/dashboard.js"></script>
    <script defer src="assets/js/vistas/inicio.js"></script>
    <script defer src="assets/js/vistas/mascotas.js"></script>
    <script defer src="assets/js/vistas/consejos.js"></script>
    <script defer src="assets/js/vistas/ciudades.js"></script>
    <script defer src="assets/js/vistas/foro.js"></script>
</head>

<body>
    <!-- HEADER/NAVBAR -->
    <nav class="navbar">
        <div class="container">
            <a class="navbar-brand" href="dashboard.html">
                <div class="logo-icon">
                    <img src="assets/img/ui/logo.png" alt="logo_meteopet">
                </div>
                <div class="logo-title">
                    <img src="assets/img/ui/titulo_logo.png" alt="titulo Meteopet">
                </div>
            </a>
            <button class="navbar-toggler" id="menuToggle" aria-label="Toggle navigation">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <div class="navbar-collapse" id="navbarNav">
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <a class="nav-link" data-vista="inicio" href="#">Inicio</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-vista="mis-mascotas" href="#">Mis Mascotas</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-vista="consejos" href="#">Consejos</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-vista="ciudades" href="#">Ciudades</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-vista="foro" href="#">Foro</a>
                    </li>
                    <li class="nav-item nav-item-perfil">
                        <button class="nav-link nav-dropdown-btn" id="btn-perfil">
                            <?php
                            $primerNombre = explode(' ', $nombreUsuario)[0];
                            echo htmlspecialchars($primerNombre);
                            ?> ▼
                        </button>
                        <div class="nav-dropdown" id="dropdown-perfil">
                            <a href="#" data-vista="perfil" class="dropdown-item">👤 Mi Perfil</a>
                            <a href="auth/logout.php" class="dropdown-item">🚪 Cerrar sesión</a>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- DASHBOARD CONTENT -->
    <main id="contenido-principal"></main>

    <!-- FOOTER -->
    <footer class="footer">
        <div class="container">
            <div class="footer-grid">
                <!-- Columna 1: Información de MeteoPet -->
                <div class="footer-col">
                    <div class="footer-brand">
                        <img src="assets/img/ui/titulo_logoGris.png" alt="Meteopet" class="footer-title">
                    </div>
                    <p class="text-light-gray">
                        Cuidando de tus mascotas inteligentemente.
                    </p>
                </div>

                <!-- Columna 2: Redes Sociales -->
                <div class="footer-col footer-col-center">
                    <h6>Síguenos</h6>
                    <div class="social-links">
                        <a href="#" aria-label="Facebook">f</a>
                        <a href="#" aria-label="Equis">𝕏</a>
                        <a href="#" aria-label="Instagram"><img src="assets/img/ui/instagram.png"
                                alt="logo instagram"></a>
                    </div>
                </div>

                <!-- Columna 3: Contacto -->
                <div class="footer-col">
                    <h6>Contacto</h6>
                    <ul class="footer-links">
                        <li><span class="footer-icon-small">✉</span> info@meteopet.com</li>
                        <li><span class="footer-icon-small">📍</span> Zafra, Badajoz</li>
                        <li><a href="#contacto"><span class="footer-icon-small">📝</span> Formulario de contacto</a>
                        </li>
                    </ul>
                </div>
            </div>
            <hr class="footer-divider">

            <div class="footer-bottom">
                <p>© 2026 MeteoPet. Hecho con <span class="heart">❤️</span> para tus mascotas.</p>
            </div>
        </div>
    </footer>

</body>

</html>