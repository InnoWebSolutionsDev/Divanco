require('dotenv').config();
const { Category, Subcategory, Product } = require('./models');
const seedData = require('./seedData');

// Función para generar slug desde el nombre
function generateSlug(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remover acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
    .replace(/\s+/g, '-') // Reemplazar espacios con guiones
    .replace(/-+/g, '-') // Remover guiones múltiples
    .trim();
}

async function seedDatabase() {
  try {
    console.log('🌱 Iniciando carga de datos de desarrollo...');
    
    // Limpiar datos existentes (opcional - descomenta si quieres limpiar)
    // console.log('🧹 Limpiando datos existentes...');
    // await Product.destroy({ where: {} });
    // await Subcategory.destroy({ where: {} });
    // await Category.destroy({ where: {} });
    
    for (const categoryData of seedData.categories) {
      console.log(`📁 Creando categoría: ${categoryData.name}`);
      
      // Crear categoría
      const category = await Category.create({
        name: categoryData.name,
        description: categoryData.description,
        slug: generateSlug(categoryData.name),
        isActive: categoryData.isActive,
        order: 1
      });
      
      // Crear subcategorías
      for (let i = 0; i < categoryData.subcategories.length; i++) {
        const subcategoryData = categoryData.subcategories[i];
        console.log(`  📂 Creando subcategoría: ${subcategoryData.name}`);
        
        const subcategory = await Subcategory.create({
          name: subcategoryData.name,
          description: subcategoryData.description,
          slug: generateSlug(subcategoryData.name),
          categoryId: category.id,
          isActive: true,
          order: i + 1
        });
        
        // Crear productos para esta subcategoría
        const products = seedData.products[categoryData.name];
        for (let j = 0; j < products.length; j++) {
          const productData = products[j];
          console.log(`    📦 Creando producto: ${productData.name}`);
          
          await Product.create({
            name: productData.name,
            description: productData.description,
            slug: generateSlug(productData.name),
            price: productData.price,
            currency: 'COP',
            stock: productData.stock,
            subcategoryId: subcategory.id,
            isActive: true,
            isFeatured: j < 3, // Los primeros 3 productos son destacados
            order: j + 1,
            specifications: '{}',
            images: '[]'
          });
        }
      }
    }
    
    console.log('✅ Datos de desarrollo cargados exitosamente!');
    console.log(`📊 Resumen:`);
    console.log(`   - ${seedData.categories.length} categorías`);
    console.log(`   - ${seedData.categories.length * 3} subcategorías`);
    console.log(`   - ${seedData.categories.length * 10} productos`);
    
  } catch (error) {
    console.error('❌ Error cargando datos:', error);
  }
}

// Si el archivo se ejecuta directamente
if (require.main === module) {
  seedDatabase().then(() => {
    console.log('🏁 Proceso completado');
    process.exit(0);
  }).catch(error => {
    console.error('💥 Error en el proceso:', error);
    process.exit(1);
  });
}

module.exports = { seedDatabase };
