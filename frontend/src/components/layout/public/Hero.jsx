import { Link } from 'react-router-dom';

const Hero = ({ 
  backgroundImage = '/images/prueba/hero.png',
 
}) => {
  // Debug: log de la imagen para verificar
  console.log('Hero backgroundImage:', backgroundImage);
  
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Ya no necesitamos -mt-20 porque el header es fixed */}
      
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
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Content - Centrado verticalmente */}
      <div className="relative z-10 text-center text-white max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* El header ya ocupa su espacio naturalmente */}
        
       
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-10">
        <div className="w-px h-20 bg-white/40 mx-auto mb-4"></div>
        <svg 
          className="w-6 h-6 text-white/60 animate-bounce" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M19 14l-7 7m0 0l-7-7m7 7V3" 
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;