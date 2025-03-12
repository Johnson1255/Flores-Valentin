import { getSession } from './auth.js';

// Función para proteger una ruta y redirigir si es necesario
export async function protectAndRedirect(targetUrl) {
    const session = await getSession();
    
    if (!session) {
        // Si no hay sesión, redirigir al login con URL de retorno
        window.location.href = `/login.html?returnUrl=${encodeURIComponent(targetUrl)}`;
        return false;
    }
    
    return true;
}

// Función para aplicar protección a enlaces específicos
export function setupProtectedLinks() {
    // Obtener todos los enlaces que necesitan protección
    const protectedLinks = document.querySelectorAll('.action-button, .protected-link');
    
    protectedLinks.forEach(link => {
        const originalHref = link.getAttribute('href');
        
        // Solo modificar si no es ya el login
        if (!originalHref.includes('login.html')) {
            link.addEventListener('click', async (e) => {
                e.preventDefault();
                
                // Verificar sesión y redirigir según corresponda
                const canProceed = await protectAndRedirect(originalHref);
                
                if (canProceed) {
                    window.location.href = originalHref;
                }
            });
        }
    });
}

// Exportar una función para inicializar todo lo relacionado con la protección
export function initRouteProtection() {
    // Configurar enlaces protegidos cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupProtectedLinks);
    } else {
        setupProtectedLinks();
    }
}