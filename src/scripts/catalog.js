import { supabase } from './supabase.js';
import { getCurrentUser, getSession } from './auth.js';

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
let isAdmin = false;

// Comprobar autenticación al cargar la página
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Cargar datos iniciales - permitido para todos
        await loadFlowers();
        
        // Verificar si hay sesión y comprobar rol
        const session = await getSession();
        
        if (session) {
            // Obtener perfil del usuario
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', session.user.id)
                .single();
                
            if (!error && profile) {
                isAdmin = profile.role === 'admin';
                
                // Mostrar u ocultar controles de administrador
                toggleAdminControls(isAdmin);
            }
        } else {
            // No hay sesión, ocultar controles de administrador
            toggleAdminControls(false);
        }
        
        // Configurar event listeners
        setupEventListeners();
        
    } catch (error) {
        console.error('Error al inicializar la página:', error);
    }
});

// Mostrar u ocultar controles de administrador
function toggleAdminControls(show) {
    // Botón de agregar flores
    if (addFlowerButton) {
        addFlowerButton.style.display = show ? 'block' : 'none';
    }
    
    // Otros elementos marcados como admin-only
    document.querySelectorAll('.admin-only').forEach(el => {
        el.style.display = show ? 'block' : 'none';
    });
}

// Configurar event listeners
function setupEventListeners() {
    // Botón de búsqueda
    if (searchButton) {
        searchButton.addEventListener('click', () => {
            const searchTerm = searchInput.value.trim().toLowerCase();
            filterFlowers(searchTerm);
        });
    }
    
    // Búsqueda mientras se escribe
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.trim().toLowerCase();
            filterFlowers(searchTerm);
        });
    }
    
    // Botón para agregar flor (solo admin)
    if (addFlowerButton) {
        addFlowerButton.addEventListener('click', () => {
            if (!isAdmin) {
                alert('Solo los administradores pueden agregar flores');
                return;
            }
            
            // Resetear el formulario y abrir el modal para agregar
            flowerForm.reset();
            document.getElementById('modalTitle').textContent = 'Agregar Nueva Flor';
            editingFlowerId = null;
            flowerModal.show();
        });
    }
    
    // Botón para guardar flor
    if (saveFlowerButton) {
        saveFlowerButton.addEventListener('click', async () => {
            if (!isAdmin) {
                alert('Solo los administradores pueden modificar flores');
                return;
            }
            
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
}

// Cargar flores desde Supabase - Visible para todos
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
    if (!flowersContainer) return;
    
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
                <div class="card-footer bg-transparent d-flex justify-content-between admin-only" style="display: none;">
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
    
    // Actualizar la visibilidad de los controles de administrador
    document.querySelectorAll('.admin-only').forEach(el => {
        el.style.display = isAdmin ? 'flex' : 'none';
    });
    
    // Agregar event listeners a los botones de editar y eliminar (solo si es admin)
    if (isAdmin) {
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
}

// Editar una flor (solo admin)
async function editFlower(id) {
    if (!isAdmin) {
        alert('Solo los administradores pueden editar flores');
        return;
    }
    
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

// Agregar una nueva flor (solo admin)
async function addFlower(flowerData) {
    if (!isAdmin) {
        alert('Solo los administradores pueden agregar flores');
        return;
    }
    
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

// Actualizar una flor existente (solo admin)
async function updateFlower(id, flowerData) {
    if (!isAdmin) {
        alert('Solo los administradores pueden actualizar flores');
        return;
    }
    
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

// Eliminar una flor (solo admin)
async function deleteFlower(id) {
    if (!isAdmin) {
        alert('Solo los administradores pueden eliminar flores');
        return;
    }
    
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