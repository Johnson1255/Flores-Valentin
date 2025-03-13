import { supabase } from './supabase.js';

// Registro de usuario
export async function signUp(email, password, profileData) {
  try {
    // Registrar al usuario
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    // Si el registro fue exitoso, actualizar el perfil
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: profileData.nombre,
          last_name: profileData.apellidos,
          phone: profileData.telefono,
          country: profileData.pais,
          city: profileData.ciudad,
          neighborhood: profileData.barrio,
          address: profileData.direccion,
          postal_code: profileData.codigoPostal,
          preferences: profileData.ocasiones,
          newsletter: profileData.newsletter || false
        })
        .eq('id', data.user.id);

      if (profileError) {
        console.error('Error al actualizar perfil:', profileError);
      }
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error en el registro:', error.message);
    return { data: null, error };
  }
}

// Inicio de sesión
export async function signIn(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error en el inicio de sesión:', error.message);
    return { data: null, error };
  }
}

// Cerrar sesión
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    window.location.href = '/Flores-Valentin/login.html';
  } catch (error) {
    console.error('Error al cerrar sesión:', error.message);
  }
}

// Verificar si hay una sesión activa
export async function getSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session;
  } catch (error) {
    console.error('Error al obtener la sesión:', error.message);
    return null;
  }
}

// Obtener el usuario actual
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error al obtener el usuario actual:', error.message);
    return null;
  }
}