// Importación de la configuración de Supabase
import { supabase } from './supabase.js';

class CarritoCompras {
    // Constructor: Inicializa el carrito y sus componentes principales
    constructor() {
        this.productos = []; // Array para almacenar los productos del carrito
        this.supabase = supabase; // Instancia de Supabase para operaciones con la base de datos
        this.inicializarElementos(); // Inicializa referencias a elementos del DOM
        this.cargarCarritoDeSupabase(); // Carga inicial del carrito desde Supabase
        this.vincularEventos(); // Configura los event listeners
    }

    // Inicializa las referencias a elementos del DOM necesarios para el carrito
    inicializarElementos() {
        this.contenedorProductos = document.getElementById('cartItems');
        this.elementoSubtotal = document.getElementById('subtotal');
        this.elementoEnvio = document.getElementById('shipping');
        this.elementoImpuesto = document.getElementById('tax');
        this.elementoTotal = document.getElementById('total');
        this.botonPagar = document.querySelector('.checkout-button');
        this.inputCupon = document.querySelector('.coupon-card input');
        this.botonCupon = document.querySelector('.coupon-card button');
    }

    // Configura los event listeners para las interacciones del usuario
    vincularEventos() {
        // Event listener para el botón de pago
        this.botonPagar?.addEventListener('click', () => this.procesarPago());
        // Event listener para aplicar cupón de descuento
        this.botonCupon?.addEventListener('click', () => this.aplicarCupon());

        // Event delegation para los botones de cantidad y eliminar
        this.contenedorProductos?.addEventListener('click', (e) => {
            const objetivo = e.target;
            
            // Manejo de disminución de cantidad
            if (objetivo.classList.contains('quantity-decrease')) {
                const idProducto = objetivo.closest('.cart-item').dataset.id;
                this.actualizarCantidad(idProducto, 'disminuir');
            } 
            // Manejo de aumento de cantidad
            else if (objetivo.classList.contains('quantity-increase')) {
                const idProducto = objetivo.closest('.cart-item').dataset.id;
                this.actualizarCantidad(idProducto, 'aumentar');
            } 
            // Manejo de eliminación de producto
            else if (objetivo.classList.contains('remove-item')) {
                const idProducto = objetivo.closest('.cart-item').dataset.id;
                this.eliminarProducto(idProducto);
            }
        });
    }

    // Actualiza la cantidad de un producto específico
    actualizarCantidad(idProducto, accion) {
        const producto = this.productos.find(item => item.id === idProducto);
        if (!producto) return;

        if (accion === 'aumentar') {
            producto.cantidad++;
        } else if (accion === 'disminuir' && producto.cantidad > 1) {
            producto.cantidad--;
        }

        this.actualizarCarrito();
    }

    // Elimina un producto del carrito
    eliminarProducto(idProducto) {
        this.productos = this.productos.filter(item => item.id !== idProducto);
        this.actualizarCarrito();
    }

    // Actualiza el estado del carrito en todas las capas (local, Supabase y UI)
    async actualizarCarrito() {
        this.guardarCarritoEnLocal();
        await this.sincronizarConSupabase();
        this.renderizarCarrito();
        this.calcularTotales();
    }

    // Sincroniza el estado del carrito con Supabase
    async sincronizarConSupabase() {
        try {
            const usuario = await this.supabase.auth.getUser();
            if (!usuario.data?.user) return;

            // Actualiza o inserta el carrito en Supabase
            const { error } = await this.supabase
                .from('shopping_cart')
                .upsert({
                    user_id: usuario.data.user.id,
                    items: this.productos,
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'user_id'
                });

            if (error) throw error;
        } catch (error) {
            console.error('Error al sincronizar con Supabase:', error);
        }
    }

    // Calcula los totales del carrito (subtotal, envío, impuestos y total)
    calcularTotales() {
        const subtotal = this.productos.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const envio = subtotal > 0 ? 5.00 : 0;
        const impuesto = subtotal * 0.19; // 19% IVA
        const total = subtotal + envio + impuesto;

        // Actualiza los elementos en la UI con los nuevos totales
        this.elementoSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        this.elementoEnvio.textContent = `$${envio.toFixed(2)}`;
        this.elementoImpuesto.textContent = `$${impuesto.toFixed(2)}`;
        this.elementoTotal.textContent = `$${total.toFixed(2)}`;
    }

