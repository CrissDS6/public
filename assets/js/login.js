

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