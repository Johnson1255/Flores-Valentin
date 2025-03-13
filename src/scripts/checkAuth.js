import { protectAndRedirect } from './routeProtection.js';

(async function() {
    // Obtiene la ruta actual completa incluyendo parámetros
    const currentPath = window.location.pathname + window.location.search;
    
    // Intenta proteger la ruta actual
    await protectAndRedirect(currentPath);
})();