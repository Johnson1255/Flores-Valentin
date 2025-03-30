// Script para administrar productos en Supabase
import { supabase } from './supabase.js';
import { signIn } from './auth.js';

// Función para verificar si el usuario tiene rol de admin
const checkAdminRole = async () => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            throw new Error("Usuario no autenticado");
        }
        
        // Obtener los metadatos del usuario que incluyen el rol
        const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
            
        if (error) {
            throw error;
        }
        
        if (!data || data.role !== 'admin') {
            throw new Error("Acceso denegado: Se requiere rol de administrador");
        }
        
        return true;
    } catch (error) {
        console.error('Error al verificar rol:', error);
        throw error;
    }
};

// Función para insertar un producto en Supabase
const insertProduct = async (product) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .insert(product);
        
        if (error) {
            throw error;
        }
        
        console.log(`Producto insertado: ${product.name}`);
        return true;
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
};

// Función para eliminar un producto de Supabase por ID
const deleteProduct = async (productId) => {
    try {
        const { data, error } = await supabase
            .from('products')
            .delete()
            .eq('id', productId);
        
        if (error) {
            throw error;
        }
        
        console.log(`Producto eliminado con ID: ${productId}`);
        return true;
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        return false;
    }
};

// Función para obtener todos los productos
const getProducts = async () => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            throw error;
        }
        
        return data;
    } catch (error) {
        console.error('Error al obtener productos:', error);
        throw error;
    }
};

// Datos para generar productos
const productData = {
    // Flores
    flowers: {
        names: ['Rosas', 'Tulipanes', 'Girasoles', 'Lirios', 'Orquídeas', 'Claveles', 'Margaritas', 'Gerberas', 'Peonías', 'Crisantemos'],
        prefixes: ['Ramo de', 'Bouquet de', 'Arreglo de', 'Centro de', 'Canasta de'],
        descriptions: [
            'Hermoso arreglo perfecto para expresar amor y pasión.',
            'Flores frescas importadas con vibrantes colores.',
            'Elegante arreglo para ocasiones especiales y celebraciones.',
            'Flores radiantes que alegran cualquier espacio del hogar.',
            'Símbolo de pureza y elegancia, ideales como regalo.'
        ],
        imageUrls: [
            'https://picsum.photos/id/152/800/600', // Flores rosas
            'https://picsum.photos/id/106/800/600', // Tulipanes
            'https://picsum.photos/id/334/800/600', // Flores de campo
            'https://picsum.photos/id/292/800/600', // Flor de cerca
            'https://picsum.photos/id/130/800/600'  // Flores varias
        ]
    },
    
    // Chocolates
    chocolates: {
        names: ['Trufas', 'Bombones', 'Pralinés', 'Chocolate Belga', 'Chocolate Suizo', 'Chocolate Artesanal', 'Chocolate con Licor'],
        prefixes: ['Caja de', 'Selección de', 'Surtido de', 'Colección de', 'Assortment de'],
        descriptions: [
            'Deliciosos chocolates hechos con los mejores ingredientes.',
            'Exquisita selección de chocolates para los paladares más exigentes.',
            'Chocolates artesanales con recetas tradicionales.',
            'Dulce tentación para sorprender a tu ser querido.',
            'Finos chocolates elaborados por maestros chocolateros.'
        ],
        imageUrls: [
            'https://picsum.photos/id/132/800/600', // Helado de chocolate
            'https://picsum.photos/id/766/800/600', // Chocolate caliente
            'https://picsum.photos/id/301/800/600', // Postre de chocolate
            'https://picsum.photos/id/614/800/600', // Postre oscuro
            'https://picsum.photos/id/1080/800/600' // Tarta oscura
        ]
    },
    
    // Peluches
    plushies: {
        names: ['Oso de Peluche', 'Conejo de Peluche', 'Unicornio de Peluche', 'Panda de Peluche', 'Perrito de Peluche', 'Gatito de Peluche'],
        prefixes: ['', 'Adorable', 'Tierno', 'Suave', 'Dulce'],
        descriptions: [
            'Tierno peluche perfecto para demostrar tu cariño.',
            'Suave y adorable compañero para regalar en ocasiones especiales.',
            'Peluche de alta calidad con materiales hipoalergénicos.',
            'Un clásico regalo que nunca pasa de moda.',
            'Detalles únicos que hacen de este peluche un regalo especial.'
        ],
        imageUrls: [
            'https://picsum.photos/id/659/800/600', // Figura de plástico
            'https://picsum.photos/id/837/800/600', // Conejo de fieltro
            'https://picsum.photos/id/30/800/600',  // Juguete de madera
            'https://picsum.photos/id/830/800/600', // Figura de diseño
            'https://picsum.photos/id/1074/800/600' // Figura de origami
        ]
    },
    
    // Otros regalos
    gifts: {
        names: ['Tarjeta Personalizada', 'Velas Aromáticas', 'Joyería', 'Perfume', 'Set de Vinos', 'Set de Spa', 'Globos'],
        prefixes: ['', 'Set de', 'Colección de', 'Kit de', 'Paquete de'],
        descriptions: [
            'Regalo perfecto para complementar cualquier detalle.',
            'Artículo único para hacer tu regalo más especial.',
            'Detalle elegante que siempre es bien recibido.',
            'Complemento ideal para sorprender a esa persona especial.',
            'Artículo de calidad para demostrar tus sentimientos.'
        ],
        imageUrls: [
            'https://picsum.photos/id/91/800/600',  // Carta vintage
            'https://picsum.photos/id/388/800/600', // Velas
            'https://picsum.photos/id/152/800/600', // Flores decorativas
            'https://picsum.photos/id/607/800/600', // Botella decorativa
            'https://picsum.photos/id/1060/800/600' // Decoración de mesa
        ]
    }
};

