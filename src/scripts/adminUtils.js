import { supabase } from './supabase.js';
import { getCurrentUser } from './auth.js';

// Verifica si un usuario es administrador
export async function isUserAdmin() {
  try {
    const user = await getCurrentUser();
    if (!user) return false;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
      
    if (error) throw error;
    
    return data.role === 'admin';
  } catch (error) {
    console.error('Error al verificar rol de administrador:', error);
    return false;
  }
}

// Esta función solo debería ser llamada por usuarios que ya son administradores
export async function setUserRole(userId, role) {
  try {
    // Primero verificar si el usuario actual es administrador
    if (!await isUserAdmin()) {
      throw new Error('Solo los administradores pueden cambiar roles de usuario');
    }
    
    // Actualizar el rol del usuario especificado
    const { data, error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId)
      .select();
      
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Error al cambiar rol de usuario:', error);
    return { success: false, error: error.message };
  }
}