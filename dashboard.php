<?php
session_start();

if (!isset($_SESSION["usuario_id"])) {
    header("Location: index.html");
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
    <link rel="stylesheet" href="assets/css/vistas/perfil.css">
    <link rel="stylesheet" href="assets/css/vistas/admin.css">
    <!-- Script  -->
    <script defer src="assets/js/dashboard.js"></script>
    <script defer src="assets/js/vistas/inicio.js"></script>
    <script defer src="assets/js/vistas/mascotas.js"></script>
    <script defer src="assets/js/vistas/consejos.js"></script>
    <script defer src="assets/js/vistas/ciudades.js"></script>
    <script defer src="assets/js/vistas/foro.js"></script>
    <script defer src="assets/js/vistas/perfil.js"></script>
    <script defer src="assets/js/vistas/admin.js"></script>
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
                            <?php if ($_SESSION['usuario_rol'] == 'administrador'): ?>
                            <a href="#" data-vista="admin" class="dropdown-item">
                                ⚙️ Panel Admin
                                <span id="badge-mensajes" class="badge-nuevo" style="display:none">0</span>
                            </a>
                            <?php endif; ?>
                            <a href="#" data-vista="perfil" class="dropdown-item">👤 Mi Perfil</a>
                            <a href="auth/logout.php" class="dropdown-item">🚪 Cerrar sesión</a>
                        </div>
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

    <!-- Templates globales -->
    <template id="template-ciudad">
        <div class="ciudad-card">
            <div class="ciudad-info">
                <p class="ciudad-nombre"></p>
                <p class="ciudad-provincia"></p>
            </div>
            <div class="ciudad-acciones"></div>
        </div>
    </template>

    <template id="template-resultado">
        <div class="resultado-item">
            <div>
                <strong class="resultado-nombre"></strong>
                <span class="resultado-provincia"></span>
            </div>
            <button class="btn-añadir-ciudad">+ Añadir</button>
        </div>
    </template>

    <template id="template-mascota">
        <div class="mascota-card">
            <div class="mascota-foto-placeholder"></div>
            <p class="mascota-nombre"></p>
            <button class="btn-ver-info">Ver info</button>
        </div>
    </template>

    <template id="template-publicacion">
        <div class="publicacion-card">
            <div class="publicacion-header">
                <img src="" alt="avatar" class="foro-avatar">
                <div class="publicacion-autor">
                    <span class="publicacion-nombre"></span>
                    <div class="publicacion-meta">
                        <span class="publicacion-fecha"></span>
                        <span class="publicacion-especie-badge"></span>
                    </div>
                </div>
            </div>
            <p class="publicacion-titulo"></p>
            <p class="publicacion-contenido"></p>
            <div class="publicacion-footer">
                <span class="publicacion-ubicacion"></span>
                <button class="btn-like">❤️ <span class="like-count"></span></button>
            </div>
        </div>
    </template>

    <template id="template-consejo">
        <div class="consejo-card">
            <div class="consejo-card-header">
                <span class="consejo-emoji-mascota" style="font-size:1.5rem"></span>
                <h3 class="consejo-titulo"></h3>
            </div>
            <div class="consejo-card-body">
                <p class="consejo-texto"></p>
            </div>
        </div>
    </template>

    <template id="template-pendiente">
        <div class="admin-card">
            <div class="admin-card-header">
                <div class="admin-card-info">
                    <span class="admin-card-autor"></span>
                    <span class="admin-card-fecha"></span>
                    <span class="admin-card-especie"></span>
                    <span class="admin-card-ubicacion"></span>
                </div>
                <div class="admin-card-acciones">
                    <button class="btn-aprobar">✅ Aprobar</button>
                    <button class="btn-rechazar">❌ Rechazar</button>
                </div>
            </div>
            <h3 class="admin-card-titulo"></h3>
            <p class="admin-card-contenido"></p>
        </div>
    </template>

    <template id="template-mensaje">
        <div class="admin-card">
            <div class="admin-card-header">
                <div class="admin-card-info">
                    <span class="admin-card-autor"></span>
                    <span class="admin-card-email"></span>
                    <span class="admin-card-tipo-badge"></span>
                    <span class="admin-card-fecha"></span>
                </div>
                <div class="admin-card-acciones">
                    <select class="select-estado">
                        <option value="pendiente">Pendiente</option>
                        <option value="en_proceso">En proceso</option>
                        <option value="resuelto">Resuelto</option>
                    </select>
                </div>
            </div>
            <h3 class="admin-card-titulo"></h3>
            <p class="admin-card-contenido"></p>
        </div>
    </template>

    <template id="template-pendiente">
        <div class="admin-card">
            <div class="admin-card-header">
                <div class="admin-card-info">
                    <span class="admin-card-autor"></span>
                    <span class="admin-card-fecha"></span>
                    <span class="admin-card-especie"></span>
                    <span class="admin-card-ubicacion"></span>
                </div>
                <div class="admin-card-acciones">
                    <button class="btn-aprobar">✅ Aprobar</button>
                    <button class="btn-rechazar">❌ Rechazar</button>
                </div>
            </div>
            <h3 class="admin-card-titulo"></h3>
            <p class="admin-card-contenido"></p>
        </div>
    </template>

    <template id="template-mensaje">
        <div class="admin-card">
            <div class="admin-card-header">
                <div class="admin-card-info">
                    <span class="admin-card-autor"></span>
                    <span class="admin-card-email"></span>
                    <span class="admin-card-tipo-badge"></span>
                    <span class="admin-card-fecha"></span>
                </div>
                <div class="admin-card-acciones">
                    <select class="select-estado">
                        <option value="pendiente">Pendiente</option>
                        <option value="en_proceso">En proceso</option>
                        <option value="resuelto">Resuelto</option>
                    </select>
                </div>
            </div>
            <h3 class="admin-card-titulo"></h3>
            <p class="admin-card-contenido"></p>
        </div>
    </template>

    <template id="template-usuario-admin">
        <div class="admin-card">
            <div class="admin-card-header">
                <div class="admin-card-info">
                    <img src="" alt="avatar" class="admin-usuario-avatar">
                    <span class="admin-card-autor"></span>
                    <span class="admin-card-email"></span>
                    <span class="admin-card-fecha"></span>
                    <span class="admin-usuario-rol"></span>
                </div>
                <div class="admin-card-acciones">
                    <button class="btn-resetear-pass">🔑 Resetear contraseña</button>
                </div>
            </div>
            <div class="admin-pass-resultado" style="display:none">
                <p>Contraseña temporal: <strong class="pass-temporal"></strong></p>
                <small>Comunícasela al usuario para que pueda acceder y cambiarla desde su perfil.</small>
            </div>
        </div>
    </template>

    <!-- FILTROS MENSAJES -->
    <div id="filtros-mensajes" style="display:none" class="admin-filtros">
        <button class="btn-filtro-msg activo" data-estado="">Todos</button>
        <button class="btn-filtro-msg" data-estado="pendiente">🔴 Pendiente</button>
        <button class="btn-filtro-msg" data-estado="en_proceso">🔵 En proceso</button>
        <button class="btn-filtro-msg" data-estado="resuelto">🟢 Resuelto</button>
    </div>

</body>

</html>