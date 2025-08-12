import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize.js';

class Project extends Model {}

Project.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      len: [5, 200]
    }
  },
  description: {
    type: DataTypes.TEXT(1500),
    validate: {
      len: [0, 1500]
    }
  },
  slug: {
  type: DataTypes.STRING(220),
  allowNull: false,
  unique: true,
  validate: {
    notEmpty: true,
    len: [3, 220]
  }
},
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 2000,
      max: new Date().getFullYear() + 5
    }
  },
  location: {
    type: DataTypes.STRING(200),
  },
  client: {
    type: DataTypes.STRING(150),
  },
  architect: {
    type: DataTypes.STRING(150),
  },
  // Tipo de participación
  projectType: {
  type: DataTypes.ENUM('Preproyecto', 'Proyecto', 'Dirección'),
  allowNull: false, // ✅ CAMBIAR: ahora es requerido
  validate: {
    notEmpty: true,
    isIn: [['Preproyecto', 'Proyecto', 'Dirección']]
  }
},
  // Estado del proyecto
  status: {
    type: DataTypes.ENUM('render', 'obra', 'finalizado' ),
    defaultValue: 'render',
  },
  area: {
    type: DataTypes.STRING(50),
  },
  // Contenido del proyecto
  content: {
    type: DataTypes.TEXT(5000),
    validate: {
      len: [0, 5000]
    }
  },
  // Imágenes
  
  // Tags como ENUM - puedes ajustar según tus necesidades
  tags: {
    type: DataTypes.ARRAY(DataTypes.ENUM([
      'residencial',
      'comercial', 
      'industrial',
      'piscinas',
      'restaurantes',
      'hoteles',
      'oficinas',
      'moderno',
      'clasico',
      'minimalista',
      'sustentable',
      'lujo',
      'economico',
      'reforma',
      'construccion_nueva'
    ])),
    defaultValue: []
  },
  searchableText: {
    type: DataTypes.TEXT,
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  startDate: {
    type: DataTypes.DATE,
  },
  endDate: {
    type: DataTypes.DATE,
  },
}, {
  sequelize,
  modelName: 'Project',
 hooks: {
  beforeSave: async (project, options) => {
    // ✅ Auto-generar slug SOLO si no existe
    if (!project.slug && project.title && project.year) {
      const baseSlug = `${project.title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')}-${project.year}`;
      
      // ✅ Verificar si el slug ya existe
      let finalSlug = baseSlug;
      let counter = 1;
      
      while (true) {
        const existingProject = await Project.findOne({
          where: {
            slug: finalSlug,
            id: { [DataTypes.Op.ne]: project.id || 0 } // Excluir el proyecto actual si es update
          }
        });
        
        if (!existingProject) break;
        
        finalSlug = `${baseSlug}-${counter}`;
        counter++;
      }
      
      project.slug = finalSlug;
    }
    
    // ✅ Generar searchableText
    const tagsText = project.tags ? project.tags.join(' ') : '';
    
    project.searchableText = `${project.title || ''} ${project.description || ''} ${project.content || ''} ${project.location || ''} ${project.client || ''} ${project.architect || ''} ${tagsText} ${project.year || ''}`.toLowerCase();
  }
},
  indexes: [
    {
      fields: ['slug']
    },
    {
      fields: ['year']
    },
    {
      fields: ['projectType']
    },
    {
      fields: ['status']
    },
    {
      fields: ['searchableText']  // Índice simple
    },
    {
      fields: ['isActive']
    },
    {
      fields: ['isFeatured']
    },
    {
      fields: ['isPublic']
    }
  ]
});

Project.prototype.getMainImage = function() {
  return this.media?.find(m => m.isMain && m.isActive) || this.media?.[0];
};

Project.prototype.getMediaByType = function(type) {
  return (this.media || []).filter(m => m.type === type && m.isActive)
    .sort((a, b) => a.order - b.order);
};

Project.prototype.getRenders = function() {
  return this.getMediaByType('render');
};

Project.prototype.getPlanos = function() {
  return this.getMediaByType('plano');
};

Project.prototype.getVideos = function() {
  return this.getMediaByType('video');
};

Project.prototype.getObraProceso = function() {
  return this.getMediaByType('obra_proceso');
};

Project.prototype.getObraFinalizada = function() {
  return this.getMediaByType('obra_finalizada');
};

export default Project;