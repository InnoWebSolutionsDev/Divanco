import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useGetSliderProjectsQuery } from '../../features/projects/projectsApi';
import { scrollToSection } from '../../utils/simpleScroll';

const ProjectSection = ({ limit = 6 }) => {
  const { data, isLoading, error } = useGetSliderProjectsQuery(limit);
  const projects = data?.data || [];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Detectar tamaño de pantalla
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Auto-play del slider
  useEffect(() => {
    if (!isAutoPlaying || projects.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % projects.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, projects.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % projects.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + projects.length) % projects.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center py-12 text-gray-400">Cargando proyectos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center py-12 text-red-500">Error al cargar proyectos</div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center py-12 text-gray-400">No hay proyectos destacados</div>
      </div>
    );
  }

  return (
    <div id="projects-section" className="min-h-screen bg-white relative">
      {/* Slider estilo Minotti con slides parcialmente visibles */}
      <section className="relative overflow-hidden bg-gray-50" style={{ 
        height: isMobile ? 'calc(100vh - 80px)' : '100vh',
        paddingTop: isMobile ? '80px' : '0'
      }}>
        {/* Container principal */}
        <div className="relative h-full flex items-center">

          {/* Slides Container - Estilo Minotti con slides parciales */}
          <div 
            className="flex transition-transform duration-1000 ease-out h-full"
            style={isMobile ? {
              // Móvil: Una imagen a la vez, centrada
              transform: `translateX(-${currentSlide * 100}%)`,
              width: `${projects.length * 100}%`,
              paddingLeft: '5%',
              paddingRight: '5%'
            } : {
              // Desktop: Slide central visible + partes de los adyacentes (estilo Minotti)
              transform: `translateX(calc(50% - ${currentSlide * 60}% - 30%))`,
              width: `${projects.length * 60}%`,
              gap: '2rem'
            }}
          >
            {projects.map((project, index) => {
              const isActive = index === currentSlide;
              
              // Usar sliderImage si existe, si no buscar en media
              const sliderImage = project.sliderImage || (project.media && project.media[0]);
              const imageUrl = sliderImage?.urls?.desktop || sliderImage?.urls?.mobile || sliderImage?.url || null;
              
              return (
                <div 
                  key={project.id}
                  className={`relative flex-shrink-0 transition-all duration-1000 ${
                    isMobile 
                      ? 'opacity-100 scale-100 z-10' 
                      : isActive 
                        ? 'opacity-100 scale-100 z-20' 
                        : 'opacity-70 scale-95 z-10'
                  }`}
                  style={isMobile ? {
                    // Móvil: Una imagen por vez
                    width: '90%',
                    height: '80vh',
                    marginRight: '1rem'
                  } : {
                    // Desktop: Slide central grande + parciales laterales
                    width: '60%',
                    height: '85vh',
                    marginRight: '2rem'
                  }}
                >
                  {/* Imagen principal - SIN border-radius en desktop */}
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={project.title}
                      className={`absolute inset-0 w-full h-full object-cover ${isMobile ? 'rounded-lg' : ''}`}
                      onError={(e) => {
                        e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23f5f5f5'/%3E%3Ctext x='400' y='280' text-anchor='middle' fill='%23999' font-size='24' font-family='Arial'%3E" + project.title + "%3C/text%3E%3Ctext x='400' y='320' text-anchor='middle' fill='%23666' font-size='16' font-family='Arial'%3ESin imagen%3C/text%3E%3C/svg%3E";
                      }}
                    />
                  ) : (
                    <div className={`absolute inset-0 w-full h-full bg-gray-200 flex items-center justify-center ${isMobile ? 'rounded-lg' : ''}`}>
                      <span className="text-gray-400">Sin imagen</span>
                    </div>
                  )}
                  
                  {/* Overlay gradient más sutil */}
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent ${isMobile ? 'rounded-lg' : ''}`} />
                  
                  {/* Contenido del slide - Solo visible en slide activo */}
                  <div className={`absolute bottom-0 left-0 right-0 text-white transition-all duration-700 ${
                    (isMobile || isActive) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  } ${isMobile ? 'p-6' : 'p-12 lg:p-16'}`}>
                    <div className="max-w-md">
                      {/* Título del proyecto */}
                      <h2 className={`font-light mb-2 tracking-wide ${
                        isMobile ? 'text-2xl' : 'text-4xl lg:text-5xl'
                      }`}>
                        {project.title}
                      </h2>
                      
                      {/* Ubicación */}
                      {project.location && (
                        <p className={`font-light opacity-90 mb-6 ${
                          isMobile ? 'text-sm' : 'text-lg lg:text-xl'
                        }`}>
                          {project.location}
                        </p>
                      )}
                      
                      {/* Botón Ver más - SIN borde */}
                      <Link 
                        to={`/proyectos/${project.slug}`}
                        className={`inline-flex items-center text-white font-light uppercase tracking-widest hover:opacity-70 transition-all duration-300 group ${
                          isMobile ? 'text-xs' : 'text-sm'
                        }`}
                      >
                        Ver más
                        <svg className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>

                  {/* Número del slide - Solo en slide activo en desktop */}
                  {!isMobile && isActive && (
                    <div className="absolute top-8 left-8 text-white font-light text-xl opacity-80">
                      {(index + 1).toString().padStart(2, '0')}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Controles de navegación */}
          <button
            onClick={prevSlide}
            className={`absolute top-1/2 transform -translate-y-1/2 z-30 bg-black/20 backdrop-blur-sm text-white hover:bg-black/40 transition-all duration-300 ${
              isMobile ? 'left-4 p-3 rounded-full' : 'left-8 p-4 rounded-full'
            }`}
          >
            <ChevronLeftIcon className={isMobile ? 'w-5 h-5' : 'w-6 h-6'} strokeWidth={1} />
          </button>

          <button
            onClick={nextSlide}
            className={`absolute top-1/2 transform -translate-y-1/2 z-30 bg-black/20 backdrop-blur-sm text-white hover:bg-black/40 transition-all duration-300 ${
              isMobile ? 'right-4 p-3 rounded-full' : 'right-8 p-4 rounded-full'
            }`}
          >
            <ChevronRightIcon className={isMobile ? 'w-5 h-5' : 'w-6 h-6'} strokeWidth={1} />
          </button>
        </div>

        {/* Indicadores inferiores */}
        <div className={`absolute left-1/2 transform -translate-x-1/2 z-30 flex ${
          isMobile ? 'bottom-8 space-x-2' : 'bottom-12 space-x-3'
        }`}>
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-1 rounded-full transition-all duration-500 ${
                index === currentSlide 
                  ? isMobile 
                    ? 'bg-white w-8' 
                    : 'bg-white w-12'
                  : isMobile
                    ? 'bg-white/50 hover:bg-white/70 w-4'
                    : 'bg-white/50 hover:bg-white/70 w-6'
              }`}
            />
          ))}
        </div>

        {/* Contador elegante */}
        <div className={`absolute z-30 text-white font-light ${
          isMobile ? 'top-8 right-4 text-sm' : 'top-8 right-8 text-lg'
        }`}>
          <span>{(currentSlide + 1).toString().padStart(2, '0')}</span>
          <span className="text-white/60 mx-2">—</span>
          <span className="text-white/60">{projects.length.toString().padStart(2, '0')}</span>
        </div>

        {/* Control de auto-play */}
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className={`absolute z-30 bg-black/20 backdrop-blur-sm text-white hover:bg-black/40 transition-all duration-300 rounded-full ${
            isMobile ? 'bottom-8 right-4 p-2' : 'bottom-12 right-8 p-3'
          }`}
        >
          {isAutoPlaying ? (
            <svg className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} fill="currentColor" viewBox="0 0 20 20">
              <path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75A.75.75 0 007.25 3h-1.5zM12.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z" />
            </svg>
          ) : (
            <svg className={isMobile ? 'w-4 h-4' : 'w-5 h-5'} fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          )}
        </button>

        {/* Flecha de navegación */}
        <button 
          onClick={() => scrollToSection('#blog-section')}
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 cursor-pointer hover:scale-110 transition-transform duration-300 z-20"
          aria-label="Ver blog"
        >
          <div className="w-px h-6 bg-gray-300 mx-auto mb-2"></div>
          <svg className="w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors duration-300 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </section>
    </div>
  );
};

export default ProjectSection;