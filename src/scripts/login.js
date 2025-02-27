import { initTheme } from './theme.js';

const tabButtons = document.querySelectorAll('.tab-button');
const loginForm = document.querySelector('.login-form');
const registerForm = document.querySelector('.register-form');

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar el tema
    initTheme();

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            button.classList.add('active');
            
            if (button.textContent.trim() === 'Iniciar Sesión') {
                loginForm.style.display = 'block';
                registerForm.style.display = 'none';
            } else {
                loginForm.style.display = 'none';
                registerForm.style.display = 'block';
            }
        });
    });
});
