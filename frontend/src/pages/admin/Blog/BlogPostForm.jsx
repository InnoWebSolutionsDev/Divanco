import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FiSave, FiEye, FiArrowLeft } from 'react-icons/fi';
import { EditorJSComponent } from '../../../components/ui';

const BlogPostForm = ({ post, onClose, onSuccess }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Determinar si estamos editando: puede ser por URL param o por prop post
  const isEditing = Boolean(id) || Boolean(post?.id);
  const editingId = id || post?.id;
  
  console.log('🔍 [BlogPostForm] Inicializando - URL ID:', id, 'Post ID:', post?.id, 'isEditing:', isEditing, 'editingId:', editingId);
  
  // Obtener token de Redux
  const token = useSelector(state => state.auth.token);

  const [formData, setFormData] = useState({
    title: '',
    author: 'Administrador', // Agregar autor por defecto
    slug: '',
    excerpt: '',
    content: [],
    featuredImage: '',
    metaTitle: '',
    metaDescription: '',
    status: 'draft',
    projectId: '' // Cambiar category por projectId
  });

  // Función para manejar el cierre/navegación según el contexto
  const handleClose = () => {
    if (onClose) {
      onClose(); // Si está en modo modal, usar la función de cierre
    } else {
      navigate('/admin/blog'); // Si está en página standalone, navegar
    }
  };

  // Función para manejar el éxito según el contexto
  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess(); // Si está en modo modal, usar la función de éxito
    } else {
      navigate('/admin/blog'); // Si está en página standalone, navegar
    }
  };
  const [projects, setProjects] = useState([]); // Cambiar categories por projects
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [editorInstance, setEditorInstance] = useState(null);
  const [editorData, setEditorData] = useState({ blocks: [] });

  // Función helper para hacer peticiones autenticadas
  const authenticatedFetch = async (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    if (token) {
      headers['authorization'] = `Bearer ${token}`;
    }
    
    return fetch(url, {
      ...options,
      headers
    });
  };

  // Cargar proyectos (opcional)
  useEffect(() => {
    // Solo intentar cargar proyectos, no es crítico si falla
    fetchProjects().catch(console.error);
  }, []);

  // Efecto separado para cargar datos del post al editar
  useEffect(() => {
    console.log('🔄 [BlogPostForm] useEffect disparado - isEditing:', isEditing, 'editingId:', editingId, 'post prop:', post);
    
    if (isEditing) {
      // Si tenemos la prop post, usarla directamente
      if (post) {
        console.log('� [BlogPostForm] Usando post de prop:', post);
        loadPostFromProp(post);
      }
      // Si no tenemos prop post pero sí ID de URL, cargar desde API
      else if (editingId) {
        console.log('📖 [BlogPostForm] Cargando post desde API, ID:', editingId);
        fetchBlogPost();
      }
    } else {
      console.log('⚠️ [BlogPostForm] Modo creación - no se carga post');
    }
  }, [isEditing, editingId, post]);

  // Nueva función para cargar post desde prop
  const loadPostFromProp = (postData) => {
    console.log('📝 [BlogPostForm] Cargando datos desde prop:', postData);
    
    setFormData({
      title: postData.title || '',
      author: postData.author || 'Administrador',
      slug: postData.slug || '',
      excerpt: postData.excerpt || '',
      content: postData.content || [],
      featuredImage: postData.featuredImage || '',
      metaTitle: postData.metaTitle || '',
      metaDescription: postData.metaDescription || '',
      status: postData.status || 'draft',
      projectId: postData.projectId || ''
    });

    // Convertir contenido del post al formato de Editor.js
    const editorContent = convertToEditorFormat(postData.content);
    console.log('🔄 [BlogPostForm] Contenido convertido para editor desde prop:', editorContent);
    setEditorData(editorContent);
  };

  const fetchProjects = async () => {
    try {
      const response = await authenticatedFetch('/projects');
      if (response.ok) {
        const data = await response.json();
        // Asegurar que data sea un array
        setProjects(Array.isArray(data) ? data : []);
      } else {
        console.warn('No se pudieron cargar los proyectos');
        setProjects([]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]); // Asegurar que projects sea siempre un array
    }
  };

  const fetchBlogPost = async () => {
    try {
      setLoading(true);
      console.log('🔍 [BlogPostForm] Obteniendo post del backend, ID:', editingId);
      
      const response = await authenticatedFetch(`/blog/id/${editingId}`);
      if (response.ok) {
        const post = await response.json();
        console.log('📝 [BlogPostForm] Post obtenido:', post);
        
        setFormData({
          title: post.title || '',
          author: post.author || 'Administrador',
          slug: post.slug || '',
          excerpt: post.excerpt || '',
          content: post.content || [],
          featuredImage: post.featuredImage || '',
          metaTitle: post.metaTitle || '',
          metaDescription: post.metaDescription || '',
          status: post.status || 'draft',
          projectId: post.projectId || '' // Cambiar category por projectId
        });

        // Convertir contenido del backend al formato de Editor.js
        const editorContent = convertToEditorFormat(post.content);
        console.log('🔄 [BlogPostForm] Contenido convertido para editor:', editorContent);
        setEditorData(editorContent);
      } else {
        console.error('❌ [BlogPostForm] Error response:', response.status);
        alert('Error al cargar el post');
      }
    } catch (error) {
      console.error('❌ [BlogPostForm] Error fetching blog post:', error);
      alert('Error al cargar el post');
    } finally {
      setLoading(false);
    }
  };

  // Convertir de formato backend a formato Editor.js
  const convertToEditorFormat = (backendContent) => {
    console.log('🔄 [BlogPostForm] Convirtiendo contenido backend:', backendContent);
    
    if (!backendContent || !Array.isArray(backendContent)) {
      console.log('⚠️ [BlogPostForm] No hay contenido válido, usando bloques vacíos');
      return { blocks: [] };
    }

    const blocks = backendContent.map((block, index) => {
      console.log(`🔄 [BlogPostForm] Procesando bloque ${index}:`, block);
      
      switch (block.type) {
        case 'text':
          return {
            type: 'paragraph',
            data: { text: block.value || '' }
          };
        case 'header':
          return {
            type: 'header',
            data: { 
              text: block.value || '',
              level: block.level || 2
            }
          };
        case 'list':
          return {
            type: 'list',
            data: {
              items: block.value || [],
              style: block.style || 'unordered'
            }
          };
        case 'quote':
          return {
            type: 'quote',
            data: {
              text: block.value || '',
              caption: block.caption || ''
            }
          };
        case 'image':
          return {
            type: 'image',
            data: {
              file: { url: block.value || '' },
              caption: block.caption || '',
              withBorder: block.withBorder || false,
              withBackground: block.withBackground || false,
              stretched: block.stretched || false
            }
          };
        case 'delimiter':
          return {
            type: 'delimiter',
            data: {}
          };
        case 'embed':
          return {
            type: 'embed',
            data: {
              source: block.value || '',
              service: block.service || '',
              caption: block.caption || ''
            }
          };
        default:
          return {
            type: 'paragraph',
            data: { text: block.value || '' }
          };
      }
    });

    const result = { blocks };
    console.log('✅ [BlogPostForm] Contenido convertido:', result);
    return result;
  };

  // Manejar cambios en Editor.js
  const handleEditorChange = (data) => {
    console.log('📝 Editor cambió:', data);
    setEditorData(data);
  };

  // Efecto para debuggear cambios en editorData
  useEffect(() => {
    console.log('🔍 [BlogPostForm] editorData cambió:', editorData);
  }, [editorData]);

  // Función para limpiar HTML del texto
  const stripHtml = (html) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  // Convertir contenido del Editor.js al formato del backend
  const convertToBackendFormat = (editorData) => {
    if (!editorData?.blocks) return [];

    return editorData.blocks.map(block => {
      switch (block.type) {
        case 'paragraph':
          // Limpiar HTML del texto si existe
          const cleanText = block.data?.text ? stripHtml(block.data.text) : '';
          return {
            type: 'text',
            value: cleanText
          };
        case 'header':
          const cleanHeaderText = block.data?.text ? stripHtml(block.data.text) : '';
          return {
            type: 'header',
            value: cleanHeaderText,
            level: block.data?.level || 2
          };
        case 'list':
          return {
            type: 'list',
            value: block.data?.items || [],
            style: block.data?.style || 'unordered'
          };
        case 'quote':
          const cleanQuoteText = block.data?.text ? stripHtml(block.data.text) : '';
          return {
            type: 'quote',
            value: cleanQuoteText,
            caption: block.data?.caption || ''
          };
        case 'image':
          return {
            type: 'image',
            value: block.data?.file?.url || '',
            caption: block.data?.caption || '',
            withBorder: block.data?.withBorder || false,
            withBackground: block.data?.withBackground || false,
            stretched: block.data?.stretched || false
          };
        case 'delimiter':
          return {
            type: 'delimiter',
            value: ''
          };
        case 'embed':
          return {
            type: 'embed',
            value: block.data?.source || '',
            service: block.data?.service || '',
            caption: block.data?.caption || ''
          };
        default:
          const cleanDefaultText = block.data?.text ? stripHtml(block.data.text) : '';
          return {
            type: 'text',
            value: cleanDefaultText
          };
      }
    });
  };

  // Función para subir imagen destacada a Cloudinary
  const handleFeaturedImageUpload = async (file) => {
    try {
      setLoading(true);
      console.log('📸 Subiendo imagen destacada a Cloudinary:', file.name);

      const formData = new FormData();
      formData.append('image', file);

      // Para FormData, no usar authenticatedFetch porque agrega Content-Type: application/json
      const headers = {};
      if (token) {
        headers['authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/blog/upload-featured-image', {
        method: 'POST',
        body: formData,
        headers: headers // Sin Content-Type para que el browser lo establezca correctamente
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Imagen destacada subida:', result);
        
        // Extraer la URL correcta del resultado de Cloudinary
        const imageUrl = result.desktop?.url || result.url || '';
        console.log('🖼️ URL de imagen extraída:', imageUrl);
        
        // Actualizar el campo de imagen destacada con la URL de Cloudinary
        setFormData(prev => ({
          ...prev,
          featuredImage: imageUrl
        }));

        alert('Imagen destacada subida exitosamente');
        return result;
      } else {
        const error = await response.json();
        console.error('❌ Error subiendo imagen:', error);
        alert('Error al subir la imagen: ' + (error.message || 'Error desconocido'));
      }
    } catch (error) {
      console.error('❌ Error uploading featured image:', error);
      alert('Error al subir la imagen destacada');
    } finally {
      setLoading(false);
    }
  };

  // Función para subir imágenes del contenido
  const handleImageUpload = async (file) => {
    try {
      console.log('📸 Subiendo imagen del contenido:', file.name);

      const formData = new FormData();
      formData.append('image', file);

      // Para FormData, no usar authenticatedFetch porque agrega Content-Type: application/json
      const headers = {};
      if (token) {
        headers['authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/blog/upload-featured-image', {
        method: 'POST',
        body: formData,
        headers: headers // Sin Content-Type para que el browser lo establezca correctamente
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Imagen del contenido subida:', result);
        
        // Extraer la URL correcta del resultado de Cloudinary
        const imageUrl = result.desktop?.url || result.url || '';
        return { url: imageUrl };
      } else {
        console.error('❌ Error subiendo imagen del contenido');
        // Fallback: crear URL temporal para la imagen
        const url = URL.createObjectURL(file);
        return { url };
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      // Fallback: crear URL temporal para la imagen
      const url = URL.createObjectURL(file);
      return { url };
    }
  };

  // Generar slug automáticamente
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  // Manejar cambios en inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'title' && { slug: generateSlug(value) })
    }));
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Si hay una instancia del editor, obtener los datos actuales
      let currentEditorData = editorData;
      if (editorInstance && editorInstance.save) {
        try {
          currentEditorData = await editorInstance.save();
          console.log('📝 Datos obtenidos directamente del editor:', currentEditorData);
        } catch (error) {
          console.warn('⚠️ No se pudieron obtener datos del editor, usando estado actual:', error);
        }
      }

      // Convertir contenido del editor al formato del backend
      const backendContent = convertToBackendFormat(currentEditorData);

      const submitData = {
        ...formData,
        content: backendContent
      };

      console.log('📤 Enviando datos:', submitData);
      console.log('🔍 editorData actual:', currentEditorData);
      console.log('🔍 backendContent:', backendContent);
      console.log('🔍 content length:', backendContent.length);
      
      // Debug detallado de cada bloque
      backendContent.forEach((block, index) => {
        console.log(`📋 Bloque ${index}:`, block);
        if (block.type === 'text') {
          console.log(`📝 Texto bloque ${index}: "${block.value}" (${block.value.length} chars)`);
          console.log(`📝 Texto trimmed: "${block.value.trim()}" (${block.value.trim().length} chars)`);
        }
      });

      // Buscar bloques de texto válidos
      const textBlocks = backendContent.filter(block => block.type === 'text');
      console.log(`📝 Bloques de texto encontrados: ${textBlocks.length}`);
      
      const validTextBlocks = textBlocks.filter(block => 
        block.value && block.value.trim().length >= 10
      );
      console.log(`📝 Bloques de texto válidos (10+ chars): ${validTextBlocks.length}`);

      // Validación frontend
      if (!backendContent || backendContent.length === 0) {
        alert('Por favor agrega contenido al post antes de guardarlo');
        setLoading(false);
        return;
      }

      // Validar que haya al menos un bloque de texto con 10+ caracteres
      const hasValidTextBlock = backendContent.some(block => {
        if (block.type === 'text' && block.value) {
          const cleanText = block.value.trim();
          console.log(`🔍 Validando texto: "${cleanText}" (${cleanText.length} chars)`);
          return cleanText.length >= 10;
        }
        return false;
      });

      console.log(`✅ ¿Tiene bloque de texto válido?: ${hasValidTextBlock}`);

      if (!hasValidTextBlock) {
        alert('El post debe tener al menos un párrafo de texto con 10 caracteres o más');
        setLoading(false);
        return;
      }

      const url = isEditing ? `/blog/${editingId}` : '/blog';
      const method = isEditing ? 'PUT' : 'POST';

      console.log('🔗 URL para envío:', url, 'Método:', method, 'editingId:', editingId);

      const response = await authenticatedFetch(url, {
        method,
        body: JSON.stringify(submitData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Post guardado:', result);
        handleSuccess();
      } else {
        const error = await response.json();
        console.error('❌ Error saving blog post:', error);
        alert('Error al guardar el post: ' + (error.message || 'Error desconocido'));
      }
    } catch (error) {
      console.error('❌ Error saving blog post:', error);
      alert('Error al guardar el post');
    } finally {
      setLoading(false);
    }
  };

  // Renderizar preview de bloques
  const renderPreviewBlock = (block) => {
    switch (block.type) {
      case 'text':
        return (
          <p className="mb-4 text-gray-700 leading-relaxed">
            {block.value}
          </p>
        );
      case 'header':
        const HeaderTag = `h${block.level || 2}`;
        const headerClasses = {
          1: 'text-3xl font-bold mb-6',
          2: 'text-2xl font-bold mb-4',
          3: 'text-xl font-bold mb-3',
          4: 'text-lg font-bold mb-2',
          5: 'text-base font-bold mb-2',
          6: 'text-sm font-bold mb-2'
        };
        return (
          <HeaderTag className={`${headerClasses[block.level || 2]} text-gray-900`}>
            {block.value}
          </HeaderTag>
        );
      case 'list':
        const ListTag = block.style === 'ordered' ? 'ol' : 'ul';
        const listClass = block.style === 'ordered' ? 'list-decimal' : 'list-disc';
        return (
          <ListTag className={`${listClass} pl-6 mb-4 space-y-2`}>
            {Array.isArray(block.value) && block.value.map((item, idx) => (
              <li key={idx} className="text-gray-700">{item}</li>
            ))}
          </ListTag>
        );
      case 'quote':
        return (
          <blockquote className="border-l-4 border-blue-500 pl-4 py-2 mb-4 bg-gray-50">
            <p className="text-gray-700 italic mb-2">{block.value}</p>
            {block.caption && (
              <cite className="text-sm text-gray-500">— {block.caption}</cite>
            )}
          </blockquote>
        );
      case 'image':
        return (
          <figure className="mb-6">
            <img 
              src={block.value} 
              alt={block.caption || ''}
              className={`max-w-full h-auto mx-auto ${
                block.withBorder ? 'border border-gray-300' : ''
              } ${
                block.withBackground ? 'bg-gray-100 p-4' : ''
              } ${
                block.stretched ? 'w-full' : ''
              }`}
            />
            {block.caption && (
              <figcaption className="text-center text-sm text-gray-600 mt-2">
                {block.caption}
              </figcaption>
            )}
          </figure>
        );
      case 'delimiter':
        return (
          <div className="text-center my-8">
            <span className="text-2xl text-gray-400">* * *</span>
          </div>
        );
      case 'embed':
        return (
          <div className="mb-6">
            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Contenido embebido: {block.service}</p>
            </div>
            {block.caption && (
              <p className="text-center text-sm text-gray-600 mt-2">{block.caption}</p>
            )}
          </div>
        );
      default:
        return (
          <p className="mb-4 text-gray-700">{block.value}</p>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleClose}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <FiArrowLeft className="mr-2" />
            Volver al blog
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Editar Post' : 'Crear Nuevo Post'}
          </h1>
        </div>
        
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="flex items-center px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <FiEye className="mr-2" />
            {showPreview ? 'Ocultar Preview' : 'Ver Preview'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario principal */}
        <div className={`${showPreview ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">Información básica</h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Título *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                    Autor
                  </label>
                  <input
                    type="text"
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                    Slug
                  </label>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
                    Extracto
                  </label>
                  <textarea
                    id="excerpt"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 mb-1">
                    Proyecto (opcional)
                  </label>
                  <select
                    id="projectId"
                    name="projectId"
                    value={formData.projectId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Sin proyecto asociado</option>
                    {Array.isArray(projects) && projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.title}
                      </option>
                    ))}
                  </select>
                  {!Array.isArray(projects) || projects.length === 0 ? (
                    <p className="text-sm text-gray-500 mt-1">
                      No hay proyectos disponibles. Los blogs pueden crearse sin asociar a un proyecto.
                    </p>
                  ) : null}
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="draft">Borrador</option>
                    <option value="published">Publicado</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 mb-1">
                    Imagen destacada
                  </label>
                  <div className="space-y-3">
                    <input
                      type="url"
                      id="featuredImage"
                      name="featuredImage"
                      value={formData.featuredImage}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="URL de la imagen o sube una nueva"
                    />
                    
                    <div className="flex items-center space-x-3">
                      <span className="text-sm text-gray-500">o</span>
                      <label className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg cursor-pointer hover:bg-blue-200 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              handleFeaturedImageUpload(file);
                            }
                          }}
                        />
                        📸 Subir imagen
                      </label>
                    </div>

                    {formData.featuredImage && (
                      <div className="mt-3">
                        <img 
                          src={formData.featuredImage} 
                          alt="Preview imagen destacada"
                          className="w-full max-w-xs h-auto border rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Editor de contenido */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">Contenido</h2>
              <EditorJSComponent
                key={`editor-${id || 'new'}-${JSON.stringify(editorData)}`} // Forzar re-render cuando cambie el ID o datos
                data={editorData}
                onChange={handleEditorChange}
                onImageUpload={handleImageUpload}
                onReady={(editor) => {
                  console.log('📝 Editor instancia recibida:', editor);
                  setEditorInstance(editor);
                }}
              />
            </div>

            {/* SEO */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">SEO</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Título
                  </label>
                  <input
                    type="text"
                    id="metaTitle"
                    name="metaTitle"
                    value={formData.metaTitle}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-1">
                    Meta Descripción
                  </label>
                  <textarea
                    id="metaDescription"
                    name="metaDescription"
                    value={formData.metaDescription}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <FiSave className="mr-2" />
                {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear Post')}
              </button>
            </div>
          </form>
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
              <h2 className="text-lg font-semibold mb-4">Vista Previa</h2>
              <div className="prose prose-sm max-w-none">
                <h1 className="text-xl font-bold mb-4">{formData.title || 'Título del post'}</h1>
                {formData.excerpt && (
                  <p className="text-gray-600 italic mb-4">{formData.excerpt}</p>
                )}
                <div className="border-t pt-4">
                  {convertToBackendFormat(editorData).map((block, index) => (
                    <div key={index}>
                      {renderPreviewBlock(block)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPostForm;
