import { Project, BlogPost, User, MediaFile } from '../data/models/index.js';
import { uploadResponsiveImage, uploadOptimizedVideo, deleteResponsiveImages, uploadDocument } from '../config/cloudinary.js';
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
      include: [{
        model: MediaFile,
        as: 'media',
        where: { isActive: true },
        required: false,
        order: [['isMain', 'DESC'], ['order', 'ASC']]
      }],
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

export const searchProjects = async (req, res) => {
  try {
    const {
      // Filtros de búsqueda
      title,           // Búsqueda por título
      tags,           // Array de tags o string separado por comas
      location,       // Búsqueda por ubicación
      search,         // Búsqueda general en texto
      
      // Filtros adicionales
      year,
      projectType,
      status,
      client,
      architect,
      
      // Configuración de resultados
      featured = false,
      publicOnly = true,
      limit = 12,
      page = 1,
      sortBy = 'updatedAt',  // title, year, viewCount, updatedAt
      sortOrder = 'DESC'     // ASC, DESC
    } = req.query;

    const whereClause = { isActive: true };
    
    // ✅ Filtro base: solo públicos
    if (publicOnly === 'true') {
      whereClause.isPublic = true;
    }

    // ✅ Filtro: Solo destacados
    if (featured === 'true') {
      whereClause.isFeatured = true;
    }

    // ✅ Búsqueda por título (ILIKE para PostgreSQL)
    if (title) {
      whereClause.title = {
        [Op.iLike]: `%${title}%`
      };
    }

    // ✅ Búsqueda por ubicación
    if (location) {
      whereClause.location = {
        [Op.iLike]: `%${location}%`
      };
    }

    // ✅ Filtro por tags (overlap para arrays)
    if (tags) {
      let tagsArray;
      if (typeof tags === 'string') {
        tagsArray = tags.split(',').map(tag => tag.trim().toLowerCase());
      } else {
        tagsArray = tags;
      }
      
      whereClause.tags = {
        [Op.overlap]: tagsArray
      };
    }

    // ✅ Búsqueda general en texto searchable
    if (search) {
      whereClause.searchableText = {
        [Op.iLike]: `%${search.toLowerCase()}%`
      };
    }

    // ✅ Filtros específicos
    if (year) whereClause.year = year;
    if (projectType) whereClause.projectType = projectType;
    if (status) whereClause.status = status;
    if (client) {
      whereClause.client = {
        [Op.iLike]: `%${client}%`
      };
    }
    if (architect) {
      whereClause.architect = {
        [Op.iLike]: `%${architect}%`
      };
    }

    // ✅ Paginación
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // ✅ Ordenamiento dinámico
    const validSortFields = ['title', 'year', 'viewCount', 'updatedAt', 'createdAt'];
    const orderField = validSortFields.includes(sortBy) ? sortBy : 'updatedAt';
    const orderDirection = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const { count, rows: projects } = await Project.findAndCountAll({
      where: whereClause,
      include: [{
        model: MediaFile,
        as: 'media',
        where: { isActive: true },
        required: false,
        order: [['isMain', 'DESC'], ['order', 'ASC']]
      }],
      order: [
        ['isFeatured', 'DESC'], // Destacados primero siempre
        [orderField, orderDirection]
      ],
      limit: parseInt(limit),
      offset: offset,
      distinct: true // Para que count sea correcto con includes
    });

    // ✅ Estadísticas de filtros aplicados
    const appliedFilters = {
      title: title || null,
      tags: tags || null,
      location: location || null,
      search: search || null,
      year: year || null,
      projectType: projectType || null,
      status: status || null,
      client: client || null,
      architect: architect || null
    };

    res.json({
      success: true,
      data: projects,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(count / parseInt(limit)),
        total_items: count,
        items_per_page: parseInt(limit)
      },
      filters: {
        applied: appliedFilters,
        active_filters_count: Object.values(appliedFilters).filter(v => v !== null).length
      },
      sorting: {
        sort_by: orderField,
        sort_order: orderDirection
      }
    });

  } catch (error) {
    console.error('Error buscando proyectos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// ✅ NUEVA: Obtener opciones disponibles para filtros
export const getFilterOptions = async (req, res) => {
  try {
    // Obtener años únicos
    const years = await Project.findAll({
      attributes: ['year'],
      where: { isActive: true, isPublic: true },
      group: ['year'],
      order: [['year', 'DESC']]
    });

    // Obtener ubicaciones únicas
    const locations = await Project.findAll({
      attributes: ['location'],
      where: { 
        isActive: true, 
        isPublic: true,
        location: { [Op.ne]: null }
      },
      group: ['location'],
      order: [['location', 'ASC']]
    });

    // Obtener todos los tags únicos
    const projectsWithTags = await Project.findAll({
      attributes: ['tags'],
      where: { 
        isActive: true, 
        isPublic: true,
        tags: { [Op.ne]: [] }
      }
    });

    // Extraer tags únicos
    const allTags = new Set();
    projectsWithTags.forEach(project => {
      if (project.tags && Array.isArray(project.tags)) {
        project.tags.forEach(tag => allTags.add(tag));
      }
    });

    // Obtener tipos de proyecto únicos
    const projectTypes = await Project.findAll({
      attributes: ['projectType'],
      where: { isActive: true, isPublic: true },
      group: ['projectType'],
      order: [['projectType', 'ASC']]
    });

    // Obtener estados únicos
    const statuses = await Project.findAll({
      attributes: ['status'],
      where: { isActive: true, isPublic: true },
      group: ['status'],
      order: [['status', 'ASC']]
    });

    res.json({
      success: true,
      data: {
        years: years.map(y => y.year),
        locations: locations.map(l => l.location).filter(Boolean),
        tags: Array.from(allTags).sort(),
        project_types: projectTypes.map(p => p.projectType),
        statuses: statuses.map(s => s.status),
        sort_options: [
          { value: 'updatedAt', label: 'Más Recientes' },
          { value: 'title', label: 'Título A-Z' },
          { value: 'year', label: 'Año' },
          { value: 'viewCount', label: 'Más Vistos' }
        ]
      }
    });

  } catch (error) {
    console.error('Error obteniendo opciones de filtro:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// ✅ NUEVA: Búsqueda con sugerencias
export const getSearchSuggestions = async (req, res) => {
  try {
    const { query, type = 'all' } = req.query;

    if (!query || query.length < 2) {
      return res.json({
        success: true,
        data: {
          titles: [],
          locations: [],
          tags: [],
          clients: [],
          architects: []
        }
      });
    }

    const searchTerm = query.toLowerCase();
    const suggestions = {};

    // Sugerencias de títulos
    if (type === 'all' || type === 'title') {
      const titles = await Project.findAll({
        attributes: ['title'],
        where: {
          isActive: true,
          isPublic: true,
          title: { [Op.iLike]: `%${searchTerm}%` }
        },
        limit: 5,
        order: [['title', 'ASC']]
      });
      suggestions.titles = titles.map(p => p.title);
    }

    // Sugerencias de ubicaciones
    if (type === 'all' || type === 'location') {
      const locations = await Project.findAll({
        attributes: ['location'],
        where: {
          isActive: true,
          isPublic: true,
          location: { 
            [Op.and]: [
              { [Op.ne]: null },
              { [Op.iLike]: `%${searchTerm}%` }
            ]
          }
        },
        group: ['location'],
        limit: 5,
        order: [['location', 'ASC']]
      });
      suggestions.locations = locations.map(p => p.location);
    }

    // Sugerencias de tags
    if (type === 'all' || type === 'tags') {
      const projectsWithTags = await Project.findAll({
        attributes: ['tags'],
        where: { 
          isActive: true, 
          isPublic: true,
          tags: { [Op.ne]: [] }
        }
      });

      const matchingTags = new Set();
      projectsWithTags.forEach(project => {
        if (project.tags && Array.isArray(project.tags)) {
          project.tags.forEach(tag => {
            if (tag.toLowerCase().includes(searchTerm)) {
              matchingTags.add(tag);
            }
          });
        }
      });
      suggestions.tags = Array.from(matchingTags).slice(0, 5).sort();
    }

    // Sugerencias de clientes
    if (type === 'all' || type === 'client') {
      const clients = await Project.findAll({
        attributes: ['client'],
        where: {
          isActive: true,
          isPublic: true,
          client: { 
            [Op.and]: [
              { [Op.ne]: null },
              { [Op.iLike]: `%${searchTerm}%` }
            ]
          }
        },
        group: ['client'],
        limit: 5,
        order: [['client', 'ASC']]
      });
      suggestions.clients = clients.map(p => p.client);
    }

    res.json({
      success: true,
      data: suggestions
    });

  } catch (error) {
    console.error('Error obteniendo sugerencias:', error);
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
      include: [{
        model: MediaFile,
        as: 'media',
        where: { isActive: true },
        required: false,
        order: [['isMain', 'DESC'], ['order', 'ASC']]
      }],
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
      include: [
        {
          model: MediaFile,
          as: 'media',
          where: { isActive: true },
          required: false,
          order: [['isMain', 'DESC'], ['order', 'ASC']]
        },
        {
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
        }
      ]
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Proyecto no encontrado'
      });
    }

    // Incrementar contador de vistas
    await project.increment('viewCount');

    // Organizar media por tipos
    const mediaByType = {
      renders: project.media?.filter(m => m.type === 'render') || [],
      planos: project.media?.filter(m => m.type === 'plano') || [],
      videos: project.media?.filter(m => m.type === 'video') || [],
      obra_proceso: project.media?.filter(m => m.type === 'obra_proceso') || [],
      obra_finalizada: project.media?.filter(m => m.type === 'obra_finalizada') || [],
      otros: project.media?.filter(m => m.type === 'otro') || []
    };

    res.json({
      success: true,
      data: {
        ...project.toJSON(),
        mediaByType
      }
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
    // ✅ LOG 1: Ver qué datos llegan
    console.log('=== CREATE PROJECT DEBUG ===');
    console.log('1. Body recibido:', JSON.stringify(req.body, null, 2));
    console.log('2. Headers:', req.headers['content-type']);

    const {
      title,
      description,
      content,
      year,
      location,
      client,
      architect,
      projectType,
      status = 'render',
      area,
      tags = [],
      isFeatured = false,
      isPublic = true,
      order = 0,
      startDate,
      endDate
    } = req.body;

    // ✅ LOG 2: Ver valores después de destructuring
    console.log('3. Valores destructurados:');
    console.log('   - title:', title, '(tipo:', typeof title, ')');
    console.log('   - year:', year, '(tipo:', typeof year, ')');
    console.log('   - projectType:', projectType, '(tipo:', typeof projectType, ')');
    console.log('   - tags:', tags, '(tipo:', typeof tags, ', es array:', Array.isArray(tags), ')');

    // Validaciones básicas
    if (!title || title.trim().length < 5) {
      console.log('❌ ERROR: Título inválido');
      console.log('   - title existe:', !!title);
      console.log('   - title después de trim:', title?.trim());
      console.log('   - longitud:', title?.trim().length);
      
      return res.status(400).json({
        success: false,
        message: 'El título es requerido y debe tener al menos 5 caracteres'
      });
    }

    if (!year || year < 2000) {
      console.log('❌ ERROR: Año inválido');
      console.log('   - year existe:', !!year);
      console.log('   - year valor:', year);
      console.log('   - year < 2000:', year < 2000);
      
      return res.status(400).json({
        success: false,
        message: 'El año es requerido y debe ser válido'
      });
    }

    // ✅ LOG 3: Verificar projectType válido
    const validProjectTypes = ['Preproyecto', 'Proyecto', 'Dirección'];
    console.log('4. Validación projectType:');
    console.log('   - projectType recibido:', projectType);
    console.log('   - tipos válidos:', validProjectTypes);
    console.log('   - es válido:', validProjectTypes.includes(projectType));

    if (!projectType || !validProjectTypes.includes(projectType)) {
      console.log('❌ ERROR: Tipo de proyecto inválido');
      
      return res.status(400).json({
        success: false,
        message: 'El tipo de proyecto es requerido y debe ser válido (Preproyecto, Proyecto, Dirección)'
      });
    }

    // ✅ FUNCIÓN generateSlug CORREGIDA
    const generateSlug = (title, year) => {
      return `${title.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')}-${year}`;
    };

    // ✅ LOG 4: Datos que se van a crear
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
      slug: generateSlug(title.trim(), parseInt(year)), // ✅ GENERAR SLUG AQUÍ
      isFeatured: Boolean(isFeatured),
      isPublic: Boolean(isPublic),
      isActive: true, // ✅ AGREGAR EXPLÍCITAMENTE
      order: parseInt(order),
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null
    };

    console.log('5. Datos finales para crear:');
    console.log(JSON.stringify(projectData, null, 2));
    console.log('   - Slug generado:', projectData.slug); 
    
    // ✅ LOG 5: Intentar crear proyecto
    console.log('6. Intentando crear proyecto...');
    const project = await Project.create(projectData);
    
    console.log('✅ SUCCESS: Proyecto creado exitosamente');
    console.log('   - ID:', project.id);
    console.log('   - Slug generado:', project.slug);
    
    // ✅ LOG EXTRA: Verificar que se guardó en DB
    console.log('7. Verificando en base de datos...');
    const projectInDB = await Project.findByPk(project.id);
    console.log('   - Proyecto encontrado en DB:', !!projectInDB);
    console.log('   - isActive en DB:', projectInDB?.isActive);
    console.log('   - isPublic en DB:', projectInDB?.isPublic);

    res.status(201).json({
      success: true,
      message: 'Proyecto creado exitosamente',
      data: project
    });

  } catch (error) {
    console.log('❌ CATCH ERROR en createProject:');
    console.log('   - Error name:', error.name);
    console.log('   - Error message:', error.message);
    console.log('   - Error stack:', error.stack);
    
    // ✅ LOG 6: Errores específicos de Sequelize
    if (error.name === 'SequelizeValidationError') {
      console.log('   - Errores de validación:');
      error.errors?.forEach(err => {
        console.log(`     * ${err.path}: ${err.message} (valor: ${err.value})`);
      });
      
      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors: error.errors?.map(err => ({
          field: err.path,
          message: err.message,
          value: err.value
        }))
      });
    }
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      console.log('   - Error de constraint único');
      console.log('   - Fields:', error.fields);
      
      return res.status(400).json({
        success: false,
        message: 'Ya existe un proyecto con ese título o slug'
      });
    }

    if (error.name === 'SequelizeDatabaseError') {
      console.log('   - Error de base de datos');
      console.log('   - Original error:', error.original?.message);
      
      return res.status(500).json({
        success: false,
        message: 'Error de base de datos',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }

    console.error('Error creando proyecto:', error);

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


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
export const uploadProjectMedia = async (req, res) => {
  try {
    // ✅ CORS headers explícitos al inicio
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Credentials', 'true');

    console.log('🚀 Iniciando subida de media...');
    console.log('📁 Archivo recibido:', req.file);
    console.log('📋 Datos del body:', req.body);
    console.log('🔍 Headers:', req.headers);

    const { id } = req.params;
    const { type, description, isMain = false, order = 0 } = req.body;

    // ✅ Validaciones mejoradas
    if (!req.file) {
      console.log('❌ No se recibió archivo');
      return res.status(400).json({
        success: false,
        message: 'No se recibió ningún archivo',
        debug: {
          body: req.body,
          file: req.file,
          headers: req.headers
        }
      });
    }

    if (!type) {
      console.log('❌ Falta el tipo de archivo');
      return res.status(400).json({
        success: false,
        message: 'El tipo de archivo es requerido',
        debug: { body: req.body }
      });
    }

    // Verificar que el proyecto existe
    const project = await Project.findByPk(id);
    if (!project) {
      console.log('❌ Proyecto no encontrado:', id);
      return res.status(404).json({
        success: false,
        message: 'Proyecto no encontrado'
      });
    }

    console.log('📊 Subiendo a Cloudinary...');
    
    let uploadResult;
    const filePath = req.file.path;
    
    // ✅ Manejo mejorado por tipo de archivo
    try {
      if (req.file.mimetype.startsWith('image/')) {
        uploadResult = await uploadResponsiveImage(filePath, `divanco/projects/${id}`);
        
        // Crear registro en MediaFile
        const mediaFile = await MediaFile.create({
          projectId: id,
          filename: req.file.originalname,
          originalName: req.file.originalname,
          mimeType: req.file.mimetype,
          size: req.file.size,
          type: type,
          description: description || '',
          cloudinaryData: uploadResult,
          urls: {
            desktop: uploadResult.desktop.url,
            mobile: uploadResult.mobile.url,
            thumbnail: uploadResult.thumbnail.url
          },
          isMain: isMain === 'true' || isMain === true,
          order: parseInt(order) || 0,
          isActive: true
        });

        console.log('✅ Imagen subida exitosamente');
        return res.status(200).json({
          success: true,
          message: 'Imagen subida correctamente',
          data: mediaFile
        });

      } else if (req.file.mimetype.startsWith('video/')) {
        uploadResult = await uploadOptimizedVideo(filePath, `divanco/projects/${id}`);
        
        const mediaFile = await MediaFile.create({
          projectId: id,
          filename: req.file.originalname,
          originalName: req.file.originalname,
          mimeType: req.file.mimetype,
          size: req.file.size,
          type: type,
          description: description || '',
          cloudinaryData: uploadResult,
          urls: { main: uploadResult.url },
          isMain: isMain === 'true' || isMain === true,
          order: parseInt(order) || 0,
          isActive: true
        });

        console.log('✅ Video subido exitosamente');
        return res.status(200).json({
          success: true,
          message: 'Video subido correctamente',
          data: mediaFile
        });

      } else if (req.file.mimetype === 'application/pdf') {
        uploadResult = await uploadDocument(filePath, `divanco/projects/${id}`);
        
        const mediaFile = await MediaFile.create({
          projectId: id,
          filename: req.file.originalname,
          originalName: req.file.originalname,
          mimeType: req.file.mimetype,
          size: req.file.size,
          type: type,
          description: description || '',
          cloudinaryData: uploadResult,
          urls: { main: uploadResult.url },
          isMain: false,
          order: parseInt(order) || 0,
          isActive: true
        });

        console.log('✅ PDF subido exitosamente');
        return res.status(200).json({
          success: true,
          message: 'Documento subido correctamente',
          data: mediaFile
        });
      }

    } catch (cloudinaryError) {
      console.error('❌ Error en Cloudinary:', cloudinaryError);
      return res.status(500).json({
        success: false,
        message: 'Error al subir archivo a Cloudinary',
        error: cloudinaryError.message
      });
    }

  } catch (error) {
    console.error('❌ Error general:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message,
      debug: {
        body: req.body,
        file: req.file
      }
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
