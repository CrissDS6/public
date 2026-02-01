// Manejo del formulario de login
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;

    // Aquí iría la lógica de autenticación con tu backend
    console.log('Login attempt:', {
        email,
        password: '***', // No mostrar la contraseña en consola
        remember
    });

    // Simulación de login exitoso
    alert('¡Bienvenido a MeteoPet! 🐾');

    // Redirigir al dashboard (descomentar cuando esté listo)
    // window.location.href = 'dashboard.html';
});

// Animación de iconos en los inputs cuando reciben foco
const inputs = document.querySelectorAll('input[type="email"], input[type="password"]');
inputs.forEach(input => {
    input.addEventListener('focus', function () {
        const icon = this.parentElement.querySelector('.input-icon');
        if (icon) {
            icon.style.color = '#4A9FD8';
        }
    });

    input.addEventListener('blur', function () {
        const icon = this.parentElement.querySelector('.input-icon');
        if (icon) {
            icon.style.color = '#B0BEC5';
        }
    });
});

// Manejo de botones de login social
const socialButtons = document.querySelectorAll('.social-btn');
socialButtons.forEach(button => {
    button.addEventListener('click', function () {
        const provider = this.getAttribute('title');
        console.log(`Login con ${provider}`);
        alert(`Funcionalidad de login con ${provider} en desarrollo 🚀`);
    });
});