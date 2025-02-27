import '../styles/main.pcss';

document.addEventListener('DOMContentLoaded', function () {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const moonIcon = '<i class="fas fa-moon"></i>';
    const sunIcon = '<i class="fas fa-sun"></i>';

    // Función para alternar el modo oscuro
    function toggleDarkMode() {
        if (document.documentElement.classList.contains('dark-mode')) {
            // Cambiar a modo claro
            document.documentElement.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
            darkModeToggle.innerHTML = moonIcon;
        } else {
            // Cambiar a modo oscuro
            document.documentElement.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
            darkModeToggle.innerHTML = sunIcon;
        }
    }

    // Comprobar preferencia guardada
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark-mode');
        darkModeToggle.innerHTML = sunIcon;
    } else if (savedTheme === 'light') {
        document.documentElement.classList.remove('dark-mode');
        darkModeToggle.innerHTML = moonIcon;
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // Si no hay preferencia guardada, usar la preferencia del sistema
        document.documentElement.classList.add('dark-mode');
        darkModeToggle.innerHTML = sunIcon;
    }

    // Añadir event listener al botón
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }
});