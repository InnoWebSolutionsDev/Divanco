import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useGetProjectBySlugQuery } from '../../features/projects/projectsApi';
import RelatedProjects from '../../components/ui/RelatedProjects';
import ProjectNavigation from '../../components/ui/ProjectNavigation';
import ImageLightbox from '../../components/ui/ImageLightbox';
import { ScrollProgress, ProjectBreadcrumbs, FloatingActions } from '../../components/ui/ProjectExtras';
import ProjectSEO from '../../components/ui/ProjectSEO';

// Imagen principal limpia
const ProjectHero = ({ project, mainImage }) => (
  <div className="relative h-[60vh] w-full overflow-hidden">
    {mainImage ? (
      <img
        src={mainImage.urls?.desktop || mainImage.urls?.mobile || mainImage.url}
        alt={project.title}
        className="w-full h-full object-cover"
      />
    ) : (
      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-300 flex items-center justify-center">
        <span className="text-gray-400 text-xl font-alt">Sin imagen</span>
      </div>
    )}
  </div>
);

// ✅ NUEVO: Información del proyecto en dos columnas
const ProjectInfo = ({ project }) => (
   <div className="max-w-7xl mx-auto mt-8 relative z-10 px-6 md:px-8">
    <div className="bg-white rounded-xl shadow-xl overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
        
        {/* ✅ COLUMNA IZQUIERDA: Descripción scrolleable (2/3 del ancho) */}
        <div className="lg:col-span-2 p-8 lg:p-12">
          <div className="space-y-6">
            <div>
              {/* ✅ NUEVO ESTILO DE TÍTULO - Similar al BlogSection */}
              <h1 className="text-4xl lg:text-5xl font-light text-gray-600 mb-4 leading-tight">
                {project.title}
                {project.architect && (
                  <span className="block text-sm font-normal text-gray-500 mt-3 tracking-wider uppercase">
                    — POR {project.architect}
                  </span>
                )}
                {!project.architect && project.projectType && (
                  <span className="block text-sm font-normal text-gray-500 mt-3 tracking-wider uppercase">
                    — {project.projectType}
                  </span>
                )}
              </h1>
            </div>

            {project.description && (
              <div className="relative">
                {/* ✅ CONTENEDOR CON MENOS ALTURA Y GRADIENTE */}
                <div 
                  className="text-gray-700 font-light leading-relaxed text-base md:text-lg max-h-48 overflow-y-auto pr-4 custom-scrollbar relative"
                  style={{ lineHeight: '1.7' }}
                >
                  {project.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
                
                {/* ✅ GRADIENTE INDICADOR DE MÁS CONTENIDO */}
                <div className="absolute bottom-0 left-0 right-4 h-8 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                
                {/* ✅ INDICADOR VISUAL DE SCROLL */}
                <div className="flex items-center justify-center mt-3 text-gray-400">
                  <div className="flex items-center gap-2 text-xs font-light">
                    <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                    <span className="tracking-wider uppercase">Desliza para ver más contenido</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tags con estilo mejorado */}
            {project.tags && project.tags.length > 0 && (
              <div className="pt-6 border-t border-gray-100">
                <h4 className="text-xs font-medium text-gray-500 tracking-wider uppercase mb-3">
                  — Etiquetas
                </h4>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-light bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors tracking-wider"
                    >
                      #{tag.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ✅ COLUMNA DERECHA: Metadatos con tipografía mejorada */}
        <div className="bg-gray-50 p-8 lg:p-12 border-l border-gray-100">
          <div className="space-y-8">
            <div>
              <h3 className="text-xs font-medium text-gray-500 tracking-wider uppercase mb-6 border-b border-gray-200 pb-2">
                — Información del Proyecto
              </h3>
              <div className="space-y-5">
                
                {project.year && (
                  <div className="group">
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Año
                    </dt>
                    <dd className="text-2xl font-light text-gray-900">
                      {project.year}
                    </dd>
                  </div>
                )}

                {project.location && (
                  <div className="group">
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Ubicación
                    </dt>
                    <dd className="text-lg font-light text-gray-900 leading-relaxed">
                      {project.location}
                    </dd>
                  </div>
                )}

                {project.client && (
                  <div className="group">
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Cliente
                    </dt>
                    <dd className="text-lg font-light text-gray-900">
                      {project.client}
                    </dd>
                  </div>
                )}

                {project.projectType && (
                  <div className="group">
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                      ETAPA
                    </dt>
                    <dd className="text-lg font-light text-gray-900">
                      {project.projectType}
                    </dd>
                  </div>
                )}

                

                {project.area && (
                  <div className="group">
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                      Área
                    </dt>
                    <dd className="text-lg font-light text-gray-900">
                      {project.area}
                    </dd>
                  </div>
                )}

              </div>
            </div>

            {/* ✅ Información adicional con estilo mejorado */}
            {(project.startDate || project.endDate) && (
              <div>
                <h4 className="text-xs font-medium text-gray-500 tracking-wider uppercase mb-4 border-b border-gray-200 pb-2">
                  — Cronología
                </h4>
                <div className="space-y-4">
                  {project.startDate && (
                    <div>
                      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                        Inicio
                      </dt>
                      <dd className="text-base font-light text-gray-900">
                        {new Date(project.startDate).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long'
                        })}
                      </dd>
                    </div>
                  )}
                  {project.endDate && (
                    <div>
                      <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                        Finalización
                      </dt>
                      <dd className="text-base font-light text-gray-900">
                        {new Date(project.endDate).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long'
                        })}
                      </dd>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ✅ CTA con estilo mejorado */}
            {project.kuulaUrl && (
              <div className="pt-6 border-t border-gray-200">
                <a
                  href="#virtual-tour"
                  className="inline-flex items-center justify-center w-full px-4 py-3 text-sm font-light text-white bg-naranjaDivanco hover:bg-orange-600 rounded-none transition-all duration-200 shadow-sm hover:shadow-md tracking-wider uppercase"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 002 2v8a2 2 0 002 2z" />
                  </svg>
                  Ver Tour Virtual
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* ✅ INDICADOR VISUAL DE QUE HAY MÁS CONTENIDO DEBAJO - Mejorado */}
    <div className="flex flex-col items-center mt-16 mb-8">
      <div className="text-center space-y-4">
        <h3 className="text-xs font-medium text-gray-500 tracking-wider uppercase">
          — Galería del Proyecto
        </h3>
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-naranjaDivanco rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-naranjaDivanco rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
          <div className="w-2 h-2 bg-naranjaDivanco rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
        </div>
        <svg 
          className="w-6 h-6 text-naranjaDivanco animate-bounce mx-auto" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  </div>
);

const IMAGE_TYPES = [
  { key: 'render', label: 'Renders' },
  { key: 'obra_finalizada', label: 'Obra Finalizada' },
  { key: 'obra_proceso', label: 'Obra en Proceso' },
  { key: 'plano', label: 'Planos' },
  { key: 'image', label: 'Imágenes' },
];

// Galería de imágenes agrupada y sincronizada con el lightbox
const ProjectGallery = ({ mediaFiles, galleryImages, onImageClick }) => {
  if (!mediaFiles || mediaFiles.length === 0) return null;

  return (
    <div className="bg-gray-50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-8 md:px-16 space-y-12">
        {IMAGE_TYPES.map(({ key, label }) => {
          const images = mediaFiles.filter(file =>
            file.type === key && file.urls && file.type !== 'video'
          );
          if (images.length === 0) return null;
          return (
            <div key={key}>
              {/* ✅ Título de sección con estilo mejorado */}
              <h3 className="text-lg font-light text-gray-500 mb-6 tracking-wider uppercase">
                — {label}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="group cursor-pointer overflow-hidden bg-white rounded-none shadow-sm hover:shadow-xl transition-all duration-300"
                    onClick={() => onImageClick(galleryImages.findIndex(f => f.id === image.id))}
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={image.urls?.desktop || image.urls?.mobile || image.urls?.thumbnail || image.url}
                        alt={image.description || `Imagen`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    {image.description && (
                      <div className="p-3 text-xs font-light text-gray-500 tracking-wider">{image.description}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Tour virtual
const VirtualTour = ({ kuulaUrl }) => {
  if (!kuulaUrl) return null;
  return (
    <div id="virtual-tour" className="bg-gray-900 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-8 md:px-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-light mb-4 text-white">
            Tour Virtual 360°
            <span className="block text-sm font-normal text-gray-300 mt-3 tracking-wider uppercase">
              — Explora el proyecto en una experiencia inmersiva
            </span>
          </h2>
        </div>
        <div className="relative aspect-video bg-gray-800 rounded-none overflow-hidden shadow-2xl ring-1 ring-white/10">
          <iframe
            src={kuulaUrl}
            title="Tour Virtual 360°"
            className="w-full h-full"
            allowFullScreen
            frameBorder="0"
          />
          {/* Indicador de carga */}
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
            <div className="text-white space-y-4 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-600 border-t-white mx-auto"></div>
              <p className="text-gray-300 font-light tracking-wider uppercase text-sm">Cargando tour virtual...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectDetailPage = () => {
  const { slug } = useParams();
  const { data: projectResponse, error, isLoading } = useGetProjectBySlugQuery(slug);
  const project = projectResponse?.data;
  const [mainImage, setMainImage] = useState(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [shareSuccess, setShareSuccess] = useState(false);

  // Array plano de imágenes para lightbox y galería
  const galleryImages = useMemo(() =>
    project?.media?.filter(file => file.urls && file.type !== 'video') || [],
    [project]
  );

  // Seleccionar imagen principal
  useEffect(() => {
    if (project?.media) {
      const images = project.media.filter(file => file.type === 'image' || file.type === 'render');
      const featured = images.find(img => img.isMain);
      const selectedImage = featured || images[0] || null;
      setMainImage(selectedImage);
    }
  }, [project]);

  // Manejar clicks en galería
  const handleImageClick = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleCloseLightbox = () => setLightboxOpen(false);
  const handleNextImage = (index) => setLightboxIndex(index);
  const handlePrevImage = (index) => setLightboxIndex(index);

  const handleShareClick = () => {
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 2000);
  };

  useEffect(() => {
    if (project) {
      document.title = `${project.title} | Divanco`;
    }
    return () => {
      document.title = 'Divanco';
    };
  }, [project]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-naranjaDivanco mx-auto"></div>
            <div className="absolute inset-0 animate-ping rounded-full h-16 w-16 border-4 border-naranjaDivanco/20 mx-auto"></div>
          </div>
          <div className="space-y-2">
            <p className="text-gray-600 font-alt font-medium">Cargando proyecto...</p>
            <div className="flex space-x-1 justify-center">
              <div className="w-2 h-2 bg-naranjaDivanco rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-naranjaDivanco rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-naranjaDivanco rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) return <Navigate to="/404" replace />;
  if (!project) return <Navigate to="/proyectos" replace />;

  return (
    <div className="min-h-screen bg-white">
      {/* SEO Meta Tags */}
      <ProjectSEO 
        project={project} 
        mainImage={mainImage} 
        currentUrl={window.location.href} 
      />
      {/* Scroll Progress */}
      <ScrollProgress />
      {/* Breadcrumbs */}
      <ProjectBreadcrumbs project={project} />
      {/* Hero Section */}
      <ProjectHero project={project} mainImage={mainImage} />
      {/* ✅ NUEVA: Información del proyecto en dos columnas */}
      <ProjectInfo project={project} />
      {/* Galería agrupada */}
      <ProjectGallery mediaFiles={project.media} galleryImages={galleryImages} onImageClick={handleImageClick} />
      {/* Virtual Tour */}
      <VirtualTour kuulaUrl={project.kuulaUrl} />
      {/* Related Projects */}
      <RelatedProjects currentProject={project} />
      {/* Navigation */}
      <ProjectNavigation currentProject={project} />
      {/* Floating Actions */}
      <FloatingActions project={project} onShareClick={handleShareClick} />
      {/* Share Success Notification */}
      {shareSuccess && (
        <div className="fixed bottom-20 right-8 bg-green-500 text-white px-6 py-3 rounded-lg shadow-xl z-50 animate-fade-in-up border border-green-400">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-alt font-medium">¡Enlace copiado al portapapeles!</span>
          </div>
        </div>
      )}
      {/* Image Lightbox */}
      <ImageLightbox
        images={galleryImages}
        isOpen={lightboxOpen}
        currentIndex={lightboxIndex}
        onClose={handleCloseLightbox}
        onNext={handleNextImage}
        onPrev={handlePrevImage}
      />
      
      {/* ✅ Custom scrollbar styles */}
<style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 3px;
          transition: background 0.2s ease;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
        
        /* ✅ Animación suave para el contenido de scroll */
        .custom-scrollbar {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
};

export default ProjectDetailPage;