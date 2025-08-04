import { Link } from 'react-router-dom';

import heroImage from '../../../../public/images/prueba/hero.png'; 

const Hero = ({ 
  backgroundImage = heroImage, 
}) => {
  console.log('Hero backgroundImage:', backgroundImage);
  
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background de fallback - DETRÁS de todo */}
      <div className="absolute inset-0 bg-gray-900 -z-10" />
      
      {/* Imagen principal - SIEMPRE LLENA LA PANTALLA */}
      <img
        src={backgroundImage}
        alt="Hero Background"
        className="absolute inset-0 w-full h-full object-cover object-center z-0"
        onLoad={() => console.log('✅ Imagen cargada!')}
        onError={() => console.log('❌ Error cargando imagen')}
      />
      
      {/* Overlay oscuro - ENCIMA de la imagen */}
      <div className="absolute inset-0 bg-black/20 z-10" />

      {/* Content - ENCIMA de todo */}
      <div className="relative z-20 text-center text-white max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tu contenido */}
      </div>

      {/* Scroll Indicator - ENCIMA de todo */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 z-20">
        <div className="w-px h-20 bg-white/40 mx-auto mb-4"></div>
        <svg className="w-6 h-6 text-white/60 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;