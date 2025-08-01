import Category from './Category.js';
import Subcategory from './Subcategory.js';
import Project from './Project.js';
import BlogPost from './BlogPost.js';
import User from './User.js';
import Subscriber from './Subscriber.js';

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

  console.log('✅ Asociaciones de modelos definidas');
}