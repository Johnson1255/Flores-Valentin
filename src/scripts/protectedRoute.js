import { getSession } from './auth.js';

export async function protectRoute() {
  const session = await getSession();
  
  if (!session) {
    // Si no hay sesión activa, redirigir al login
    window.location.href = '/login.html';
  }
  
  return session;
}