// Función para generar precio aleatorio
const randomPrice = (min, max) => {
    return (Math.random() * (max - min) + min).toFixed(2);
};

// Función para generar stock aleatorio
const randomStock = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Función para obtener un elemento aleatorio de un array
const getRandomItem = (array) => {
    return array[Math.floor(Math.random() * array.length)];
};

// Función para generar 100 productos variados
const generateProducts = () => {
    const products = [];
    
    // Generar 40 flores
    for (let i = 0; i < 40; i++) {
        const flowerType = getRandomItem(productData.flowers.names);
        const prefix = getRandomItem(productData.flowers.prefixes);
        const description = getRandomItem(productData.flowers.descriptions);
        const imageUrl = getRandomItem(productData.flowers.imageUrls);
        
        products.push({
            name: `${prefix} ${flowerType}`,
            description: description,
            price: randomPrice(20000, 100000),
            category: 'Flores',
            image_url: imageUrl,
            stock: randomStock(5, 50)
        });
    }
    
    // Generar 25 chocolates
    for (let i = 0; i < 25; i++) {
        const chocolateType = getRandomItem(productData.chocolates.names);
        const prefix = getRandomItem(productData.chocolates.prefixes);
        const description = getRandomItem(productData.chocolates.descriptions);
        const imageUrl = getRandomItem(productData.chocolates.imageUrls);
        
        products.push({
            name: `${prefix} ${chocolateType}`,
            description: description,
            price: randomPrice(15000, 80000),
            category: 'Chocolates',
            image_url: imageUrl,
            stock: randomStock(10, 100)
        });
    }
    
    // Generar 20 peluches
    for (let i = 0; i < 20; i++) {
        const plushieType = getRandomItem(productData.plushies.names);
        const prefix = getRandomItem(productData.plushies.prefixes);
        const description = getRandomItem(productData.plushies.descriptions);
        const imageUrl = getRandomItem(productData.plushies.imageUrls);
        
        products.push({
            name: prefix ? `${prefix} ${plushieType}` : plushieType,
            description: description,
            price: randomPrice(25000, 70000),
            category: 'Peluches',
            image_url: imageUrl,
            stock: randomStock(8, 40)
        });
    }
    
    // Generar 15 otros regalos
    for (let i = 0; i < 15; i++) {
        const giftType = getRandomItem(productData.gifts.names);
        const prefix = getRandomItem(productData.gifts.prefixes);
        const description = getRandomItem(productData.gifts.descriptions);
        const imageUrl = getRandomItem(productData.gifts.imageUrls);
        
        products.push({
            name: prefix ? `${prefix} ${giftType}` : giftType,
            description: description,
            price: randomPrice(10000, 120000),
            category: 'Regalos',
            image_url: imageUrl,
            stock: randomStock(5, 30)
        });
    }
    
    return products;
};

// Función principal para insertar 100 productos
const insertProducts = async (email, password) => {
    try {
        // Iniciar sesión si se proporcionan credenciales
        if (email && password) {
            const { data, error } = await signIn(email, password);
            if (error) {
                throw new Error("Error al iniciar sesión: " + error.message);
            }
            console.log("Sesión iniciada correctamente");
        }
        
        // Verificar que el usuario tiene rol de admin
        await checkAdminRole();
        console.log("Verificación de rol de administrador completada");
        
        const products = generateProducts();
        
        console.log(`Generados ${products.length} productos para insertar...`);
        
        let successCount = 0;
        for (const product of products) {
            const success = await insertProduct(product);
            if (success) successCount++;
            
            // Pequeña pausa para no sobrecargar la API
            await new Promise(resolve => setTimeout(resolve, 300));
        }
        
        console.log(`Inserción completada. ${successCount} productos insertados con éxito.`);
        return successCount;
    } catch (error) {
        console.error("Error en la inserción de productos:", error);
        throw error; // Propagar el error para manejarlo en la interfaz
    }
};

// Exportar las funciones para poder usarlas desde otro archivo
export { insertProducts, deleteProduct, getProducts };