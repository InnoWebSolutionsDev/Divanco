import Category from './Category.js';
import Subcategory from './Subcategory.js';
import Project from './Project.js';
import BlogPost from './BlogPost.js';
import User from './User.js';
import Subscriber from './Subscriber.js';
import MediaFile from './MediaFile.js'; // ✅ Nuevo import

// Definir todas las relaciones aquí
export function defineAssociations() {
  // Relaciones Showroom
  Category.hasMany(Subcategory, { 
    foreignKey: 'categoryId', 
    as: 'subcategories',
    onDelete: 'CASCADE'
  });
  
  Subcategory.belongsTo(Category, { 
    foreignKey: 'categoryId', 
    as: 'category' 
  });

  // Relaciones Blog
  User.hasMany(BlogPost, { 
    foreignKey: 'authorId', 
    as: 'blogPosts',
    onDelete: 'SET NULL'
  });
  
  BlogPost.belongsTo(User, { 
    foreignKey: 'authorId', 
    as: 'author' 
  });

  // Relación Blog con Proyectos (opcional)
  Project.hasMany(BlogPost, { 
    foreignKey: 'projectId', 
    as: 'blogPosts',
    onDelete: 'SET NULL'
  });
  
  BlogPost.belongsTo(Project, { 
    foreignKey: 'projectId', 
    as: 'project' 
  });

  // ✅ Nuevas relaciones para MediaFiles
  Project.hasMany(MediaFile, {
    foreignKey: 'projectId',
    as: 'media',
    onDelete: 'CASCADE' // Si se elimina el proyecto, se eliminan todos sus archivos
  });

  MediaFile.belongsTo(Project, {
    foreignKey: 'projectId',
    as: 'project'
  });

  

 
}