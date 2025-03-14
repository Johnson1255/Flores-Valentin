import { supabase } from './supabase.js';

const flowerTypes = [
  'Rosa', 'Tulipán', 'Lirio', 'Margarita', 'Girasol', 'Orquídea', 'Clavel', 
  'Narciso', 'Dalia', 'Crisantemo', 'Azucena', 'Gardenia', 'Peonia', 'Hortensia', 
  'Gladiolo', 'Jazmín', 'Amapola', 'Geranio', 'Begonia', 'Hibisco'
];

const colors = [
  'Rojo', 'Amarillo', 'Rosa', 'Blanco', 'Naranja', 'Púrpura', 'Azul', 
  'Lavanda', 'Coral', 'Fucsia'
];

const categories = [
  'Cumpleaños', 'Aniversario', 'Boda', 'Graduación', 'Condolencia',
  'Románticas', 'Decorativas', 'Exóticas', 'Temporada', 'Premium'
];

function getRandomPrice(min, max) {
  return (Math.random() * (max - min) + min).toFixed(2);
}

function getRandomStock() {
  return Math.floor(Math.random() * 50) + 5;
}

async function seedFlowers() {
  try {
    const flowers = [];
    
    // Generar 100 flores
    for (let i = 0; i < 100; i++) {
      const flowerType = flowerTypes[Math.floor(Math.random() * flowerTypes.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const category = categories[Math.floor(Math.random() * categories.length)];
      
      flowers.push({
        name: `${color} ${flowerType}`,
        description: `Hermoso arreglo de ${flowerType} de color ${color}, perfecto para cualquier ocasión.`,
        price: parseFloat(getRandomPrice(20, 150)),
        category,
        image_url: `/images/placeholder-${(i % 10) + 1}.jpg`, // Usar imágenes de placeholder
        stock: getRandomStock()
      });
    }
    
    // Insertar en la base de datos de Supabase
    const { data, error } = await supabase
      .from('flowers')
      .insert(flowers)
      .select();
    
    if (error) throw error;
    
    console.log(`Se han agregado ${data.length} flores a la base de datos.`);
    
  } catch (error) {
    console.error('Error al poblar la base de datos:', error);
  }
}

// Ejecutar el script
seedFlowers();