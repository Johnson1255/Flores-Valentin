import { supabase } from './supabase.js';
import { protectRoute } from './protectedRoute.js';
import axios from 'axios';

// Elementos del DOM
const flowersContainer = document.getElementById('flowers-container');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const addFlowerButton = document.getElementById('add-flower-button');
const flowerModal = new bootstrap.Modal(document.getElementById('flowerModal'));
const flowerForm = document.getElementById('flower-form');
const saveFlowerButton = document.getElementById('save-flower-button');

// Variables globales
let currentFlowers = [];
let editingFlowerId = null;

// Comprobar autenticación
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Proteger esta ruta - solo usuarios autenticados
        const session = await protectRoute();
        
        if (session) {
            // Cargar datos iniciales
            await loadFlowers();
            
            // Configurar event listeners
            setupEventListeners();
        }
    } catch (error) {
        console.error('Error al inicializar la página:', error);
    }
});

// Configurar event listeners
function setupEventListeners() {
    // Botón de búsqueda
    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        filterFlowers(searchTerm);
    });
    
    // Búsqueda mientras se escribe
    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.trim().toLowerCase();
        filterFlowers(searchTerm);
    });
    
    // Botón para agregar flor
    addFlowerButton.addEventListener('click', () => {
        // Resetear el formulario y abrir el modal para agregar
        flowerForm.reset();
        document.getElementById('modalTitle').textContent = 'Agregar Nueva Flor';
        editingFlowerId = null;
        flowerModal.show();
    });
    
    // Botón para guardar flor
    saveFlowerButton.addEventListener('click', async () => {
        // Validar formulario
        if (!flowerForm.checkValidity()) {
            flowerForm.reportValidity();
            return;
        }
        
        const flowerData = {
            name: document.getElementById('flower-name').value,
            description: document.getElementById('flower-description').value,
            price: parseFloat(document.getElementById('flower-price').value),
            category: document.getElementById('flower-category').value,
            image_url: document.getElementById('flower-image').value,
            stock: parseInt(document.getElementById('flower-stock').value) || 0
        };
        
        if (editingFlowerId) {
            // Actualizar flor existente
            await updateFlower(editingFlowerId, flowerData);
        } else {
            // Agregar nueva flor
            await addFlower(flowerData);
        }
        
        flowerModal.hide();
        await loadFlowers(); // Recargar la lista
    });
}

// Cargar flores desde Supabase
async function loadFlowers() {
    try {
        const { data, error } = await supabase
            .from('flowers')
            .select('*')
            .order('name');
            
        if (error) throw error;
        
        currentFlowers = data || [];
        renderFlowers(currentFlowers);
    } catch (error) {
        console.error('Error al cargar flores:', error);
        flowersContainer.innerHTML = `<p class="text-danger">Error al cargar las flores: ${error.message}</p>`;
    }
}

// Filtrar flores según el término de búsqueda
function filterFlowers(searchTerm) {
    if (!searchTerm) {
        renderFlowers(currentFlowers);
        return;
    }
    
    const filtered = currentFlowers.filter(flower => 
        flower.name.toLowerCase().includes(searchTerm) ||
        flower.description?.toLowerCase().includes(searchTerm) ||
        flower.category?.toLowerCase().includes(searchTerm)
    );
    
    renderFlowers(filtered);
}

