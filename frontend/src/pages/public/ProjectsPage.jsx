import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const ProjectsPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Datos de ejemplo para los proyectos
  const projects = [
    {
      id: 1,
      title: "Casa Minimalista",
      subtitle: "Arquitectura contemporánea",
      image: "/images/prueba/living.png",
      description: "Diseño elegante con líneas limpias"
    },
    {
      id: 2,
      title: "Loft Urbano",
      subtitle: "Espacios industriales",
      image: "/images/prueba/modelo.png",
      description: "Fusión perfecta entre lo urbano y elegante"
    },
    {
      id: 3,
      title: "Villa Mediterránea",
      subtitle: "Lujo costero",
      image: "/images/prueba/piscina.png",
      description: "Inspiración mediterránea con toques modernos"
    },
    {
      id: 4,
      title: "Penthouse Moderno",
      subtitle: "Altura y sofisticación",
      image: "/images/prueba/hero.png",
      description: "Vistas panorámicas con diseño excepcional"
    },
    {
      id: 5,
      title: "Oficina Corporativa",
      subtitle: "Espacios de trabajo",
      image: "/images/prueba/living.png",
      description: "Productividad y estilo en perfecta armonía"
    }
  ];

  // Auto-play del slider
  useEffect(() => {
    if (!isAutoPlaying) return;
    
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

  return (
    <div className="min-h-screen bg-white">
      {/* Multi-slide Carousel estilo Minotti */}
      <section className="relative h-screen overflow-hidden bg-gray-50">
        {/* Container principal con padding lateral */}
        <div className="relative h-full flex items-center px-8 lg:px-16">
          
          {/* Slides Container - Más ancho con espacios */}
         <div 
  className="flex transition-transform duration-1000 ease-out"
  style={{ 
    transform: `translateX(-${currentSlide * 60}%)`, // Ajustado para imágenes más grandes
    gap: '2rem', // Espacio entre slides
    width: `${projects.length * 60}%` // Ancho total ajustado
  }}
>
  {projects.map((project, index) => {
    const isActive = index === currentSlide;
    
    return (
      <div 
        key={project.id}
        className={`relative flex-shrink-0 transition-all duration-1000 ${
          isActive 
            ? 'opacity-100 scale-100 z-10' 
            : 'opacity-70 scale-95 z-5'
        }`}
        style={{ 
          width: '55%', // TODAS las imágenes del mismo tamaño grande
          height: '85vh',
          marginRight: '2rem'
        }}
      >
        {/* Imagen principal */}
        <img
          src={project.image}
          alt={project.title}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23f5f5f5'/%3E%3Ctext x='400' y='280' text-anchor='middle' fill='%23999' font-size='24' font-family='Arial'%3E" + project.title + "%3C/text%3E%3Ctext x='400' y='320' text-anchor='middle' fill='%23666' font-size='16' font-family='Arial'%3E" + project.subtitle + "%3C/text%3E%3C/svg%3E";
          }}
        />
        
        {/* Overlay gradient sutil */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        
        {/* Contenido del slide - solo en el activo */}
        <div className={`absolute bottom-0 left-0 right-0 p-8 text-white transition-all duration-700 ${
          isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          <div className="max-w-md">
            <h3 className="text-3xl lg:text-4xl font-light mb-3 tracking-wide">
              {project.title}
            </h3>
            <p className="text-base lg:text-lg font-light opacity-90 mb-6 leading-relaxed">
              {project.subtitle}
            </p>
            
            <button className="inline-flex items-center px-8 py-3 border border-white text-white text-sm font-light uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300 group">
              Find out more
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>

        {/* Número del slide */}
        <div className={`absolute top-6 left-6 text-white font-light text-2xl transition-opacity duration-500 ${
          isActive ? 'opacity-100' : 'opacity-60'
        }`}>
          {(index + 1).toString().padStart(2, '0')}
        </div>
      </div>
    );
  })}
</div>

          {/* Controles de navegación - más elegantes */}
          <button
            onClick={prevSlide}
            className="absolute left-8 top-1/2 transform -translate-y-1/2 z-30 p-4 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all duration-300 rounded-full border border-white/20"
          >
            <ChevronLeftIcon className="w-6 h-6" strokeWidth={1} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-8 top-1/2 transform -translate-y-1/2 z-30 p-4 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all duration-300 rounded-full border border-white/20"
          >
            <ChevronRightIcon className="w-6 h-6" strokeWidth={1} />
          </button>
        </div>

        {/* Indicadores inferiores - más grandes */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-30 flex space-x-3">
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-1 rounded-full transition-all duration-500 ${
                index === currentSlide 
                  ? 'bg-white w-12' 
                  : 'bg-white/40 hover:bg-white/60 w-6'
              }`}
            />
          ))}
        </div>

        {/* Contador elegante */}
        <div className="absolute top-8 right-8 z-30 text-white font-light">
          <span className="text-2xl">{(currentSlide + 1).toString().padStart(2, '0')}</span>
          <span className="text-white/60 mx-3">—</span>
          <span className="text-white/60 text-lg">{projects.length.toString().padStart(2, '0')}</span>
        </div>

        {/* Control de auto-play */}
        <button
          onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          className="absolute bottom-12 right-8 z-30 p-3 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all duration-300 rounded-full border border-white/20"
        >
          {isAutoPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75A.75.75 0 007.25 3h-1.5zM12.75 3a.75.75 0 00-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 00.75-.75V3.75a.75.75 0 00-.75-.75h-1.5z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          )}
        </button>
      </section>

      {/* Sección adicional */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-light mb-4 uppercase tracking-wider text-gray-900">
            Explora Nuestros Proyectos
          </h2>
          <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
            Cada proyecto refleja nuestra pasión por el diseño excepcional y la atención al detalle.
          </p>
        </div>
      </section>
    </div>
  );
};

export default ProjectsPage;