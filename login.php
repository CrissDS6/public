<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Iniciar Sesión - MeteoPet</title>

    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">

    <!-- Custom CSS -->
    <link rel="stylesheet" href="assets/css/login.css">

    <!-- Enlace scripts -->
    <script defer src="assets/js/login.js"></script>
</head>

<body>
    <a href="index.php" class="back-home">← Volver al inicio</a>

    <div class="login-container">
        <div class="login-left">
            <div class="login-illustration">
                <div class="pet-icons">
                    <span>🐕</span>
                    <span>🐱</span>
                </div>
            </div>
            <h2>¡Bienvenido de vuelta!</h2>
            <p>Tus peludos te están esperando. Inicia sesión para recibir los mejores consejos según el clima de hoy.
            </p>
        </div>

        <div class="login-right">
            <div class="logo-section">
                <h1>Iniciar Sesión</h1>
                <p>Accede a tu cuenta de MeteoPet</p>
            </div>

            <form id="loginForm">
                <div class="form-group">
                    <label for="email">Correo electrónico</label>
                    <div class="input-wrapper">
                        <span class="input-icon">✉️</span>
                        <input type="email" id="email" name="email" placeholder="tu@email.com" required>
                    </div>
                </div>

                <div class="form-group">
                    <label for="password">Contraseña</label>
                    <div class="input-wrapper">
                        <span class="input-icon">🔒</span>
                        <input type="password" id="password" name="password" placeholder="••••••••" required>
                    </div>
                </div>

                <div class="form-options">
                    <label class="remember-me">
                        <input type="checkbox" id="remember">
                        <span>Recuérdame</span>
                    </label>
                    <a href="#" class="forgot-password">¿Olvidaste tu contraseña?</a>
                </div>

                <button type="submit" class="btn-login">Iniciar Sesión</button>
            </form>

            <div class="divider">
                <span>O continúa con</span>
            </div>

            <div class="social-login">
                <button class="social-btn" title="Google">🔍</button>
                <button class="social-btn" title="Facebook">f</button>
                <button class="social-btn" title="Apple">🍎</button>
            </div>

            <p class="register-link">
                ¿No tienes una cuenta? <a href="registro.html">Regístrate gratis</a>
            </p>
        </div>
    </div>


</body>

</html>