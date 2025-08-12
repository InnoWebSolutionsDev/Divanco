import sequelize from '../config/sequelize.js';

// Importar todos los modelos
import User from './User.js';
import Category from './Category.js';
import Subcategory from './Subcategory.js';
import Project from './Project.js';
import BlogPost from './BlogPost.js';
import Subscriber from './Subscriber.js';
import MediaFile from './MediaFile.js';

// Importar y ejecutar asociaciones
import { defineAssociations } from './associations.js';

// Definir las asociaciones
defineAssociations();

// Exportar todo
export {
  sequelize,
  User,
  Category,
  Subcategory,
  Project,
  BlogPost,
  Subscriber,
  MediaFile

};

// Función para sincronizar todos los modelos
export async function syncAllModels(force = false) {
  try {
    console.log('🔧 Sincronizando modelos con la base de datos...');
    
    if (force) {
      console.log('⚠️  MODO DESARROLLO: Recreando todas las tablas');
      
      // Eliminar tablas en orden inverso para evitar conflictos de FK
      console.log('🗑️  Eliminando tablas existentes...');

      const tablesToDrop = ['BlogPosts', 'Subcategories', 'Projects', 'Subscribers', 'Categories', 'Users', 'MediaFiles'];

      for (const tableName of tablesToDrop) {
        try {
          await sequelize.queryInterface.dropTable(tableName, { cascade: true });
          console.log(`✅ Tabla ${tableName} eliminada`);
        } catch (dropError) {
          console.log(`ℹ️  Tabla ${tableName} no existía`);
        }
      }
    }

    // Sincronizar modelos en orden correcto
    console.log('🔄 Creando tablas en orden...');
    
    // 1. Tablas independientes primero
    await User.sync({ force: false });
    console.log('✅ Tabla Users creada');
    
    await Category.sync({ force: false });
    console.log('✅ Tabla Categories creada');
    
    await Subscriber.sync({ force: false });
    console.log('✅ Tabla Subscribers creada');
    
    await Project.sync({ force: false });
    console.log('✅ Tabla Projects creada');
    
    // 2. Tablas con dependencias
    await Subcategory.sync({ force: false });
    console.log('✅ Tabla Subcategories creada');
    
    await BlogPost.sync({ force: false });
    console.log('✅ Tabla BlogPosts creada');

    await MediaFile.sync({ force: false });
    console.log('✅ Tabla MediaFiles creada');

    console.log('✅ Todos los modelos sincronizados exitosamente');
    return true;
  } catch (error) {
    console.error('❌ Error al sincronizar modelos:', error.message);
    
    // Si hay error, intentar con sequelize.sync normal
    try {
      console.log('🔄 Intentando sincronización automática...');
      await sequelize.sync({ force: force });
      console.log('✅ Sincronización automática exitosa');
      return true;
    } catch (fallbackError) {
      console.error('❌ Error en sincronización automática:', fallbackError.message);
      console.error('💡 Sugerencia: Verifica que la base de datos PostgreSQL esté ejecutándose');
      throw error;
    }
  }
}

export default {
  sequelize,
  User,
  Category,
  Subcategory,
  Project,
  BlogPost,
  Subscriber,
  syncAllModels, 
  MediaFile
};
