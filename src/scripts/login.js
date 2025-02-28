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
    
    // Manejo del registro de usuarios
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Verificación de contraseñas coincidentes
        const password = registerForm.querySelector('#password-registro').value;
        const confirmPassword = registerForm.querySelector('#confirm-password').value;
        
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }
        
        // Inputs de valores del registro
        const formData = {
            nombre: registerForm.querySelector('#nombre').value,
            apellidos: registerForm.querySelector('#apellidos').value,
            email: registerForm.querySelector('#email-registro').value,
            telefono: registerForm.querySelector('#telefono').value,
            pais: registerForm.querySelector('#pais').value,
            ciudad: registerForm.querySelector('#ciudad').value,
            barrio: registerForm.querySelector('#barrio').value,
            direccion: registerForm.querySelector('#direccion').value,
            codigoPostal: registerForm.querySelector('#codigo-postal').value,
            password: password,
            ocasiones: Array.from(registerForm.querySelectorAll('input[name="ocasiones"]:checked'))
                    .map(input => input.value)
        };

        // Usuarios en localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
            
        // Verificacion en caso de que exista un usuario
        if (users.some(user => user.email === formData.email)) {
            alert('Este correo electrónico ya está registrado');
            return;
        }

        // Agregar nuevo usuario
        users.push(formData);
        localStorage.setItem('users', JSON.stringify(users));
            
        alert('Registro exitoso!');
        registerForm.reset();
        tabButtons[0].click(); // Cambia a la vista de login
    });

    // Manejo del login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
            
        const email = loginForm.querySelector('#email').value;
        const password = loginForm.querySelector('#password').value;
        
        // Obtener usuarios del localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Guardar sesión actual
            localStorage.setItem('currentUser', JSON.stringify({
                nombre: user.nombre,
                email: user.email,
                isLoggedIn: true
            }));
                
            // Cambia a la vista de inicio
            window.location.href = '/index.html';
        } else {
            alert('Usuario o contraseña incorrecto');
        }
    });

    // Verificar si hay sesión activa
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.isLoggedIn) {
        window.location.href = '/index.html';
    }
});