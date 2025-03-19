import { supabase } from './supabase.js';
import { getCurrentUser } from './auth.js';

document.addEventListener('DOMContentLoaded', async function() {
    // Verificar si el usuario está autenticado
    const user = await getCurrentUser();
    if (!user) {
        // Redirigir al login si no está autenticado
        window.location.href = '/login.html';
        return;
    }
    
    // Limitar selección de flores a máximo 3
    const flowerPrefs = document.querySelectorAll('.flower-pref');
    flowerPrefs.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const checked = document.querySelectorAll('.flower-pref:checked');
            if (checked.length > 3) {
                this.checked = false;
                alert('Por favor selecciona máximo 3 tipos de flores');
            }
        });
    });
    
    // Limitar selección de colores a máximo 3
    const colorPrefs = document.querySelectorAll('.color-pref');
    colorPrefs.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const checked = document.querySelectorAll('.color-pref:checked');
            if (checked.length > 3) {
                this.checked = false;
                alert('Por favor selecciona máximo 3 colores');
            }
        });
    });
    
    // Establecer fecha mínima a mañana
    const deliveryDateInput = document.getElementById('delivery-date');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    deliveryDateInput.min = tomorrow.toISOString().split('T')[0];
    
    // Manejar envío del formulario
    const form = document.getElementById('special-order-form');
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        try {
            // Obtener valores del formulario
            const recipientName = document.getElementById('recipient-name').value;
            const recipientPhone = document.getElementById('recipient-phone').value;
            const occasion = document.getElementById('occasion').value;
            const budget = document.getElementById('budget').value;
            const deliveryDate = document.getElementById('delivery-date').value;
            const deliveryTime = document.getElementById('delivery-time').value;
            const message = document.getElementById('message').value;
            const specialInstructions = document.getElementById('special-instructions').value;
            
            // Obtener preferencias de flores seleccionadas
            const flowerPreferences = Array.from(document.querySelectorAll('.flower-pref:checked'))
                .map(checkbox => checkbox.value);
                
            // Obtener preferencias de colores seleccionados
            const colorPreferences = Array.from(document.querySelectorAll('.color-pref:checked'))
                .map(checkbox => checkbox.value);
            
            // Crear objeto con datos del pedido
            const orderData = {
                user_id: user.id,
                recipient_name: recipientName,
                recipient_phone: recipientPhone,
                occasion: occasion,
                delivery_date: deliveryDate,
                delivery_time: deliveryTime,
                budget: budget || null,
                flower_preferences: flowerPreferences,
                color_preferences: colorPreferences,
                message: message,
                special_instructions: specialInstructions
            };
            
            // Guardar pedido en la base de datos
            const { data, error } = await supabase
                .from('special_orders')
                .insert([orderData]);
                
            if (error) throw error;
            
            // Mostrar mensaje de éxito y redirigir
            alert('¡Tu pedido especial ha sido enviado correctamente! Nos pondremos en contacto contigo pronto.');
            window.location.href = '/index.html';
            
        } catch (error) {
            console.error('Error al enviar el pedido especial:', error.message);
            alert('Ocurrió un error al enviar tu pedido. Por favor intenta de nuevo.');
        }
    });
});