// Renderizar flores en el contenedor
function renderFlowers(flowers) {
    if (flowers.length === 0) {
        flowersContainer.innerHTML = '<p class="col-12 text-center">No se encontraron flores.</p>';
        return;
    }
    
    flowersContainer.innerHTML = flowers.map(flower => `
        <div class="col-md-4 col-lg-3 mb-4">
            <div class="card h-100">
                <img src="${flower.image_url || '/images/default-flower.jpg'}" class="card-img-top" alt="${flower.name}">
                <div class="card-body">
                    <h5 class="card-title">${flower.name}</h5>
                    <p class="card-text">${flower.description || ''}</p>
                    <p class="card-text"><small class="text-muted">Categoría: ${flower.category || 'General'}</small></p>
                    <p class="card-text"><strong>$${flower.price.toFixed(2)}</strong></p>
                    <p class="card-text"><small class="text-muted">En stock: ${flower.stock}</small></p>
                </div>
                <div class="card-footer bg-transparent d-flex justify-content-between">
                    <button class="btn btn-sm btn-outline-primary edit-flower" data-id="${flower.id}">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-sm btn-outline-danger delete-flower" data-id="${flower.id}">
                        <i class="fas fa-trash-alt"></i> Eliminar
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    // Agregar event listeners a los botones de editar y eliminar
    document.querySelectorAll('.edit-flower').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.id;
            editFlower(id);
        });
    });
    
    document.querySelectorAll('.delete-flower').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.currentTarget.dataset.id;
            if (confirm('¿Estás seguro que deseas eliminar esta flor?')) {
                deleteFlower(id);
            }
        });
    });
}

// Editar una flor
async function editFlower(id) {
    const flower = currentFlowers.find(f => f.id === id);
    if (!flower) return;
    
    // Llenar el formulario con los datos de la flor
    document.getElementById('flower-name').value = flower.name;
    document.getElementById('flower-description').value = flower.description || '';
    document.getElementById('flower-price').value = flower.price;
    document.getElementById('flower-category').value = flower.category || '';
    document.getElementById('flower-image').value = flower.image_url || '';
    document.getElementById('flower-stock').value = flower.stock;
    
    // Actualizar el título del modal y guardar el ID de la flor que se está editando
    document.getElementById('modalTitle').textContent = 'Editar Flor';
    editingFlowerId = id;
    
    // Mostrar el modal
    flowerModal.show();
}

// Agregar una nueva flor
async function addFlower(flowerData) {
    try {
        const { data, error } = await supabase
            .from('flowers')
            .insert([flowerData])
            .select();
            
        if (error) throw error;
        
        alert('Flor agregada con éxito');
        return data;
    } catch (error) {
        console.error('Error al agregar flor:', error);
        alert(`Error al agregar flor: ${error.message}`);
    }
}

// Actualizar una flor existente
async function updateFlower(id, flowerData) {
    try {
        const { data, error } = await supabase
            .from('flowers')
            .update(flowerData)
            .eq('id', id)
            .select();
            
        if (error) throw error;
        
        alert('Flor actualizada con éxito');
        return data;
    } catch (error) {
        console.error('Error al actualizar flor:', error);
        alert(`Error al actualizar flor: ${error.message}`);
    }
}

// Eliminar una flor
async function deleteFlower(id) {
    try {
        const { error } = await supabase
            .from('flowers')
            .delete()
            .eq('id', id);
            
        if (error) throw error;
        
        alert('Flor eliminada con éxito');
        await loadFlowers(); // Recargar la lista
    } catch (error) {
        console.error('Error al eliminar flor:', error);
        alert(`Error al eliminar flor: ${error.message}`);
    }
}

// Ejemplo de cómo usar Axios para cargar datos externos
async function loadSampleFlowersWithAxios() {
    try {
        // Esta función es un ejemplo de cómo poder usar Axios para cargar datos externos
        // y añadirlos a la base de datos de Supabase
        const response = await axios.get('https://ejemplo-api-flores.com/flores');
        const externalFlowers = response.data;
        
        // Convertir el formato de la API externa al formato de la tabla
        const formattedFlowers = externalFlowers.map(flower => ({
            name: flower.nombre,
            description: flower.descripcion,
            price: flower.precio,
            category: flower.categoria,
            image_url: flower.imagen,
            stock: flower.existencias
        }));
        
        // Insertar en Supabase
        const { data, error } = await supabase
            .from('flowers')
            .insert(formattedFlowers)
            .select();
            
        if (error) throw error;
        
        console.log('Flores cargadas desde API externa:', data);
    } catch (error) {
        console.error('Error al cargar flores desde API externa:', error);
    }
}