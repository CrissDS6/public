<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MeteoPet - Cuida a tus mascotas según el clima</title>

    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">

    <!-- Custom CSS -->
    <link rel="stylesheet" href="styles.css">

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
                        <a class="nav-link" href="#login">Iniciar sesión</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#contacto">Contacto</a>
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
                        <span class="text-primary">Cuida a tus mascotas</span>
                        <span class="text-dark">según el clima</span>
                    </h1>
                    <p class="hero-subtitle">
                        Consejos personalizados para tus amigos peludos basados en el tiempo que hace en tu ciudad.
                        ¡La plataforma más alegre para dueños responsables!
                    </p>
                    <a href="#registro" class="btn-hero">
                        Regístrate gratis <span class="arrow">→</span>
                    </a>
                </div>
                <div class="hero-image-wrapper">
                    <div class="hero-image-container">
                        <div class="weather-card">
                            <span class="weather-icon">☀</span>
                            <div>
                                <small>Salamanca HOY</small>
                                <h5>Soleado, 22°C</h5>
                            </div>
                        </div>
                        <img src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop"
                            alt="Perro feliz" class="hero-image">
                        <div class="floating-element element-1">
                            <span>🌧</span>
                        </div>
                        <div class="floating-element element-2">
                            <span>☀</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- ¿QUÉ ES METEOPET? -->
    <section class="section-what" id="que-es">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">
                    ¿Qué es MeteoPet?
                    <span class="emoji">😊</span>
                    <span class="emoji heart">❤️</span>
                </h2>
                <p class="section-subtitle">
                    Tu compañero esencial para el cuidado de mascotas informado por el clima.
                </p>
            </div>

            <div class="features-grid">
                <div class="feature-card-simple">
                    <div class="icon-wrapper">
                        <span class="icon">⛅</span>
                    </div>
                    <h5>Clima</h5>
                    <p class="text-muted">Seguimiento meteorológico optimizado para actividades al aire libre.</p>
                </div>
                <div class="feature-card-simple">
                    <div class="icon-wrapper">
                        <span class="icon">💗</span>
                    </div>
                    <h5>Salud</h5>
                    <p class="text-muted">Monitoreo de salud diaria con cambios básicos de temperatura.</p>
                </div>
                <div class="feature-card-simple">
                    <div class="icon-wrapper">
                        <span class="icon">🔔</span>
                    </div>
                    <h5>Alertas</h5>
                    <p class="text-muted">Alertas climáticas en tiempo real diseñadas para dueños de mascotas.</p>
                </div>
                <div class="feature-card-simple">
                    <div class="icon-wrapper">
                        <span class="icon">🛡</span>
                    </div>
                    <h5>Seguridad</h5>
                    <p class="text-muted">Recomendaciones de seguridad en interiores para climas extremos.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- LO QUE OFRECE LA PLATAFORMA -->
    <section class="section-features">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">
                    <span class="star">⭐</span>
                    Lo que ofrece la plataforma
                    <span class="star">⭐</span>
                </h2>
            </div>

            <div class="platform-grid">
                <div class="platform-card">
                    <div class="card-icon">
                        <span class="icon">💡</span>
                    </div>
                    <h5>Tips Diarios</h5>
                    <p class="text-muted">Cuidado diario basado en humedad y temperatura local.</p>
                </div>

                <div class="platform-card">
                    <div class="card-icon">
                        <span class="icon">💬</span>
                    </div>
                    <h5>Comunidad</h5>
                    <p class="text-muted">Foro especializado para consejos entre dueños de mascotas.</p>
                </div>

                <div class="platform-card platform-card-highlight">
                    <div class="weather-badge">
                        <span class="badge-icon">🌦</span>
                        <span>LIVE WEATHER HUB</span>
                    </div>
                    <div class="stat-number">78%</div>
                    <p class="text-white">Humedad Promedio</p>
                </div>

                <div class="platform-card">
                    <div class="card-icon">
                        <span class="icon">📄</span>
                    </div>
                    <h5>Perfiles Pet</h5>
                    <p class="text-muted">Registro digital minimalista para tus mascotas.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- CONVERSACIONES RECIENTES -->
    <section class="section-forum" id="foro">
        <div class="container">
            <div class="section-header">
                <h2 class="section-title">Conversaciones recientes</h2>
                <p class="section-subtitle">Únete a la conversación en nuestra comunidad</p>
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
                        <p>¿Alguien sabe si es seguro pasear con este nivel de humedad? Mi Golden se
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

    <!-- CTA SECTION -->
    <section class="section-cta">
        <div class="container">
            <div class="cta-box">
                <h2>¡Únete a MeteoPet hoy!</h2>
                <p>Miles de dueños ya cuidan mejor de sus mascotas gracias a nuestros consejos
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
                        <span class="footer-icon">⛅</span>
                        <h5>MeteoPet</h5>
                    </div>
                    <p class="text-light-gray">
                        Cuidando a tus mascotas inteligentemente con el clima.
                    </p>
                    <div class="social-links">
                        <a href="#" aria-label="Facebook">f</a>
                        <a href="#" aria-label="Twitter">𝕏</a>
                        <a href="#" aria-label="Instagram">📷</a>
                        <a href="#" aria-label="Email">✉</a>
                        <a href="#" aria-label="Share">↗</a>
                    </div>
                </div>

                <div class="footer-col">
                    <h6>Legal</h6>
                    <ul class="footer-links">
                        <li><a href="#">Términos</a></li>
                        <li><a href="#">Privacidad</a></li>
                    </ul>
                </div>

                <div class="footer-col">
                    <h6>Comunidad</h6>
                    <ul class="footer-links">
                        <li><a href="#">Foro</a></li>
                        <li><a href="#">Blog</a></li>
                    </ul>
                </div>

                <div class="footer-col">
                    <h6>Contacto</h6>
                    <ul class="footer-links">
                        <li><span class="footer-icon-small">✉</span> info@meteopet.com</li>
                        <li><span class="footer-icon-small">📞</span> +34 XXX XXX XXX</li>
                        <li><span class="footer-icon-small">📍</span> Plasencia, Extremadura</li>
                    </ul>
                </div>
            </div>

            <hr class="footer-divider">

            <div class="footer-bottom">
                <p>© 2024 MeteoPet. Hecho con <span class="heart">❤️</span> para tus mascotas.</p>
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
    </script>
</body>

</html>