    // Renderiza los productos del carrito en la UI
    renderizarCarrito() {
        if (!this.contenedorProductos) return;

        // Genera el HTML para cada producto en el carrito
        this.contenedorProductos.innerHTML = this.productos.map(item => `
            <div class="cart-item d-flex align-items-center mb-3 p-3 border rounded" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image me-3">
                <div class="cart-item-details flex-grow-1">
                    <h5 class="cart-item-title">${item.name}</h5>
                    <p class="cart-item-price mb-1">$${(item.price * item.quantity).toFixed(2)}</p>
                    <div class="quantity-controls">
                        <button class="btn btn-sm btn-outline-secondary quantity-decrease">-</button>
                        <input type="number" class="form-control d-inline-block mx-2" value="${item.quantity}" readonly>
                        <button class="btn btn-sm btn-outline-secondary quantity-increase">+</button>
                    </div>
                </div>
                <button class="btn btn-link text-danger remove-item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }

    // Guarda el estado del carrito en localStorage
    guardarCarritoEnLocal() {
        localStorage.setItem('cart', JSON.stringify(this.productos));
    }

    // Carga el carrito desde localStorage
    cargarCarritoDeLocal(){
        try {
            const carritoGuardado = localStorage.getItem('cart');
            this.productos = carritoGuardado ? JSON.parse(carritoGuardado) : [];
            if (this.productos.length === 0) return;
            this.renderizarCarrito();
            this.calcularTotales();
            console.log('Carrito cargado desde localStorage:', this.productos);
        } catch (error) {
            console.error('Error al cargar el carrito desde localStorage:', error);
        }
    }

    // Carga el carrito desde Supabase o localStorage como fallback
    async cargarCarritoDeSupabase() {
        try {
            const usuario = await this.supabase.auth.getUser();
            if (usuario.data?.user) {
                const { data, error } = await this.supabase
                    .from('shopping_cart')
                    .select('items')
                    .eq('user_id', usuario.data.user.id)
                    .single();

                if (error) throw error;
                if (data?.items) {
                    this.productos = data.items;
                }
            } else {
                this.cargarCarritoDeLocal();
            }
        } catch (error) {
            console.error('Error al cargar el carrito de Supabase:', error);
            this.cargarCarritoDeLocal();
        }
        if (this.productos.length === 0) return;
        this.renderizarCarrito();
        this.calcularTotales();
    }

    // Maneja la lógica de aplicación de cupones de descuento
    aplicarCupon() {
        const codigoCupon = this.inputCupon?.value.trim();
        if (!codigoCupon) {
            alert('Por favor ingrese un código de cupón');
            return;
        }

        alert('Funcionalidad de cupones en desarrollo');
    }

    // Procesa el pago y crea la orden en Supabase
    async procesarPago() {
        if (this.productos.length === 0) {
            alert('Su carrito está vacío');
            return;
        }

        try {
            const usuario = await this.supabase.auth.getUser();
            if (!usuario.data?.user) {
                alert('Por favor inicie sesión para continuar con la compra');
                window.location.href = '/login.html';
                return;
            }

            // Crea la orden en Supabase
            const { data, error } = await this.supabase
                .from('orders')
                .insert({
                    user_id: usuario.data.user.id,
                    items: this.productos,
                    total: this.calcularTotal(),
                    status: 'pending'
                })
                .select()
                .single();

            if (error) throw error;

            // Limpia el carrito y redirige al checkout
            this.productos = [];
            await this.actualizarCarrito();

            window.location.href = `/checkout.html?order_id=${data.id}`;
        } catch (error) {
            console.error('Error durante el checkout:', error);
            alert('Ha ocurrido un error durante el proceso de pago');
        }
    }

    // Calcula el total final incluyendo subtotal, envío e impuestos
    calcularTotal() {
        const subtotal = this.productos.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const envio = subtotal > 0 ? 5.00 : 0;
        const impuesto = subtotal * 0.19;
        return subtotal + envio + impuesto;
    }
}

// Inicializa el carrito cuando el DOM está completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    const carrito = new CarritoCompras();
});