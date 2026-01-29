<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MeteoPet - Cuida a tus mascotas según el clima</title>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">

    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">

    <!-- Custom CSS -->
    <link rel="stylesheet" href="styles.css">

</head>

<body>
    <!-- HEADER/NAVBAR -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white sticky-top shadow-sm">
        <div class="container">
            <a class="navbar-brand d-flex align-items-center" href="#inicio">
                <div class="logo-icon me-2">
                    <img src="assets/img/ui/logo.png" alt="logo_meteopet">
                </div>
                <div class="logo-title">
                    <img src="assets/img/ui/titulo_logo.png" alt="titulo Meteopet">
                </div>
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto align-items-center">
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
                    <li class="nav-item ms-lg-3">
                        <a class="btn btn-register" href="#registro">Regístrate</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- HERO SECTION -->
    <section class="hero" id="inicio">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6 mb-4 mb-lg-0">
                    <h1 class="hero-title">
                        <span class="text-primary">Cuida a tus mascotas</span>
                        <span class="text-dark">según el clima</span>
                    </h1>
                    <p class="hero-subtitle">
                        Consejos personalizados para tus amigos peludos basados en el tiempo que hace en tu ciudad.
                        ¡La plataforma más alegre para dueños responsables!
                    </p>
                    <a href="#registro" class="btn btn-hero btn-lg">
                        Regístrate gratis <i class="bi bi-arrow-right ms-2"></i>
                    </a>
                </div>
                <div class="col-lg-6">
                    <div class="hero-image-container">
                        <div class="weather-card">
                            <i class="bi bi-brightness-high-fill"></i>
                            <div>
                                <small>Salamanca HOY</small>
                                <h5 class="mb-0">Soleado, 22°C</h5>
                            </div>
                        </div>
                        <img src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop"
                            alt="Perro feliz" class="img-fluid rounded-4 shadow-lg hero-image">
                        <div class="floating-element element-1">
                            <i class="bi bi-cloud-rain-fill text-info"></i>
                        </div>
                        <div class="floating-element element-2">
                            <i class="bi bi-sun-fill text-warning"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- ¿QUÉ ES METEOPET? -->
    <section class="section-what py-5" id="que-es">
        <div class="container">
            <div class="text-center mb-5">
                <h2 class="section-title">
                    ¿Qué es MeteoPet?
                    <i class="bi bi-emoji-smile ms-2"></i>
                    <i class="bi bi-heart-fill text-danger ms-1"></i>
                </h2>
                <p class="section-subtitle">
                    Tu compañero esencial para el cuidado de mascotas informado por el clima.
                </p>
            </div>

            <div class="row g-4 mb-5">
                <div class="col-md-6 col-lg-3">
                    <div class="feature-card-simple text-center h-100">
                        <div class="icon-wrapper mb-3">
                            <i class="bi bi-cloud-sun"></i>
                        </div>
                        <h5>Clima</h5>
                        <p class="text-muted">Seguimiento meteorológico optimizado para actividades al aire libre.</p>
                    </div>
                </div>
                <div class="col-md-6 col-lg-3">
                    <div class="feature-card-simple text-center h-100">
                        <div class="icon-wrapper mb-3">
                            <i class="bi bi-heart-pulse"></i>
                        </div>
                        <h5>Salud</h5>
                        <p class="text-muted">Monitoreo de salud diaria con cambios básicos de temperatura.</p>
                    </div>
                </div>
                <div class="col-md-6 col-lg-3">
                    <div class="feature-card-simple text-center h-100">
                        <div class="icon-wrapper mb-3">
                            <i class="bi bi-bell"></i>
                        </div>
                        <h5>Alertas</h5>
                        <p class="text-muted">Alertas climáticas en tiempo real diseñadas para dueños de mascotas.</p>
                    </div>
                </div>
                <div class="col-md-6 col-lg-3">
                    <div class="feature-card-simple text-center h-100">
                        <div class="icon-wrapper mb-3">
                            <i class="bi bi-shield-check"></i>
                        </div>
                        <h5>Seguridad</h5>
                        <p class="text-muted">Recomendaciones de seguridad en interiores para climas extremos.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- LO QUE OFRECE LA PLATAFORMA -->
    <section class="section-features py-5">
        <div class="container">
            <div class="text-center mb-5">
                <h2 class="section-title">
                    <i class="bi bi-star-fill text-warning"></i>
                    Lo que ofrece la plataforma
                    <i class="bi bi-star-fill text-warning"></i>
                </h2>
            </div>

            <div class="row g-4">
                <div class="col-md-6 col-lg-3">
                    <div class="platform-card h-100">
                        <div class="card-icon">
                            <i class="bi bi-lightbulb-fill"></i>
                        </div>
                        <h5 class="mt-3 mb-2">Tips Diarios</h5>
                        <p class="text-muted small mb-0">Cuidado diario basado en humedad y temperatura local.</p>
                    </div>
                </div>

                <div class="col-md-6 col-lg-3">
                    <div class="platform-card h-100">
                        <div class="card-icon">
                            <i class="bi bi-chat-dots-fill"></i>
                        </div>
                        <h5 class="mt-3 mb-2">Comunidad</h5>
                        <p class="text-muted small mb-0">Foro especializado para consejos entre dueños de mascotas.</p>
                    </div>
                </div>

                <div class="col-md-6 col-lg-3">
                    <div class="platform-card platform-card-highlight h-100">
                        <div class="weather-badge">
                            <i class="bi bi-cloud-drizzle-fill"></i>
                            <span>LIVE WEATHER HUB</span>
                        </div>
                        <div class="stat-number">78%</div>
                        <p class="text-white small mb-0">Humedad Promedio</p>
                    </div>
                </div>

                <div class="col-md-6 col-lg-3">
                    <div class="platform-card h-100">
                        <div class="card-icon">
                            <i class="bi bi-file-earmark-text-fill"></i>
                        </div>
                        <h5 class="mt-3 mb-2">Perfiles Pet</h5>
                        <p class="text-muted small mb-0">Registro digital minimalista para tus mascotas.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- CONVERSACIONES RECIENTES -->
    <section class="section-forum py-5" id="foro">
        <div class="container">
            <div class="text-center mb-5">
                <h2 class="section-title">Conversaciones recientes</h2>
                <p class="section-subtitle">Únete a la conversación en nuestra comunidad</p>
            </div>

            <div class="row g-4">
                <div class="col-lg-6">
                    <div class="forum-card">
                        <div class="forum-avatar">
                            <i class="bi bi-person-circle"></i>
                        </div>
                        <div class="forum-content">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h6 class="mb-0">@LUNADOGS</h6>
                                <small class="text-muted">Hace 2h</small>
                            </div>
                            <p class="mb-0">¿Alguien sabe si es seguro pasear con este nivel de humedad? Mi Golden se
                                cansa rápido.</p>
                        </div>
                    </div>
                </div>

                <div class="col-lg-6">
                    <div class="forum-card forum-card-highlight">
                        <div class="forum-avatar">
                            <i class="bi bi-person-circle"></i>
                        </div>
                        <div class="forum-content">
                            <div class="d-flex justify-content-between align-items-start mb-2">
                                <h6 class="mb-0">@PETCARE_MOM</h6>
                                <small class="text-muted">Hace 5h</small>
                            </div>
                            <p class="mb-0">"Con humedad alta es mejor reducir el tiempo de paseo. Revisa la sección de
                                Alertas para más detalles."</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="text-center mt-4">
                <a href="#foro" class="btn btn-outline-primary">
                    Ver más conversaciones <i class="bi bi-arrow-right ms-2"></i>
                </a>
            </div>
        </div>
    </section>

    <!-- CTA SECTION -->
    <section class="section-cta py-5">
        <div class="container">
            <div class="cta-box text-center">
                <h2 class="text-white mb-3">¡Únete a MeteoPet hoy!</h2>
                <p class="text-white mb-4">Miles de dueños ya cuidan mejor de sus mascotas gracias a nuestros consejos
                    climáticos</p>
                <a href="#registro" class="btn btn-cta btn-lg">Crear Cuenta Gratis</a>
            </div>
        </div>
    </section>

    <!-- FOOTER -->
    <footer class="footer py-5">
        <div class="container">
            <div class="row g-4">
                <div class="col-lg-4">
                    <div class="d-flex align-items-center mb-3">
                        <i class="bi bi-cloud-sun-fill text-primary fs-3 me-2"></i>
                        <h5 class="mb-0 text-white">MeteoPet</h5>
                    </div>
                    <p class="text-light-gray mb-3">
                        Cuidando a tus mascotas inteligentemente con el clima.
                    </p>
                    <div class="social-links">
                        <a href="#"><i class="bi bi-facebook"></i></a>
                        <a href="#"><i class="bi bi-twitter"></i></a>
                        <a href="#"><i class="bi bi-instagram"></i></a>
                        <a href="#"><i class="bi bi-envelope"></i></a>
                        <a href="#"><i class="bi bi-share"></i></a>
                    </div>
                </div>

                <div class="col-lg-2 col-md-4">
                    <h6 class="text-white mb-3">Legal</h6>
                    <ul class="list-unstyled footer-links">
                        <li><a href="#">Términos</a></li>
                        <li><a href="#">Privacidad</a></li>
                    </ul>
                </div>

                <div class="col-lg-2 col-md-4">
                    <h6 class="text-white mb-3">Comunidad</h6>
                    <ul class="list-unstyled footer-links">
                        <li><a href="#">Foro</a></li>
                        <li><a href="#">Blog</a></li>
                    </ul>
                </div>

                <div class="col-lg-4 col-md-4">
                    <h6 class="text-white mb-3">Contacto</h6>
                    <ul class="list-unstyled footer-links">
                        <li><i class="bi bi-envelope me-2"></i> info@meteopet.com</li>
                        <li><i class="bi bi-phone me-2"></i> +34 XXX XXX XXX</li>
                        <li><i class="bi bi-geo-alt me-2"></i> Plasencia, Extremadura</li>
                    </ul>
                </div>
            </div>

            <hr class="my-4 border-secondary">

            <div class="text-center text-light-gray">
                <p class="mb-0">© 2024 MeteoPet. Hecho con <i class="bi bi-heart-fill text-danger"></i> para tus
                    mascotas.</p>
            </div>
        </div>
    </footer>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
</body>

</html>