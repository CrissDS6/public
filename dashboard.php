<?php
// Comprobamos que el usuario ha iniciado sesión — si no, lo mandamos al inicio
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

    <!-- Estilos: shell del dashboard + una hoja por cada vista -->
    <link rel="stylesheet" href="assets/css/dashboard.css">
    <link rel="stylesheet" href="assets/css/vistas/inicio.css">
    <link rel="stylesheet" href="assets/css/vistas/mascotas.css">
    <link rel="stylesheet" href="assets/css/vistas/consejos.css">
    <link rel="stylesheet" href="assets/css/vistas/ciudades.css">
    <link rel="stylesheet" href="assets/css/vistas/foro.css">
    <link rel="stylesheet" href="assets/css/vistas/perfil.css">
    <link rel="stylesheet" href="assets/css/vistas/admin.css">

    <!-- Scripts: dashboard primero (define cargarVista y las constantes del tiempo) -->
    <!-- Los JS de vistas se cargan después porque usan funciones del dashboard -->
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

    <!-- ********** NAVBAR ********** -->
    <nav class="navbar">
        <div class="container">
            <!-- El logo lleva al dashboard, no a index.html -->
            <a class="navbar-brand" href="dashboard.php">
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
                    <!-- Los enlaces no navegan a otra página: el JS carga la vista en #contenido-principal -->
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

                    <!-- Dropdown del perfil — el nombre y avatar se cargan desde PHP y JS -->
                    <li class="nav-item nav-item-perfil">
                        <button class="nav-link nav-dropdown-btn" id="btn-perfil">
                            <img id="nav-avatar" src="assets/img/avatares/avatar_default.png" alt="avatar"
                                class="nav-avatar-img">
                            <?php
                            // Mostramos solo el primer nombre del usuario
                            $primerNombre = explode(' ', $nombreUsuario)[0];
                            echo htmlspecialchars($primerNombre);
                            ?> ▼
                        </button>
                        <div class="nav-dropdown" id="dropdown-perfil">
                            <!-- El enlace de admin solo aparece si el usuario es administrador -->
                            <?php if ($_SESSION['usuario_rol'] == 'administrador'): ?>
                            <a href="#" data-vista="admin" class="dropdown-item">
                                <img src="assets/img/ui/rueda.png" alt="admin" class="dropdown-icon">
                                Panel Admin
                                <span id="badge-mensajes" class="badge-nuevo" style="display:none">0</span>
                            </a>
                            <?php endif; ?>
                            <a href="#" data-vista="perfil" class="dropdown-item">
                                <img src="assets/img/ui/perfil.png" alt="perfil" class="dropdown-icon"> Mi Perfil
                            </a>
                            <a href="auth/logout.php" class="dropdown-item">
                                <img src="assets/img/ui/puerta.png" alt="cerrar sesión" class="dropdown-icon"> Cerrar
                                sesión
                            </a>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- ********** CONTENIDO PRINCIPAL ********** -->
    <!-- Las vistas parciales se cargan aquí por JS con fetch() e innerHTML -->
    <main id="contenido-principal"></main>

    <!-- ********** FOOTER ********** -->
    <footer class="footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-col">
                    <div class="footer-brand">
                        <img src="assets/img/ui/titulo_logoGris.png" alt="Meteopet" class="footer-title">
                    </div>
                    <p class="text-light-gray">Cuidando de tus mascotas inteligentemente.</p>
                </div>

                <div class="footer-col footer-col-center">
                    <h6>Síguenos</h6>
                    <div class="social-links">
                        <a href="#" aria-label="Facebook">f</a>
                        <a href="#" aria-label="Equis">𝕏</a>
                        <a href="#" aria-label="Instagram">
                            <img src="assets/img/ui/instagram.png" alt="logo instagram">
                        </a>
                    </div>
                </div>

                <div class="footer-col">
                    <h6>Contacto</h6>
                    <ul class="footer-links">
                        <li><span class="footer-icon-small">✉</span> info@meteopet.com</li>
                        <li><span class="footer-icon-small">📍</span> Hornachos, Badajoz</li>
                        <li>
                            <a href="#contacto">
                                <span class="footer-icon-small">📝</span> Formulario de contacto
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <hr class="footer-divider">
            <div class="footer-bottom">
                <p>© 2026 MeteoPet. Hecho con <span class="heart">❤️</span> para tus peludos.</p>
            </div>
        </div>
    </footer>

    <!-- ********** TEMPLATES GLOBALES ********** -->
    <!-- Estos templates están aquí porque las vistas se cargan con innerHTML
        y los elementos dentro de un innerHTML no pueden contener templates.-->

    <!-- Template: tarjeta de ciudad favorita -->
    <template id="template-ciudad">
        <div class="ciudad-card">
            <div class="ciudad-info">
                <p class="ciudad-nombre"></p>
                <p class="ciudad-provincia"></p>
            </div>
            <div class="ciudad-acciones"></div>
        </div>
    </template>

    <!-- Template: resultado de búsqueda de ciudad -->
    <template id="template-resultado">
        <div class="resultado-item">
            <div>
                <strong class="resultado-nombre"></strong>
                <span class="resultado-provincia"></span>
            </div>
            <button class="btn-añadir-ciudad">+ Añadir</button>
        </div>
    </template>

    <!-- Template: tarjeta de mascota en la galería -->
    <template id="template-mascota">
        <div class="mascota-card">
            <div class="mascota-foto-placeholder"></div>
            <p class="mascota-nombre"></p>
            <button class="btn-ver-info">Ver info</button>
        </div>
    </template>

    <!-- Template: publicación del foro -->
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

    <!-- Template: tarjeta de consejo por mascota -->
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

    <!-- Template: publicación del foro pendiente de moderar (admin) -->
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

    <!-- Template: mensaje de contacto (admin) -->
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

    <!-- Template: tarjeta de usuario (admin) -->
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

    <!-- ********** FILTROS MENSAJES ADMIN ********** -->
    <!-- Vive fuera del tab para poder moverlo con JS según la pestaña activa -->
    <div id="filtros-mensajes" style="display:none" class="admin-filtros">
        <button class="btn-filtro-msg activo" data-estado="">Todos</button>
        <button class="btn-filtro-msg" data-estado="pendiente">🔴 Pendiente</button>
        <button class="btn-filtro-msg" data-estado="en_proceso">🔵 En proceso</button>
        <button class="btn-filtro-msg" data-estado="resuelto">🟢 Resuelto</button>
    </div>

    <!-- ********** MODAL CONTACTO DASHBOARD ********** -->
    <!-- El envío se gestiona por fetch en dashboard.js → api/contacto.php -->
    <div id="modal-contacto-dash" class="modal-overlay">
        <div class="modal-contacto-contenido">
            <button id="modal-contacto-dash-cerrar" class="modal-cerrar">&times;</button>
            <div class="modal-contacto-header">
                <h2>Contacta con nosotros</h2>
                <p>¿Tienes alguna duda, problema o sugerencia?</p>
            </div>
            <div class="modal-contacto-body">
                <div class="contacto-grid">
                    <div class="form-group">
                        <label for="dash-contacto-nombre">Nombre</label>
                        <input type="text" id="dash-contacto-nombre" placeholder="Tu nombre">
                    </div>
                    <div class="form-group">
                        <label for="dash-contacto-email">Email</label>
                        <input type="email" id="dash-contacto-email" placeholder="tu@email.com">
                    </div>
                    <div class="form-group contacto-full">
                        <label for="dash-contacto-tipo">Tipo de consulta</label>
                        <select id="dash-contacto-tipo">
                            <option value="consulta">💬 Consulta general</option>
                            <option value="problema">🔴 Problema técnico</option>
                            <option value="sugerencia_ciudad">🏙️ Sugerencia de ciudad</option>
                            <option value="otro">⚪ Otro</option>
                        </select>
                    </div>
                    <div class="form-group contacto-full">
                        <label for="dash-contacto-asunto">Asunto</label>
                        <input type="text" id="dash-contacto-asunto" placeholder="Asunto de tu mensaje">
                    </div>
                    <div class="form-group contacto-full">
                        <label for="dash-contacto-mensaje">Mensaje</label>
                        <textarea id="dash-contacto-mensaje" rows="4"
                            placeholder="Escribe tu mensaje aquí..."></textarea>
                    </div>
                </div>
                <div id="dash-contacto-msg"></div>
                <button id="btn-dash-enviar-contacto" class="btn-login">
                    <span>✉️</span> Enviar mensaje
                </button>
            </div>
        </div>
    </div>

</body>

</html>