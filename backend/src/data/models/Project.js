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
    // Ejemplo: "casa-moderna-2024"
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
    type: DataTypes.ENUM('arquitectura', 'obra', 'completo'),
    allowNull: false,
  },
  // Estado del proyecto
  status: {
    type: DataTypes.ENUM('planificacion', 'en_proceso', 'finalizado', 'pausado'),
    defaultValue: 'planificacion',
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
  featuredImage: {
    type: DataTypes.JSON,
  },
  images: {
    type: DataTypes.JSON,
  },
  videos: {
    type: DataTypes.JSON,
  },
  documents: {
    type: DataTypes.JSON,
  },
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
    beforeSave: (project, options) => {
      // Auto-generar slug
      if (!project.slug && project.title) {
        project.slug = project.title
          .toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .replace(/\s+/g, '-');
      }
      
      // Generar searchableText
      const tagsText = project.tags ? project.tags.join(' ') : '';
      
      project.searchableText = `${project.title} ${project.description || ''} ${project.content || ''} ${project.location || ''} ${project.client || ''} ${project.architect || ''} ${tagsText} ${project.year}`.toLowerCase();
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

export default Project;