// Importar los módulos de internacionalización
import i18n from './i18n.js';
import LanguageSelector from './language.js';

let banners = document.querySelectorAll('.banner');
let index = 0;
function rotateBanner() {
    banners.forEach((banner, i) => {
        banner.style.display = (i === index) ? 'block' : 'none';
    });
    index = (index + 1) % banners.length;
}
setInterval(rotateBanner, 3000);

// Inicializar el selector de idiomas y actualizar el contenido
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar el selector de idiomas
    const languageSelector = new LanguageSelector();
    
    // Actualizar el contenido con las traducciones
    i18n.updatePageContent();
});