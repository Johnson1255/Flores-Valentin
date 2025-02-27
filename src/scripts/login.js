import { initTheme } from './theme.js';
import i18n from './i18n.js';
import LanguageSelector from './language.js';

const tabButtons = document.querySelectorAll('.tab-button');
const loginForm = document.querySelector('.login-form');
const registerForm = document.querySelector('.register-form');

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar el tema
    initTheme();
    
    // Inicializar el selector de idiomas
    const languageSelector = new LanguageSelector();
    
    // Actualizar el contenido con las traducciones
    i18n.updatePageContent();

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            
            button.classList.add('active');
            
            // Utilizamos i18n para comparar con el valor traducido
            if (button.textContent.trim() === i18n.t('login')) {
                loginForm.style.display = 'block';
                registerForm.style.display = 'none';
            } else {
                loginForm.style.display = 'none';
                registerForm.style.display = 'block';
            }
        });
    });
});