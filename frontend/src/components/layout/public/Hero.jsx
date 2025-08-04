import { Link } from 'react-router-dom';

const Hero = ({ 
  backgroundImage = '/images/prueba/hero.png',
  
}) => {
  // Debug: log de la imagen para verificar
  console.log('Hero backgroundImage:', backgroundImage);
  
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden -mt-20">
      {/* -mt-20 compensa la altura del header (h-20) para que la imagen empiece desde arriba */}
      
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-gray-900"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Overlay oscuro para mejorar legibilidad del texto */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content - Ajustado para compensar el header */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        {/* mt-20 empuja el contenido hacia abajo para que no se superponga con el header */}
       

       
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="w-px h-16 bg-white/50 mx-auto mb-4"></div>
        <svg 
          className="w-6 h-6 text-white/70 animate-bounce" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1} 
            d="M19 14l-7 7m0 0l-7-7m7 7V3" 
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;