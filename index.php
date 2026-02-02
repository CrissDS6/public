<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MeteoPet - Cuida a tus mascotas según el tiempo</title>

    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">

    <!-- Custom CSS -->
    <link rel="stylesheet" href="assets/css/styles.css">

</head>

<body>
    <!-- HEADER/NAVBAR -->
    <nav class="navbar">
        <div class="container">
            <a class="navbar-brand" href="#inicio">
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
                        <a class="nav-link" href="#inicio">Inicio</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#foro">Foro</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="login.php">Iniciar sesión</a>
                    </li>

                    <li class="nav-item">
                        <a class="btn-register" href="#registro">Regístrate</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- HERO SECTION -->
    <section class="hero" id="inicio">
        <div class="container">
            <div class="hero-content">
                <div class="hero-text">
                    <h1 class="hero-title">
                        <span class="text-dark">Cuida a tus mascotas</span>
                        <span class="text-primary">según el tiempo</span>
                    </h1>
                    <p class="hero-subtitle">
                        Recomendaciones diarias para tus peludos según el tiempo real de tu ciudad.
                        ¡La plataforma más alegre para dueños responsables!
                    </p>
                    <a href="#registro" class="btn-hero">
                        Regístrate gratis <span class="arrow">→</span>
                    </a>
                </div>
                <div class="hero-image-wrapper">
                    <div class="hero-image-container">
                        <img src="assets/img/ui/imagen-hero.png" alt="Perro y gato" class="hero-image">

                    </div>
                </div>
            </div>
        </div>
    </section>

    <!--  EN METEOPET ENCONTRARÁS... -->
    <section class="section-features">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">
                    <span class="star">⭐</span>
                    En Meteopet encontrarás...
                    <span class="star">⭐</span>
                </h2>
            </div>

            <div class="platform-grid">
                <div class="platform-card">
                    <div class="card-icon">
                        <span class="icon"><img src="assets/img/ui/emojiPerro.png" alt="emoji perro tips"></span>
                    </div>
                    <h5>Tips Diarios</h5>
                    <p class="text-muted">Cuidado diario basado en el tiempo de tu ciudad.</p>
                </div>

                <div class="platform-card">
                    <div class="card-icon">
                        <span class="icon"><img src="assets/img/ui/emojiGatoForo.png" alt="emoji gato foro"></span>
                    </div>
                    <h5>Comunidad</h5>
                    <p class="text-muted">Foro para intercambiar consejos para tu peludo.</p>
                </div>

                <div class="platform-card platform-card-highlight">
                    <div class="weather-badge">
                        <span class="badge-icon">🌦</span>
                        <span>TIEMPO ACTUAL</span>
                    </div>
                    <div class="stat-number">78%</div>
                    <p class="text-white">Humedad Promedio</p>
                </div>

                <div class="platform-card">
                    <div class="card-icon">
                        <span class="icon"><img src="assets/img/ui/emojiPerfiles.png" alt="emoji gato foro"></span>
                    </div>
                    <h5>Perfiles Pet</h5>
                    <p class="text-muted">Registra a todos tus peludos.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- CONVERSACIONES RECIENTES -->
    <section class="section-forum" id="foro">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Conversaciones recientes</h2>
                <p class="section-subtitle">Participa en las conversaciones de nuestra comunidad</p>
            </div>

            <div class="forum-grid">
                <div class="forum-card">
                    <div class="forum-avatar">
                        <span class="avatar-icon">👤</span>
                    </div>
                    <div class="forum-content">
                        <div class="forum-header">
                            <h6>@LUNADOGS</h6>
                            <small class="text-muted">Hace 2h</small>
                        </div>
                        <p>¿Alguien sabe si es seguro pasear con esta temperatura? Mi Golden se
                            cansa rápido.</p>
                    </div>
                </div>

                <div class="forum-card forum-card-highlight">
                    <div class="forum-avatar">
                        <span class="avatar-icon">👤</span>
                    </div>
                    <div class="forum-content">
                        <div class="forum-header">
                            <h6>@PETCARE_MOM</h6>
                            <small class="text-muted">Hace 5h</small>
                        </div>
                        <p>"Con humedad alta es mejor reducir el tiempo de paseo. Revisa la sección de
                            Alertas para más detalles."</p>
                    </div>
                </div>
            </div>

            <div class="text-center">
                <a href="#foro" class="btn-outline-primary">
                    Ver más conversaciones <span class="arrow">→</span>
                </a>
            </div>
        </div>
    </section>

    <!-- CREAR CUENTA SECTION -->
    <section class="section-cta">
        <div class="container">
            <div class="cta-box">
                <h2>¡Únete a MeteoPet hoy!</h2>
                <p>Miles de humanos ya cuidan mejor de sus peludos gracias a nuestros consejos
                    climáticos</p>
                <a href="#registro" class="btn-cta">Crear Cuenta Gratis</a>
            </div>
        </div>
    </section>

    <!-- FOOTER -->
    <footer class="footer">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-col">
                    <div class="footer-brand">
                        <img src="assets/img/ui/titulo_logoGris.png" alt="Meteopet" class="footer-title">
                    </div>
                    <p class="text-light-gray">
                        Cuidando de tus mascotas inteligentemente.
                    </p>
                    <div class="social-links">
                        <a href="#" aria-label="Facebook">f</a>
                        <a href="#" aria-label="Equis">𝕏</a>
                        <a href="#" aria-label="Instagram">📷</a>
                    </div>
                </div>


                <div class="footer-col">
                    <h6>Contacto</h6>
                    <ul class="footer-links">
                        <li><span class="footer-icon-small">✉</span> info@meteopet.com</li>

                        <li><span class="footer-icon-small">📍</span> Zafra, Badajoz</li>
                    </ul>
                </div>
            </div>
            <hr class="footer-divider">

            <div class="footer-bottom">
                <p>© 2026 MeteoPet. Hecho con <span class="heart">❤️</span> para tus mascotas.</p>
            </div>
        </div>
    </footer>

    <script>
    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const navbarNav = document.getElementById('navbarNav');

    menuToggle.addEventListener('click', function() {
        navbarNav.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link, .btn-register');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navbarNav.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar transparency on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    </script>
</body>

</html>