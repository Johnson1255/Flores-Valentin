import axios from 'axios';
import { supabase } from './supabase.js';

const API_URL = import.meta.env.VITE_SUPABASE_URL;
const API_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Configurar axios
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'apikey': API_KEY,
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar el token de autenticación
apiClient.interceptors.request.use(async (config) => {
  const session = await supabase.auth.getSession();
  if (session?.data.session?.access_token) {
    config.headers.Authorization = `Bearer ${session.data.session.access_token}`;
  }
  return config;
});

// Servicio para las operaciones CRUD
export const flowerService = {
  // Obtener todas las flores
  getAllFlowers: async () => {
    try {
      const response = await apiClient.get('/rest/v1/flowers?select=*');
      return response.data;
    } catch (error) {
      console.error('Error al obtener flores:', error);
      throw error;
    }
  },
  
  // Obtener flores con filtro
  searchFlowers: async (searchTerm) => {
    try {
      const response = await apiClient.get(`/rest/v1/flowers?select=*&name=ilike.%${searchTerm}%`);
      return response.data;
    } catch (error) {
      console.error('Error al buscar flores:', error);
      throw error;
    }
  },
  
  // Agregar una nueva flor
  addFlower: async (flowerData) => {
    try {
      const response = await apiClient.post('/rest/v1/flowers', flowerData);
      return response.data;
    } catch (error) {
      console.error('Error al agregar flor:', error);
      throw error;
    }
  },
  
  // Actualizar una flor existente
  updateFlower: async (id, flowerData) => {
    try {
      const response = await apiClient.patch(`/rest/v1/flowers?id=eq.${id}`, flowerData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar flor:', error);
      throw error;
    }
  },
  
  // Eliminar una flor
  deleteFlower: async (id) => {
    try {
      const response = await apiClient.delete(`/rest/v1/flowers?id=eq.${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al eliminar flor:', error);
      throw error;
    }
  }
};