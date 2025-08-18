import React, { useState, useEffect } from 'react';
import { X, Upload, Save, Eye, EyeOff } from 'lucide-react';
import MediaUploader from '../ui/MediaUploader';
import { 
  useCreateBlogPostMutation, 
  useUpdateBlogPostMutation,
  useUploadBlogPostImageMutation,
  useUploadBlogPostVideoMutation,
  useDeleteBlogPostImageMutation,
  useDeleteBlogPostVideoMutation
} from '../../features/blog/blogApi';
import { useSelector } from 'react-redux';

const BlogPostForm = ({ post = null, onClose, onSuccess }) => {
  const { user } = useSelector(state => state.auth);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    tags: '',
    status: 'draft',
    featuredImage: '',
    images: [],
    videos: [],
    projectId: '',
    categoryId: '',
    subcategoryId: ''
  });

  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

  const [createBlogPost] = useCreateBlogPostMutation();
  const [updateBlogPost] = useUpdateBlogPostMutation();
  const [uploadImage] = useUploadBlogPostImageMutation();
  const [uploadVideo] = useUploadBlogPostVideoMutation();
  const [deleteImage] = useDeleteBlogPostImageMutation();
  const [deleteVideo] = useDeleteBlogPostVideoMutation();

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || '',
        content: post.content || '',
        excerpt: post.excerpt || '',
        tags: Array.isArray(post.tags) ? post.tags.join(', ') : (post.tags || ''),
        status: post.status || 'draft',
        featuredImage: post.featuredImage || '',
        images: post.images || [],
        videos: post.videos || [],
        projectId: post.projectId || '',
        categoryId: post.categoryId || '',
        subcategoryId: post.subcategoryId || ''
      });
    }
  }, [post]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (file) => {
    if (!post?.id) {
      alert('Primero debes guardar el post antes de subir imágenes');
      return;
    }

    try {
      setIsUploadingMedia(true);
      const formDataToUpload = new FormData();
      formDataToUpload.append('image', file);
      
      const result = await uploadImage({ 
        postId: post.id, 
        formData: formDataToUpload 
      }).unwrap();
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, result.image]
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error al subir la imagen');
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const handleVideoUpload = async (file) => {
    if (!post?.id) {
      alert('Primero debes guardar el post antes de subir videos');
      return;
    }

    try {
      setIsUploadingMedia(true);
      const formDataToUpload = new FormData();
      formDataToUpload.append('video', file);
      
      const result = await uploadVideo({ 
        postId: post.id, 
        formData: formDataToUpload 
      }).unwrap();
      
      setFormData(prev => ({
        ...prev,
        videos: [...prev.videos, result.video]
      }));
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Error al subir el video');
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const handleImageDelete = async (imageId) => {
    if (!post?.id) return;

    try {
      await deleteImage({ postId: post.id, imageId }).unwrap();
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter(img => img.id !== imageId)
      }));
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Error al eliminar la imagen');
    }
  };

  const handleVideoDelete = async (videoId) => {
    if (!post?.id) return;

    try {
      await deleteVideo({ postId: post.id, videoId }).unwrap();
      setFormData(prev => ({
        ...prev,
        videos: prev.videos.filter(video => video.id !== videoId)
      }));
    } catch (error) {
      console.error('Error deleting video:', error);
      alert('Error al eliminar el video');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      const submitData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      let result;
      if (post) {
        result = await updateBlogPost({ id: post.id, ...submitData }).unwrap();
      } else {
        result = await createBlogPost(submitData).unwrap();
      }

      onSuccess?.(result);
      onClose();
    } catch (error) {
      console.error('Error saving blog post:', error);
      alert(`Error al ${post ? 'actualizar' : 'crear'} el post`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPreview = () => (
    <div className="prose max-w-none">
      <h1>{formData.title || 'Título del post'}</h1>
      {formData.featuredImage && (
        <img 
          src={formData.featuredImage} 
          alt="Imagen destacada" 
          className="w-full h-64 object-cover rounded-lg"
        />
      )}
      {formData.excerpt && (
        <p className="text-lg text-gray-600 italic">{formData.excerpt}</p>
      )}
      <div dangerouslySetInnerHTML={{ __html: formData.content }} />
      
      {formData.images.length > 0 && (
        <div className="mt-8">
          <h3>Galería de imágenes</h3>
          <div className="grid grid-cols-2 gap-4">
            {formData.images.map((image, index) => (
              <img 
                key={index} 
                src={image.url} 
                alt={image.alt || `Imagen ${index + 1}`}
                className="w-full h-48 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>
      )}
      
      {formData.videos.length > 0 && (
        <div className="mt-8">
          <h3>Videos</h3>
          <div className="space-y-4">
            {formData.videos.map((video, index) => (
              <video 
                key={index} 
                src={video.url} 
                controls 
                className="w-full rounded-lg"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {post ? 'Editar Post' : 'Nuevo Post'}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              {showPreview ? <EyeOff size={20} /> : <Eye size={20} />}
              <span>{showPreview ? 'Editar' : 'Vista previa'}</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {showPreview ? (
            renderPreview()
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Título *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Resumen
                    </label>
                    <textarea
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tags (separados por comas)
                    </label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      placeholder="tecnología, desarrollo, web"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="draft">Borrador</option>
                      <option value="published">Publicado</option>
                      <option value="archived">Archivado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL de imagen destacada
                    </label>
                    <input
                      type="url"
                      name="featuredImage"
                      value={formData.featuredImage}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contenido *
                    </label>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      required
                      rows={12}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Media Upload Section */}
              {post?.id && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Gestión de Medios
                  </h3>
                  <MediaUploader
                    onImageUpload={handleImageUpload}
                    onVideoUpload={handleVideoUpload}
                    onImageDelete={handleImageDelete}
                    onVideoDelete={handleVideoDelete}
                    images={formData.images}
                    videos={formData.videos}
                    isUploading={isUploadingMedia}
                  />
                </div>
              )}

              {!post?.id && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 text-sm">
                    💡 <strong>Tip:</strong> Guarda el post primero para poder subir imágenes y videos.
                  </p>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Footer */}
        {!showPreview && (
          <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>{post ? 'Actualizar' : 'Crear'} Post</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPostForm;
