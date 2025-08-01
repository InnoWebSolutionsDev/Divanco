import { Project, BlogPost, User } from '../data/models/index.js';
import { uploadResponsiveImage, deleteResponsiveImages } from '../config/cloudinary.js';
import { Op } from 'sequelize';

// Obtener todos los proyectos
export const getAllProjects = async (req, res) => {
  try {
    const { 
      year, 
      projectType, 
      status,
      featured = false,
      publicOnly = true,
      tags,
      limit = 12,
      page = 1
    } = req.query;

    const whereClause = {};
    
    if (publicOnly === 'true') whereClause.isPublic = true;
    if (year) whereClause.year = year;
    if (projectType) whereClause.projectType = projectType;
    if (status) whereClause.status = status;
    if (featured === 'true') whereClause.isFeatured = true;
    if (tags) {
      // Buscar proyectos que contengan cualquiera de los tags
      const tagsArray = tags.split(',');
      whereClause.tags = {
        [Op.overlap]: tagsArray
      };
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: projects } = await Project.findAndCountAll({
      where: whereClause,
      order: [
        ['isFeatured', 'DESC'],
        ['year', 'DESC'], 
        ['updatedAt', 'DESC']
      ],
      limit: parseInt(limit),
      offset: offset
    });

    res.json({
      success: true,
      data: projects,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(count / parseInt(limit)),
        total_items: count,
        items_per_page: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error obteniendo proyectos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener proyectos por año
export const getProjectsByYear = async (req, res) => {
  try {
    const { year } = req.params;

    const projects = await Project.findAll({
      where: { 
        year: parseInt(year),
        isPublic: true,
        isActive: true
      },
      order: [['isFeatured', 'DESC'], ['updatedAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        year: parseInt(year),
        projects: projects,
        count: projects.length
      }
    });
  } catch (error) {
    console.error('Error obteniendo proyectos por año:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener años disponibles
export const getAvailableYears = async (req, res) => {
  try {
    const years = await Project.findAll({
      where: {
        isPublic: true,
        isActive: true
      },
      attributes: ['year'],
      group: ['year'],
      order: [['year', 'DESC']]
    });

    const yearsList = years.map(project => project.year);

    res.json({
      success: true,
      data: yearsList
    });
  } catch (error) {
    console.error('Error obteniendo años:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener proyecto por slug
export const getProjectBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const project = await Project.findOne({
      where: { slug, isPublic: true, isActive: true },
      include: [{
        model: BlogPost,
        as: 'blogPosts',
        where: { status: 'published' },
        required: false,
        include: [{
          model: User,
          as: 'author',
          attributes: ['id', 'name']
        }],
        order: [['publishedAt', 'DESC']]
      }]
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Proyecto no encontrado'
      });
    }

    // Incrementar contador de vistas
    await project.increment('viewCount');

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error obteniendo proyecto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Crear nuevo proyecto
export const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      content,
      year,
      location,
      client,
      architect,
      projectType,
      status = 'planificacion',
      area,
      tags = [],
      isFeatured = false,
      isPublic = true,
      order = 0,
      startDate,
      endDate
    } = req.body;

    // Validaciones básicas
    if (!title || title.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: 'El título es requerido y debe tener al menos 5 caracteres'
      });
    }

    if (!year || year < 2000) {
      return res.status(400).json({
        success: false,
        message: 'El año es requerido y debe ser válido'
      });
    }

    if (!projectType || !['arquitectura', 'obra', 'completo'].includes(projectType)) {
      return res.status(400).json({
        success: false,
        message: 'El tipo de proyecto es requerido y debe ser válido'
      });
    }

    // Crear el proyecto
    const projectData = {
      title: title.trim(),
      description: description?.trim(),
      content: content?.trim(),
      year: parseInt(year),
      location: location?.trim(),
      client: client?.trim(),
      architect: architect?.trim(),
      projectType,
      status,
      area: area?.trim(),
      tags: Array.isArray(tags) ? tags : [],
      isFeatured: Boolean(isFeatured),
      isPublic: Boolean(isPublic),
      order: parseInt(order),
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null
    };

    const project = await Project.create(projectData);

    res.status(201).json({
      success: true,
      message: 'Proyecto creado exitosamente',
      data: project
    });
  } catch (error) {
    console.error('Error creando proyecto:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un proyecto con ese título'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Actualizar proyecto
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const project = await Project.findByPk(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Proyecto no encontrado'
      });
    }

    await project.update(updateData);

    res.json({
      success: true,
      message: 'Proyecto actualizado exitosamente',
      data: project
    });
  } catch (error) {
    console.error('Error actualizando proyecto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Subir imagen para proyecto
export const uploadProjectImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { type = 'featured' } = req.body; // 'featured' o 'gallery'
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionó ningún archivo'
      });
    }

    const project = await Project.findByPk(id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Proyecto no encontrado'
      });
    }

    // Subir imagen
    const folder = `projects/${project.year}/${project.slug}`;
    const images = await uploadResponsiveImage(req.file.path, folder);

    let updateData = {};

    if (type === 'featured') {
      // Eliminar imagen anterior si existe
      if (project.featuredImage) {
        try {
          await deleteResponsiveImages(project.featuredImage);
        } catch (deleteError) {
          console.warn('Error eliminando imagen anterior:', deleteError);
        }
      }
      updateData.featuredImage = images;
    } else if (type === 'gallery') {
      // Agregar a la galería
      const currentImages = project.images || [];
      updateData.images = [...currentImages, images];
    }

    // Actualizar proyecto
    await project.update(updateData);

    res.json({
      success: true,
      message: 'Imagen subida exitosamente',
      data: {
        project: project,
        newImages: images
      }
    });
  } catch (error) {
    console.error('Error subiendo imagen:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Eliminar proyecto (soft delete)
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findByPk(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Proyecto no encontrado'
      });
    }

    // Soft delete
    await project.update({ isActive: false });

    res.json({
      success: true,
      message: 'Proyecto eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando proyecto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener proyectos destacados
export const getFeaturedProjects = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const projects = await Project.findAll({
      where: { 
        isActive: true,
        isPublic: true, 
        isFeatured: true 
      },
      order: [['order', 'ASC'], ['updatedAt', 'DESC']],
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      data: projects
    });
  } catch (error) {
    console.error('Error obteniendo proyectos destacados:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener proyectos recientes
export const getRecentProjects = async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    const projects = await Project.findAll({
      where: { 
        isActive: true,
        isPublic: true
      },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      data: projects
    });
  } catch (error) {
    console.error('Error obteniendo proyectos recientes:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};
