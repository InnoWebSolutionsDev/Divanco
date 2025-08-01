import { BlogPost, User, Project, Subscriber } from '../data/models/index.js';
import { uploadResponsiveImage, deleteResponsiveImages } from '../config/cloudinary.js';
import { sendBlogNotification } from '../utils/mailer.js';
import { Op } from 'sequelize';

// Obtener todos los posts del blog
export const getAllBlogPosts = async (req, res) => {
  try {
    const { 
      status = 'published',
      author,
      project,
      tags,
      featured = false,
      limit = 10,
      page = 1
    } = req.query;

    const whereClause = {};
    
    if (status) whereClause.status = status;
    if (author) whereClause.authorId = author;
    if (project) whereClause.projectId = project;
    if (featured === 'true') whereClause.isFeatured = true;
    if (tags) {
      const tagsArray = tags.split(',');
      whereClause.tags = {
        [Op.overlap]: tagsArray
      };
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: posts } = await BlogPost.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name']
        },
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'title', 'slug', 'year'],
          required: false
        }
      ],
      order: [
        ['isFeatured', 'DESC'],
        ['publishedAt', 'DESC'],
        ['createdAt', 'DESC']
      ],
      limit: parseInt(limit),
      offset: offset
    });

    res.json({
      success: true,
      data: posts,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(count / parseInt(limit)),
        total_items: count,
        items_per_page: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error obteniendo posts del blog:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener post por slug
export const getBlogPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const post = await BlogPost.findOne({
      where: { slug, status: 'published' },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name']
        },
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'title', 'slug', 'year', 'featuredImage'],
          required: false
        }
      ]
    });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post no encontrado'
      });
    }

    // Incrementar contador de vistas
    await post.increment('viewCount');

    // Obtener posts relacionados
    const relatedPosts = await BlogPost.findAll({
      where: {
        id: { [Op.ne]: post.id },
        status: 'published',
        [Op.or]: [
          { projectId: post.projectId },
          { tags: { [Op.overlap]: post.tags || [] } }
        ]
      },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name']
        }
      ],
      limit: 3,
      order: [['publishedAt', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        post,
        relatedPosts
      }
    });
  } catch (error) {
    console.error('Error obteniendo post:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Crear nuevo post
export const createBlogPost = async (req, res) => {
  try {
    const {
      title,
      content,
      excerpt,
      authorId,
      projectId,
      tags = [],
      status = 'draft',
      isFeatured = false,
      publishedAt
    } = req.body;

    // Validaciones básicas
    if (!title || title.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: 'El título es requerido y debe tener al menos 5 caracteres'
      });
    }

    if (!content || content.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'El contenido es requerido'
      });
    }

    if (!authorId) {
      return res.status(400).json({
        success: false,
        message: 'El autor es requerido'
      });
    }

    // Verificar que el autor existe
    const author = await User.findByPk(authorId);
    if (!author) {
      return res.status(400).json({
        success: false,
        message: 'El autor especificado no existe'
      });
    }

    // Verificar proyecto si se especifica
    if (projectId) {
      const project = await Project.findByPk(projectId);
      if (!project) {
        return res.status(400).json({
          success: false,
          message: 'El proyecto especificado no existe'
        });
      }
    }

    // Crear el post
    const postData = {
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt?.trim(),
      authorId,
      projectId: projectId || null,
      tags: Array.isArray(tags) ? tags : [],
      status,
      isFeatured: Boolean(isFeatured),
      publishedAt: status === 'published' ? (publishedAt ? new Date(publishedAt) : new Date()) : null
    };

    const post = await BlogPost.create(postData);

    // Recargar con relaciones
    await post.reload({
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name']
        },
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'title', 'slug'],
          required: false
        }
      ]
    });

    // Si se publica, enviar notificaciones a suscriptores
    if (status === 'published') {
      try {
        const subscribers = await Subscriber.findAll({
          where: { isActive: true }
        });
        
        if (subscribers.length > 0) {
          await sendBlogNotification(subscribers, post);
        }
      } catch (emailError) {
        console.warn('Error enviando notificaciones:', emailError);
      }
    }

    res.status(201).json({
      success: true,
      message: 'Post creado exitosamente',
      data: post
    });
  } catch (error) {
    console.error('Error creando post:', error);
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un post con ese título'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Actualizar post
export const updateBlogPost = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const post = await BlogPost.findByPk(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post no encontrado'
      });
    }

    // Si se está publicando por primera vez
    const wasUnpublished = post.status !== 'published';
    const willBePublished = updateData.status === 'published';

    if (willBePublished && !updateData.publishedAt) {
      updateData.publishedAt = new Date();
    }

    await post.update(updateData);

    // Recargar con relaciones
    await post.reload({
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name']
        },
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'title', 'slug'],
          required: false
        }
      ]
    });

    // Si se publica por primera vez, enviar notificaciones
    if (wasUnpublished && willBePublished) {
      try {
        const subscribers = await Subscriber.findAll({
          where: { isActive: true }
        });
        
        if (subscribers.length > 0) {
          await sendBlogNotification(subscribers, post);
        }
      } catch (emailError) {
        console.warn('Error enviando notificaciones:', emailError);
      }
    }

    res.json({
      success: true,
      message: 'Post actualizado exitosamente',
      data: post
    });
  } catch (error) {
    console.error('Error actualizando post:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Subir imagen para post
export const uploadBlogPostImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { type = 'featured' } = req.body; // 'featured' o 'gallery'
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No se proporcionó ningún archivo'
      });
    }

    const post = await BlogPost.findByPk(id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post no encontrado'
      });
    }

    // Subir imagen
    const folder = `blog/${new Date().getFullYear()}/${post.slug}`;
    const images = await uploadResponsiveImage(req.file.path, folder);

    let updateData = {};

    if (type === 'featured') {
      // Eliminar imagen anterior si existe
      if (post.featuredImage) {
        try {
          await deleteResponsiveImages(post.featuredImage);
        } catch (deleteError) {
          console.warn('Error eliminando imagen anterior:', deleteError);
        }
      }
      updateData.featuredImage = images;
    } else if (type === 'gallery') {
      // Agregar a la galería
      const currentImages = post.images || [];
      updateData.images = [...currentImages, images];
    }

    // Actualizar post
    await post.update(updateData);

    res.json({
      success: true,
      message: 'Imagen subida exitosamente',
      data: {
        post: post,
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

// Eliminar post
export const deleteBlogPost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await BlogPost.findByPk(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post no encontrado'
      });
    }

    // Eliminar imágenes de Cloudinary
    if (post.featuredImage) {
      try {
        await deleteResponsiveImages(post.featuredImage);
      } catch (deleteError) {
        console.warn('Error eliminando imagen destacada:', deleteError);
      }
    }

    if (post.images && post.images.length > 0) {
      try {
        for (const imageSet of post.images) {
          await deleteResponsiveImages(imageSet);
        }
      } catch (deleteError) {
        console.warn('Error eliminando galería:', deleteError);
      }
    }

    // Eliminar post de la base de datos
    await post.destroy();

    res.json({
      success: true,
      message: 'Post eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando post:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener posts destacados
export const getFeaturedBlogPosts = async (req, res) => {
  try {
    const { limit = 3 } = req.query;

    const posts = await BlogPost.findAll({
      where: { 
        status: 'published',
        isFeatured: true 
      },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name']
        },
        {
          model: Project,
          as: 'project',
          attributes: ['id', 'title', 'slug'],
          required: false
        }
      ],
      order: [['publishedAt', 'DESC']],
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      data: posts
    });
  } catch (error) {
    console.error('Error obteniendo posts destacados:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// Obtener posts recientes
export const getRecentBlogPosts = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const posts = await BlogPost.findAll({
      where: { status: 'published' },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name']
        }
      ],
      order: [['publishedAt', 'DESC']],
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      data: posts
    });
  } catch (error) {
    console.error('Error obteniendo posts recientes:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};
